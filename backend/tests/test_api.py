from __future__ import annotations

import io
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app.main import app
from app.models import User
from app.security import get_password_hash


@pytest.fixture
def client() -> TestClient:
    from app.database import SessionLocal
    from app.database import Base
    from app.database import engine

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    with TestClient(app) as test_client:
        yield test_client

    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def auth_headers(client: TestClient) -> dict[str, str]:
    response = client.post(
        '/api/v1/register',
        json={'email': 'user@example.com', 'full_name': 'Demo User', 'password': 'Password123!'},
    )
    assert response.status_code == 200
    token = response.json()['access_token']
    return {'Authorization': f'Bearer {token}'}


def make_png_bytes() -> bytes:
    buffer = io.BytesIO()
    image = Image.new('RGB', (224, 224), color=(123, 45, 67))
    image.save(buffer, format='PNG')
    return buffer.getvalue()


def test_register_and_login(client: TestClient) -> None:
    register = client.post('/api/v1/register', json={'email': 'new@example.com', 'full_name': 'New User', 'password': 'Password123!'})
    assert register.status_code == 200
    data = register.json()
    assert data['user']['email'] == 'new@example.com'
    assert 'access_token' in data

    login = client.post('/api/v1/login', json={'email': 'new@example.com', 'password': 'Password123!'})
    assert login.status_code == 200
    assert login.json()['user']['email'] == 'new@example.com'


def test_analyze_does_not_require_auth(client: TestClient) -> None:
    response = client.post('/api/v1/analyze', files={'file': ('test.png', make_png_bytes(), 'image/png')})
    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload['prediction'] in {'authentic', 'ai_generated', 'inconclusive'}
    assert payload['owner_id']
    assert payload['model_id']


def test_analyze_success(client: TestClient, auth_headers: dict[str, str]) -> None:
    response = client.post('/api/v1/analyze', files={'file': ('test.png', make_png_bytes(), 'image/png')}, headers=auth_headers)
    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload['prediction'] in {'authentic', 'ai_generated', 'inconclusive'}
    assert payload['owner_id']
    assert payload['model_id']


def test_analyze_invalid_image(client: TestClient, auth_headers: dict[str, str]) -> None:
    response = client.post('/api/v1/analyze', files={'file': ('bad.txt', b'not-an-image', 'text/plain')}, headers=auth_headers)
    assert response.status_code in {400, 422}


def test_access_control_for_analysis(client: TestClient, auth_headers: dict[str, str]) -> None:
    first = client.post('/api/v1/analyze', files={'file': ('test.png', make_png_bytes(), 'image/png')}, headers=auth_headers)
    analysis_id = first.json()['id']

    second_response = client.post('/api/v1/register', json={'email': 'other@example.com', 'full_name': 'Other User', 'password': 'Password123!'})
    other_token = second_response.json()['access_token']
    other_headers = {'Authorization': f'Bearer {other_token}'}

    get_response = client.get(f'/api/v1/analyses/{analysis_id}', headers=other_headers)
    assert get_response.status_code == 404


def test_list_analyses_and_delete(client: TestClient, auth_headers: dict[str, str]) -> None:
    client.post('/api/v1/analyze', files={'file': ('test.png', make_png_bytes(), 'image/png')}, headers=auth_headers)
    items = client.get('/api/v1/analyses', headers=auth_headers)
    assert items.status_code == 200
    payload = items.json()
    assert payload['total'] >= 1

    analysis_id = payload['items'][0]['id']
    delete_response = client.delete(f'/api/v1/analyses/{analysis_id}', headers=auth_headers)
    assert delete_response.status_code == 204


def test_model_unavailable(monkeypatch: pytest.MonkeyPatch, client: TestClient, auth_headers: dict[str, str]) -> None:
    def broken_predict(*args, **kwargs):
        raise RuntimeError('model offline')

    import app.analysis_routes as analysis_routes
    monkeypatch.setattr(analysis_routes.ModelService, 'predict', broken_predict)

    response = client.post('/api/v1/analyze', files={'file': ('test.png', make_png_bytes(), 'image/png')}, headers=auth_headers)
    assert response.status_code == 503


def test_forensics_inspection(client: TestClient, auth_headers: dict[str, str]) -> None:
    response = client.post('/api/v1/forensics/inspect', files={'file': ('test.png', make_png_bytes(), 'image/png')})
    assert response.status_code == 200
    data = response.json()
    assert 'image' in data and 'quality_tests' in data and 'explainability' in data
    assert data['image']['file_size_bytes'] > 0
    assert len(data['quality_tests']) == 3
    assert data['explainability']['status'] in {'experimental', 'not_supported'}


def test_health_and_model_status(client: TestClient) -> None:
    health = client.get('/api/v1/health')
    assert health.status_code == 200
    assert health.json()['service'] == 'veritas-ai-backend'

    model_status = client.get('/api/v1/model/status')
    assert model_status.status_code == 200
    assert 'model_id' in model_status.json()
