const API_BASE_URL = '/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // Autenticação
  async login(email, senha) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    this.setToken(null);
  }

  // Usuários (apenas gerentes)
  async getUsers() {
    return this.request('/auth/users');
  }

  async createUser(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/auth/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return this.request(`/auth/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Clientes
  async getClientes() {
    return this.request('/clientes');
  }

  async getCliente(clienteId) {
    return this.request(`/clientes/${clienteId}`);
  }

  async createCliente(clienteData) {
    return this.request('/clientes', {
      method: 'POST',
      body: JSON.stringify(clienteData),
    });
  }

  async updateCliente(clienteId, clienteData) {
    return this.request(`/clientes/${clienteId}`, {
      method: 'PUT',
      body: JSON.stringify(clienteData),
    });
  }

  async deleteCliente(clienteId) {
    return this.request(`/clientes/${clienteId}`, {
      method: 'DELETE',
    });
  }

  async addHistorico(clienteId, historicoData) {
    return this.request(`/clientes/${clienteId}/historico`, {
      method: 'POST',
      body: JSON.stringify(historicoData),
    });
  }

  async deleteHistorico(clienteId, historicoId) {
    return this.request(`/clientes/${clienteId}/historico/${historicoId}`, {
      method: 'DELETE',
    });
  }

  // Inicialização
  async initAdmin() {
    return this.request('/init-admin', {
      method: 'POST',
    });
  }
}

export default new ApiService();

