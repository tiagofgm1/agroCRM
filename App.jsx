import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import VendedorDashboard from './components/VendedorDashboard'
import GerenteDashboard from './components/GerenteDashboard'
import ClienteForm from './components/ClienteForm'
import ApiService from './services/api'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há token salvo e validar
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          ApiService.setToken(token)
          const userData = await ApiService.getCurrentUser()
          setUser(userData)
        } catch (error) {
          console.error('Token inválido:', error)
          ApiService.logout()
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    ApiService.logout()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? (
                <Navigate to={user.tipo === 'gerente' ? '/gerente' : '/vendedor'} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
          <Route 
            path="/vendedor" 
            element={
              user && user.tipo === 'vendedor' ? (
                <VendedorDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/gerente" 
            element={
              user && user.tipo === 'gerente' ? (
                <GerenteDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/cliente/:id?" 
            element={
              user ? (
                <ClienteForm user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

