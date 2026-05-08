import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { FormField } from '../components/shared/FormField'
import { useLogin } from '../hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate, isPending, error } = useLogin()

  const handleSubmit = () => {
    if (!email || !password) return
    mutate({ email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Stockwise</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão de estoque simplificada</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Entrar</CardTitle>
            <CardDescription>Acesse sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField id="email" label="Email" type="email" placeholder="voce@email.com" value={email} onChange={setEmail} />
            <FormField id="password" label="Senha" type="password" placeholder="••••••" value={password} onChange={setPassword} />

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                Email ou senha incorretos
              </p>
            )}

            <Button onClick={handleSubmit} disabled={isPending} className="w-full mt-1">
              {isPending ? 'Entrando...' : 'Entrar'}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Não tem conta?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Criar agora
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}