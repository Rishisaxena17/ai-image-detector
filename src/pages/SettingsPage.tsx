import { Bell, LockKeyhole, UserCog } from 'lucide-react'

import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Account</div>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-slate-900">Settings</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserCog size={18} /> Profile</CardTitle>
            <CardDescription>Update your personal account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-600">Full name</label>
              <Input defaultValue="Alex Morgan" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-600">Email</label>
              <Input defaultValue="alex@veritasai.app" />
            </div>
            <Button>Save profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell size={18} /> Notifications</CardTitle>
            <CardDescription>Choose what you want to be alerted about.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3"><span>New review results</span><input type="checkbox" defaultChecked /></label>
            <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3"><span>Weekly summary</span><input type="checkbox" /></label>
            <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3"><span>Security alerts</span><input type="checkbox" defaultChecked /></label>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LockKeyhole size={18} /> Password</CardTitle>
            <CardDescription>Update your password and access control preferences.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-slate-600">Current password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-600">New password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="md:col-span-2">
              <Button variant="secondary">Update password</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
