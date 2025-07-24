import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  Plus, 
  Search, 
  Thermometer, 
  DollarSign, 
  MapPin,
  LogOut,
  Tractor,
  Edit,
  Trash2,
  AlertCircle,
  TrendingUp,
  Target
} from 'lucide-react'
import ApiService from '../services/api'

const VendedorDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtro, setFiltro] = useState('')
  const [temperaturaFiltro, setTemperaturaFiltro] = useState('Todas')

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    try {
      setLoading(true)
      const clientesData = await ApiService.getClientes()
      setClientes(clientesData)
    } catch (error) {
      setError('Erro ao carregar clientes: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCliente = async (clienteId) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await ApiService.deleteCliente(clienteId)
        await loadClientes()
      } catch (error) {
        setError('Erro ao excluir cliente: ' + error.message)
      }
    }
  }

  // Filtrar clientes
  const clientesFiltrados = clientes.filter(cliente => {
    const matchNome = cliente.nome.toLowerCase().includes(filtro.toLowerCase())
    const matchCidade = cliente.cidade.toLowerCase().includes(filtro.toLowerCase())
    const matchTemperatura = temperaturaFiltro === 'Todas' || cliente.temperatura === temperaturaFiltro
    
    return (matchNome || matchCidade) && matchTemperatura
  })

  // Calcular estatísticas
  const stats = {
    totalClientes: clientes.length,
    valorTotal: clientes.reduce((sum, cliente) => sum + (cliente.valor || 0), 0),
    clientesQuentes: clientes.filter(c => c.temperatura === 'Quente').length,
    clientesFaturamento: clientes.filter(c => c.status === 'Faturamento' || c.status === 'Pedido Faturado').length
  }

  const getTemperaturaColor = (temp) => {
    switch (temp) {
      case 'Quente': return 'bg-red-100 text-red-800'
      case 'Morna': return 'bg-yellow-100 text-yellow-800'
      case 'Fria': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pedido Faturado': return 'bg-green-100 text-green-800'
      case 'Faturamento': return 'bg-blue-100 text-blue-800'
      case 'Negociação': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Tractor className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AgroCRM - Vendedor</h1>
                <p className="text-sm text-gray-500">Bem-vindo, {user.nome}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="clientes">Meus Clientes</TabsTrigger>
          </TabsList>

          {/* Aba Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Meus Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalClientes}</div>
                  <p className="text-xs text-muted-foreground">
                    Clientes sob sua responsabilidade
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {stats.valorTotal.toLocaleString('pt-BR')}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valor total em negociação
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes Quentes</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.clientesQuentes}</div>
                  <p className="text-xs text-muted-foreground">
                    Negociações em alta temperatura
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Em Faturamento</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.clientesFaturamento}</div>
                  <p className="text-xs text-muted-foreground">
                    Clientes próximos ao fechamento
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Acesse rapidamente as principais funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => navigate('/cliente')} 
                    className="h-20 bg-green-600 hover:bg-green-700"
                  >
                    <div className="text-center">
                      <Plus className="h-6 w-6 mx-auto mb-2" />
                      <span>Novo Cliente</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20"
                    onClick={() => setActiveTab('clientes')}
                  >
                    <div className="text-center">
                      <Users className="h-6 w-6 mx-auto mb-2" />
                      <span>Ver Clientes</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Últimos Clientes */}
            <Card>
              <CardHeader>
                <CardTitle>Últimos Clientes</CardTitle>
                <CardDescription>
                  Seus clientes mais recentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : clientes.length > 0 ? (
                  <div className="space-y-4">
                    {clientes.slice(0, 3).map((cliente) => (
                      <div key={cliente.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{cliente.nome}</h4>
                          <p className="text-sm text-gray-600">{cliente.cidade} - {cliente.fazenda}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge className={getTemperaturaColor(cliente.temperatura)}>
                              {cliente.temperatura}
                            </Badge>
                            <Badge className={getStatusColor(cliente.status)}>
                              {cliente.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {cliente.valor ? `R$ ${cliente.valor.toLocaleString('pt-BR')}` : 'Valor não informado'}
                          </p>
                          <p className="text-sm text-gray-600">{cliente.area} hectares</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum cliente encontrado</p>
                    <Button 
                      onClick={() => navigate('/cliente')} 
                      className="mt-4 bg-green-600 hover:bg-green-700"
                    >
                      Cadastrar Primeiro Cliente
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Clientes */}
          <TabsContent value="clientes" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Meus Clientes</h2>
                <p className="text-gray-600">Gerencie seus clientes e negociações</p>
              </div>
              <Button onClick={() => navigate('/cliente')} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </div>

            {/* Filtros */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar por nome ou cidade..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <select
                      value={temperaturaFiltro}
                      onChange={(e) => setTemperaturaFiltro(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Todas">Todas as temperaturas</option>
                      <option value="Quente">Quente</option>
                      <option value="Morna">Morna</option>
                      <option value="Fria">Fria</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Lista de Clientes */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Clientes</CardTitle>
                <CardDescription>
                  {clientesFiltrados.length} cliente(s) encontrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : clientesFiltrados.length > 0 ? (
                  <div className="space-y-4">
                    {clientesFiltrados.map((cliente) => (
                      <div key={cliente.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <h4 className="font-medium">{cliente.nome}</h4>
                          <p className="text-sm text-gray-600">
                            {cliente.telefone} • {cliente.cidade}
                          </p>
                          <p className="text-sm text-gray-600">
                            {cliente.fazenda} • {cliente.area} hectares
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge className={getTemperaturaColor(cliente.temperatura)}>
                              <Thermometer className="h-3 w-3 mr-1" />
                              {cliente.temperatura}
                            </Badge>
                            <Badge className={getStatusColor(cliente.status)}>
                              {cliente.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right mr-4">
                          <p className="font-medium">
                            {cliente.valor ? `R$ ${cliente.valor.toLocaleString('pt-BR')}` : 'Valor não informado'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {cliente.historico?.length || 0} interações
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/cliente/${cliente.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCliente(cliente.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {filtro || temperaturaFiltro !== 'Todas' 
                        ? 'Nenhum cliente encontrado com os filtros aplicados' 
                        : 'Nenhum cliente encontrado'
                      }
                    </p>
                    {!filtro && temperaturaFiltro === 'Todas' && (
                      <Button 
                        onClick={() => navigate('/cliente')} 
                        className="mt-4 bg-green-600 hover:bg-green-700"
                      >
                        Cadastrar Primeiro Cliente
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default VendedorDashboard

