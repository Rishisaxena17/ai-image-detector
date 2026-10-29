import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export function PrivacyPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Privacy</div>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">Data handling and privacy</h1>
      </div>

      <Card className="border-white/10 bg-slate-900/80">
        <CardHeader>
          <CardTitle>Secure-by-default approach</CardTitle>
          <CardDescription>Important local-first design principles for this project.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-slate-300">
          <p>Uploaded images are processed server-side and kept separate from code repositories or public assets. The local development environment is intended for testing only.</p>
          <p>Secrets, model weights, and private images must never be committed to Git. Use environment variables, local configuration files, and secure storage for any production deployment.</p>
          <p>The product is designed to support a review workflow, and any deployment should align with local privacy standards, access control policies, and user consent requirements.</p>
        </CardContent>
      </Card>
    </div>
  )
}
