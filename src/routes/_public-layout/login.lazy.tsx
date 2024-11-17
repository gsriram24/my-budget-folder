import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import supabase from '@/supabaseClient'
import { createLazyFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react'

export const Route = createLazyFileRoute('/_public-layout/login')({
  component: Login,
})

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({
      email,
    })
    if (error) {
      setError(error.message)
    } else {
      setError(null)
      // Redirect or perform other actions on successful login
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button type="submit">Login</Button>
      </form>
    </div>
  )
}
