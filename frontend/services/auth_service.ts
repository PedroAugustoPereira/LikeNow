import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';

// Tipos baseados na estrutura do seu backend
export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user_id: string;
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
      console.log(response);
      // Armazena o token no localStorage
      if (response.data.accessToken) {
        localStorage.setItem('authToken', response.data.accessToken);
        localStorage.setItem('user_id', response.data.user_id);
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
    localStorage.removeItem('user_id');
    // Redireciona para a página de login
    window.location.href = '/start/login';
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

  /**
   * Verifica a autenticação e redireciona para login se não estiver autenticado
   */
  checkAuthentication(): void {
    if (!this.isAuthenticated()) {
      // Usamos window.location.href em vez do router para garantir que a página recarregue
      window.location.href = '/start/login';
    }
  }

  /**
   * Verifica a autenticação em uma rota protegida (para uso em getServerSideProps)
   * @param context - Contexto da requisição
   * @returns Objeto com props ou redirecionamento
   */
  async checkAuthServerSide(context: any): Promise<{ props?: any, redirect?: { destination: string, permanent: boolean } }> {
    const token = context.req?.cookies?.authToken || null;
    
    if (!token) {
      return {
        redirect: {
          destination: '/start/login',
          permanent: false,
        },
      };
    }

    return { props: {} };
  }
}

export default new AuthService();