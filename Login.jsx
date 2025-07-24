import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tractor, AlertCircle } from 'lucide-react'
import ApiService from '../services/api'

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await ApiService.login(formData.email, formData.senha)
      onLogin(response.user)
    } catch (error) {
      setError(error.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleInitAdmin = async () => {
    try {
      const response = await ApiService.initAdmin()
      setError('')
      alert(`Administrador criado!\nEmail: ${response.email}\nSenha: ${response.senha}`)
    } catch (error) {
      setError(error.message || 'Erro ao criar administrador')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Tractor className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">AgroCRM</CardTitle>
          <CardDescription>
            Sistema de Gestão de Relacionamento com Clientes Agrícolas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => handleInputChange('senha', e.target.value)}
                placeholder="Sua senha"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          
          <div className="mt-6 pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full text-sm"
              onClick={handleInitAdmin}
            >
              Criar Administrador Inicial
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Use apenas na primeira configuração do sistema
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login

