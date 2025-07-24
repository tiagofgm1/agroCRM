# AgroCRM - Sistema de Gestão de Relacionamento com Clientes Agrícolas

## Descrição

O AgroCRM é um sistema completo de gestão de relacionamento com clientes voltado para o setor agrícola. O sistema permite o gerenciamento de clientes, negociações, histórico de interações e controle de usuários com diferentes níveis de acesso.

## Funcionalidades Principais

### Para Gerentes:
- **Dashboard Executivo**: Visão geral de todos os clientes e vendedores
- **Gerenciamento de Usuários**: Criar, editar e desativar usuários (gerentes e vendedores)
- **Gestão Completa de Clientes**: Visualizar e gerenciar todos os clientes do sistema
- **Relatórios e Estatísticas**: Acompanhar performance da equipe

### Para Vendedores:
- **Dashboard Pessoal**: Visão dos seus clientes e estatísticas
- **Gestão de Clientes**: Cadastrar, editar e acompanhar seus clientes
- **Controle de Negociações**: Gerenciar temperatura e status das negociações
- **Histórico de Interações**: Registrar ligações, visitas, emails e propostas

## Tecnologias Utilizadas

### Backend:
- **Python 3.11** - Linguagem de programação
- **Flask** - Framework web
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **Flask-CORS** - Suporte a CORS

### Frontend:
- **React 19** - Framework frontend
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **Shadcn/UI** - Componentes UI
- **Lucide React** - Ícones
- **React Router** - Roteamento

## Instalação e Configuração

### Pré-requisitos:
- Python 3.11+
- Node.js 18+
- npm ou yarn

### Passo 1: Configurar o Backend

```bash
# Navegar para o diretório do backend
cd agrocrm-backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# No Linux/Mac:
source venv/bin/activate
# No Windows:
venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt
```

### Passo 2: Configurar o Frontend

```bash
# Navegar para o diretório do frontend
cd agrocrm-web

# Instalar dependências
npm install --legacy-peer-deps

# Fazer build do frontend
npm run build

# Copiar arquivos para o backend
cp -r dist/* ../agrocrm-backend/src/static/
```

### Passo 3: Executar o Sistema

```bash
# Navegar para o backend
cd agrocrm-backend

# Ativar ambiente virtual
source venv/bin/activate

# Executar o servidor
python src/main.py
```

O sistema estará disponível em: `http://localhost:5000`

## Primeiro Acesso

1. Acesse `http://localhost:5000`
2. Clique em "Criar Administrador Inicial"
3. Use as credenciais criadas para fazer login
4. Credenciais padrão:
   - **Email**: admin@agrocrm.com
   - **Senha**: admin123

## Uso do Sistema

### Como Gerente:

1. **Criar Usuários**:
   - Acesse a aba "Usuários"
   - Clique em "Novo Usuário"
   - Preencha os dados e selecione o tipo (Gerente ou Vendedor)

2. **Gerenciar Clientes**:
   - Acesse a aba "Clientes"
   - Visualize todos os clientes do sistema
   - Edite ou exclua clientes conforme necessário

### Como Vendedor:

1. **Cadastrar Clientes**:
   - Acesse "Novo Cliente"
   - Preencha todas as informações obrigatórias
   - Defina temperatura da negociação e valor

2. **Acompanhar Negociações**:
   - Use as abas do formulário para organizar informações
   - Registre histórico de interações
   - Atualize status conforme progresso

## Segurança

- **Autenticação JWT**: Tokens com expiração de 24 horas
- **Controle de Acesso**: Vendedores só acessam seus próprios clientes
- **Validação de Dados**: Validação no frontend e backend
- **Senhas Criptografadas**: Hash seguro das senhas

## Backup e Manutenção

### Backup do Banco de Dados:
```bash
# Copiar arquivo do banco
cp agrocrm-backend/src/database/app.db backup_$(date +%Y%m%d).db
```

---

**Versão**: 2.0.0  
**Data**: Julho 2025  
**Desenvolvido por**: Equipe AgroCRM
