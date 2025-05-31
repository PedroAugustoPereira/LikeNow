import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Tipos para representar um time
export interface Team {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  leaderId: string;
  enterpriseId: string;
  leaderSlackId?: string;
}

// Tipo para representar o líder de um time
export interface TeamLeader {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Tipo para criação de time
export interface CreateTeamData {
  name: string;
  leaderId: string;
  enterpriseId: string;
  leaderSlackId?: string;
}

// Tipo para atualização de time
export interface UpdateTeamData {
  name?: string;
  leaderId?: string;
}

class TeamService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/team`,
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
   * Lista todos os times
   * @returns Promise com array de times
   */
  async listTeams(): Promise<Team[]> {
    try {
      const response: AxiosResponse<Team[]> = await this.api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error listing teams:', error);
      throw error;
    }
  }

  /**
   * Obtém um time pelo ID
   * @param id ID do time
   * @returns Promise com os dados do time
   */
  async getTeamById(id: string): Promise<Team> {
    try {
      const response: AxiosResponse<Team> = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting team ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtém o líder de um time
   * @param teamId ID do time
   * @returns Promise com os dados do líder
   */
  async getTeamLeader(teamId: string): Promise<TeamLeader> {
    try {
      const response: AxiosResponse<TeamLeader> = await this.api.get(`/leader/${teamId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting leader for team ${teamId}:`, error);
      throw error;
    }
  }

  /**
   * Cria um novo time
   * @param teamData Dados do novo time
   * @returns Promise com o time criado
   */
  async createTeam(teamData: CreateTeamData): Promise<Team> {
    try {
      const response: AxiosResponse<Team> = await this.api.post('/', teamData);
      return response.data;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  }

  /**
   * Atualiza um time existente
   * @param id ID do time
   * @param updateData Dados para atualização
   * @returns Promise com o time atualizado
   */
  async updateTeam(id: string, updateData: UpdateTeamData): Promise<Team> {
    try {
      const response: AxiosResponse<Team> = await this.api.patch(`/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating team ${id}:`, error);
      throw error;
    }
  }

  /**
   * Remove um time
   * @param id ID do time
   * @returns Promise vazia em caso de sucesso
   */
  async deleteTeam(id: string): Promise<void> {
    try {
      await this.api.delete(`/${id}`);
    } catch (error) {
      console.error(`Error deleting team ${id}:`, error);
      throw error;
    }
  }
}

export default new TeamService();