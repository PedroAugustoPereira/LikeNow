import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Tipo para representar uma empresa
export interface Enterprise {
  id: string;
  name: string;
  adminUserId: string;
}

// Tipo para criação de empresa
export interface CreateEnterpriseData {
  name: string;
  adminUserId: string;
}

// Tipo para atualização de empresa
export interface UpdateEnterpriseData {
  name?: string;
  adminUserId?: string;
}

class EnterpriseService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/enterprise`,
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
   * Lista todas as empresas
   * @returns Promise com array de empresas
   */
  async listEnterprises(): Promise<Enterprise[]> {
    try {
      const response: AxiosResponse<Enterprise[]> = await this.api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error listing enterprises:', error);
      throw error;
    }
  }

  /**
   * Obtém uma empresa pelo ID
   * @param id ID da empresa
   * @returns Promise com os dados da empresa
   */
  async getEnterpriseById(id: string): Promise<Enterprise> {
    try {
      const response: AxiosResponse<Enterprise> = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting enterprise ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cria uma nova empresa
   * @param enterpriseData Dados da nova empresa
   * @returns Promise com a empresa criada
   */
  async createEnterprise(enterpriseData: CreateEnterpriseData): Promise<Enterprise> {
    try {
      const response: AxiosResponse<Enterprise> = await this.api.post('/', enterpriseData);
      return response.data;
    } catch (error) {
      console.error('Error creating enterprise:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma empresa existente
   * @param id ID da empresa
   * @param updateData Dados para atualização
   * @returns Promise com a empresa atualizada
   */
  async updateEnterprise(id: string, updateData: UpdateEnterpriseData): Promise<Enterprise> {
    try {
      const response: AxiosResponse<Enterprise> = await this.api.patch(`/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating enterprise ${id}:`, error);
      throw error;
    }
  }

  /**
   * Remove uma empresa
   * @param id ID da empresa
   * @returns Promise vazia em caso de sucesso
   */
  async deleteEnterprise(id: string): Promise<void> {
    try {
      await this.api.delete(`/${id}`);
    } catch (error) {
      console.error(`Error deleting enterprise ${id}:`, error);
      throw error;
    }
  }
}

export default new EnterpriseService();