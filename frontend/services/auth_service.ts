import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Tipos baseados na estrutura do seu backend
export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Realiza o login do usuário
   * @param email Email do usuário
   * @param password Senha do usuário
   * @returns Promise com os dados de autenticação
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/login', {
        email,
        password
      });

      // Armazena o token no localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Realiza o logout (remove o token)
   */
  logout(): void {
    localStorage.removeItem('authToken');
    // Adicione aqui qualquer outra lógica de limpeza
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns boolean indicando se há um token válido
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token; // Retorna true se existir token
  }

  /**
   * Obtém o token JWT armazenado
   * @returns O token ou null se não existir
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export default new AuthService();