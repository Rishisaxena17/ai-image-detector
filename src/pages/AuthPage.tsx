import { Loader2, Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { api } from '../lib/api'

export function AuthPage() {
  const navigate = useNavigate()
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false)
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false)

  const handleLogin = async () => {
    setLoginError('')
    setIsSubmittingLogin(true)
    try {
      const response = await api.post<{ access_token: string; user: { email: string } }>('/login', {
        email: loginEmail,
        password: loginPassword,
      })
      window.localStorage.setItem('veritas-access-token', response.access_token)
      navigate('/detector')
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Unable to sign in.')
    } finally {
      setIsSubmittingLogin(false)
    }
  }

  const handleRegister = async () => {
    setRegisterError('')
    setIsSubmittingRegister(true)
    try {
      const response = await api.post<{ access_token: string; user: { email: string } }>('/register', {
        email: registerEmail,
        full_name: registerName,
        password: registerPassword,
      })
      window.localStorage.setItem('veritas-access-token', response.access_token)
      navigate('/detector')
    } catch (error) {
      setRegisterError(error instanceof Error ? error.message : 'Unable to create account.')
    } finally {
      setIsSubmittingRegister(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl py-10">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Access your secure forensic review workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-500" size={16} />
                <Input className="pl-10" placeholder="analyst@veritasai.app" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-500" size={16} />
                <Input type="password" className="pl-10" placeholder="••••••••" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} />
              </div>
            </div>
            {loginError ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{loginError}</div> : null}
            <Button className="w-full" onClick={handleLogin} disabled={isSubmittingLogin || !loginEmail || !loginPassword}>
              {isSubmittingLogin ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : 'Sign in'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Create account</CardTitle>
            <CardDescription>Start a secure account for image review investigations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-500" size={16} />
                <Input className="pl-10" placeholder="Alex Morgan" value={registerName} onChange={(event) => setRegisterName(event.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Work email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-500" size={16} />
                <Input className="pl-10" placeholder="alex@company.com" value={registerEmail} onChange={(event) => setRegisterEmail(event.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-500" size={16} />
                <Input type="password" className="pl-10" placeholder="Create a strong password" value={registerPassword} onChange={(event) => setRegisterPassword(event.target.value)} />
              </div>
            </div>
            {registerError ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{registerError}</div> : null}
            <Button variant="secondary" className="w-full" onClick={handleRegister} disabled={isSubmittingRegister || !registerName || !registerEmail || !registerPassword}>
              {isSubmittingRegister ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</> : 'Create account'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
