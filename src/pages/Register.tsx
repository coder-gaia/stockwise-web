import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { FormField } from '../components/shared/FormField'
import { useRegister } from '../hooks/useAuth'

export default function RegisterPage() {
  const [storeName, setStoreName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate, isPending, error } = useRegister()

  const handleSubmit = () => {
    if (!storeName || !email || !password) return
    mutate({ storeName, email, password })
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
            <CardTitle className="text-lg">Criar conta</CardTitle>
            <CardDescription>Configure sua loja em menos de um minuto</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField id="storeName" label="Nome da loja" placeholder="Mercadinho do João" value={storeName} onChange={setStoreName} />
            <FormField id="email" label="Email" type="email" placeholder="voce@email.com" value={email} onChange={setEmail} />
            <FormField id="password" label="Senha" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={setPassword} />

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                Não foi possível criar a conta. Tente outro email.
              </p>
            )}

            <Button onClick={handleSubmit} disabled={isPending} className="w-full mt-1">
              {isPending ? 'Criando conta...' : 'Criar conta'}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Já tem conta?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}