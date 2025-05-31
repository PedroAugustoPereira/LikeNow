import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Tipo para representar um usuário
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  team_id?: string;
}

// Tipo para criação de usuário
export interface CreateUserData {
  name: string;
  email: string;
  team_id?: string;
}

// Tipo para atualização de usuário
export interface UpdateUserData {
  name?: string;
  email?: string;
}

// Tipo para mudança de senha
export interface ChangePasswordData {
  password: string;
}

class UserService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/user`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Adiciona interceptor para incluir o token JWT se existir
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * Lista todos os usuários
   * @returns Promise com array de usuários
   */
  async listUsers(): Promise<User[]> {
    try {
      const response: AxiosResponse<User[]> = await this.api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  }

  /**
   * Obtém um usuário pelo ID
   * @param id ID do usuário
   * @returns Promise com os dados do usuário
   */
  async getUserById(id: string): Promise<User> {
    try {
      const response: AxiosResponse<User> = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cria um novo usuário
   * @param userData Dados do novo usuário
   * @returns Promise com o usuário criado
   */
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response: AxiosResponse<User> = await this.api.post('/', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Atualiza um usuário existente
   * @param id ID do usuário
   * @param updateData Dados para atualização
   * @returns Promise com o usuário atualizado
   */
  async updateUser(id: string, updateData: UpdateUserData): Promise<User> {
    try {
      const response: AxiosResponse<User> = await this.api.patch(`/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Altera a senha de um usuário (primeiro login)
   * @param id ID do usuário
   * @param passwordData Objeto com a nova senha
   * @returns Promise com o usuário atualizado
   */
  async changePassword(id: string, passwordData: ChangePasswordData): Promise<User> {
    try {
      const response: AxiosResponse<User> = await this.api.patch(`/password/${id}`, passwordData);
      return response.data;
    } catch (error) {
      console.error(`Error changing password for user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Remove um usuário
   * @param id ID do usuário
   * @returns Promise vazia em caso de sucesso
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await this.api.delete(`/${id}`);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

}

export default new UserService();