import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  Camera, 
  MapPin, 
  Thermometer,
  DollarSign,
  FileText,
  AlertCircle,
  Tractor,
  LogOut
} from 'lucide-react'

const ClienteForm = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [cliente, setCliente] = useState({
    nome: '',
    telefone: '',
    cidade: '',
    fazenda: '',
    coordenadas: '',
    area: '',
    maquinas: '',
    temperatura: 'Fria',
    valor: '',
    oportunidades: '',
    pendencias: '',
    status: 'Início de Relacionamento',
    fotos: [],
    historico: []
  })

  const [activeTab, setActiveTab] = useState('dados')

  const handleInputChange = (field, value) => {
    setCliente(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    // Aqui seria a lógica para salvar no backend
    console.log('Salvando cliente:', cliente)
    navigate(user.tipo === 'gerente' ? '/gerente' : '/vendedor')
  }

  const adicionarHistorico = (evento) => {
    const novoEvento = {
      id: Date.now(),
      data: new Date(),
      evento,
      usuario: user.nome
    }
    setCliente(prev => ({
      ...prev,
      historico: [novoEvento, ...prev.historico]
    }))
  }

  const getTemperaturaColor = (temp) => {
    switch (temp) {
      case 'Quente': return 'bg-red-100 text-red-800 border-red-200'
      case 'Morna': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Fria': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate(user.tipo === 'gerente' ? '/gerente' : '/vendedor')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Tractor className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {isEdit ? 'Editar Cliente' : 'Novo Cliente'}
                </h1>
                <p className="text-sm text-gray-500">{user.nome}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dados">Dados Básicos</TabsTrigger>
            <TabsTrigger value="negociacao">Negociação</TabsTrigger>
            <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          {/* Aba Dados Básicos */}
          <TabsContent value="dados">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informações do Cliente
                </CardTitle>
                <CardDescription>
                  Dados básicos e informações da propriedade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Cliente *</Label>
                    <Input
                      id="nome"
                      value={cliente.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={cliente.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      value={cliente.cidade}
                      onChange={(e) => handleInputChange('cidade', e.target.value)}
                      placeholder="Cidade"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fazenda">Nome da Fazenda</Label>
                    <Input
                      id="fazenda"
                      value={cliente.fazenda}
                      onChange={(e) => handleInputChange('fazenda', e.target.value)}
                      placeholder="Fazenda São João"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Área Plantada (hectares) *</Label>
                    <Input
                      id="area"
                      type="number"
                      value={cliente.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      placeholder="500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coordenadas">Coordenadas/Localização</Label>
                  <div className="flex gap-2">
                    <Input
                      id="coordenadas"
                      value={cliente.coordenadas}
                      onChange={(e) => handleInputChange('coordenadas', e.target.value)}
                      placeholder="Latitude, Longitude ou endereço"
                    />
                    <Button variant="outline">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maquinas">Máquinas (marca/modelo/ano) *</Label>
                  <Textarea
                    id="maquinas"
                    value={cliente.maquinas}
                    onChange={(e) => handleInputChange('maquinas', e.target.value)}
                    placeholder="Ex: Trator John Deere 6110J 2020, Colheitadeira Case 2388 2018..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Negociação */}
          <TabsContent value="negociacao">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Status da Negociação
                </CardTitle>
                <CardDescription>
                  Temperatura, valor e oportunidades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Temperatura da Negociação *</Label>
                    <div className="flex gap-2">
                      {['Fria', 'Morna', 'Quente'].map((temp) => (
                        <Button
                          key={temp}
                          variant={cliente.temperatura === temp ? 'default' : 'outline'}
                          onClick={() => handleInputChange('temperatura', temp)}
                          className={cliente.temperatura === temp ? getTemperaturaColor(temp) : ''}
                        >
                          {temp}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor da Negociação (R$) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="valor"
                        type="number"
                        value={cliente.valor}
                        onChange={(e) => handleInputChange('valor', e.target.value)}
                        placeholder="250000"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oportunidades">Oportunidades Abertas</Label>
                  <Textarea
                    id="oportunidades"
                    value={cliente.oportunidades}
                    onChange={(e) => handleInputChange('oportunidades', e.target.value)}
                    placeholder="Descreva as oportunidades identificadas..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pendencias">Pendências</Label>
                  <Textarea
                    id="pendencias"
                    value={cliente.pendencias}
                    onChange={(e) => handleInputChange('pendencias', e.target.value)}
                    placeholder="Liste documentos, visitas, contratos pendentes..."
                    rows={3}
                  />
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Camera className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Fotos da Negociação</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      Anexe fotos de máquinas, talhões, condições de cultivo
                    </p>
                    <Button variant="outline" className="border-blue-300 text-blue-700">
                      <Camera className="h-4 w-4 mr-2" />
                      Adicionar Fotos
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Faturamento */}
          <TabsContent value="faturamento">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Controle de Faturamento
                </CardTitle>
                <CardDescription>
                  Dados da negociação fechada e faturamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Status do Pedido</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={cliente.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <option value="Início de Relacionamento">Início de Relacionamento</option>
                      <option value="Negociação">Negociação</option>
                      <option value="Faturamento">Faturamento</option>
                      <option value="Pedido Faturado">Pedido Faturado</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataFaturamento">Data Prevista de Faturamento</Label>
                    <Input
                      id="dataFaturamento"
                      type="date"
                      value={cliente.dataFaturamento || ''}
                      onChange={(e) => handleInputChange('dataFaturamento', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoesFaturamento">Observações de Faturamento</Label>
                  <Textarea
                    id="observacoesFaturamento"
                    value={cliente.observacoesFaturamento || ''}
                    onChange={(e) => handleInputChange('observacoesFaturamento', e.target.value)}
                    placeholder="Observações sobre entrega, pós-venda, etc..."
                    rows={3}
                  />
                </div>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-900">Documentos</span>
                    </div>
                    <p className="text-sm text-green-700 mb-3">
                      Anexe contratos, propostas, notas fiscais
                    </p>
                    <Button variant="outline" className="border-green-300 text-green-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Adicionar Documentos
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Histórico */}
          <TabsContent value="historico">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Interações</CardTitle>
                <CardDescription>
                  Registro de visitas, ligações e atualizações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => adicionarHistorico('Ligação realizada')}
                    >
                      📞 Ligação
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => adicionarHistorico('Visita realizada')}
                    >
                      🚗 Visita
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => adicionarHistorico('Email enviado')}
                    >
                      📧 Email
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => adicionarHistorico('Proposta enviada')}
                    >
                      📄 Proposta
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {cliente.historico.length > 0 ? (
                    cliente.historico.map((evento) => (
                      <div key={evento.id} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{evento.evento}</p>
                            <p className="text-sm text-gray-600">Por: {evento.usuario}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {evento.data.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma interação registrada</p>
                      <p className="text-sm text-gray-400">
                        Use os botões acima para registrar atividades
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ClienteForm

