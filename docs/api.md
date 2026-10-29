# API Documentation

## Auth endpoints

### POST /api/v1/register
- Creates a new user account
- Payload: email, full_name, password
- Returns: access_token and user

### POST /api/v1/login
- Authenticates an existing account
- Returns JWT bearer token

### GET /api/v1/me
- Returns the authenticated user

## Analysis endpoints

### POST /api/v1/analyze
- Multipart form file upload
- Returns the prediction result and stored metadata
- Requires bearer token

### GET /api/v1/analyses
- Lists the authenticated user's analyses with pagination

### GET /api/v1/analyses/{analysis_id}
- Returns a single owned record

### DELETE /api/v1/analyses/{analysis_id}
- Deletes the user-owned analysis and file if present
- Returns 204 status

### GET /api/v1/health
- Returns service health status

### GET /api/v1/model/status
- Returns model readiness and identity

### POST /api/v1/forensics/inspect
- Inspects image metadata, SHA-256 fingerprint, and robustness checks
- Returns a structured forensics payload
