import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import * as authApi from '../api/auth.api'
import { getAccessToken, setAccessToken } from '../store/auth.store'

export function useLogin() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: () => navigate('/dashboard'),
  })
}

export function useRegister() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: ({ storeName, email, password }: { storeName: string; email: string; password: string }) =>
      authApi.register(storeName, email, password),
    onSuccess: () => navigate('/dashboard'),
  })
}

export function useLogout() {
  const navigate = useNavigate()
  return () => {
    setAccessToken(null)
    navigate('/login')
  }
}

export function isAuthenticated() {
  return !!getAccessToken()
}