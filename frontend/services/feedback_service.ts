import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Tipo para representar um feedback
export interface Feedback {
  id: string;
  senderUserId?: string; // Opcional (pode ser anônimo)
  receiverUserId: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
  isAnonymous?: boolean;
  senderName?: string;
}

// Tipo para envio de feedback
export interface SendFeedbackData {
  senderUserId?: string; // Opcional (se ausente, será anônimo)
  receiverUserId: string;
  message: string;
}

class FeedbackService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/feedback`,
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
   * Lista todos os feedbacks
   * @returns Promise com array de feedbacks
   */
  async listFeedbacks(): Promise<Feedback[]> {
    try {
      const response: AxiosResponse<Feedback[]> = await this.api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error listing feedbacks:', error);
      throw error;
    }
  }

  /**
   * Obtém um feedback pelo ID
   * @param id ID do feedback
   * @returns Promise com os dados do feedback
   */
  async getFeedbackById(id: string): Promise<Feedback> {
    try {
      const response: AxiosResponse<Feedback> = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting feedback ${id}:`, error);
      throw error;
    }
  }

  /**
   * Envia um novo feedback
   * @param feedbackData Dados do feedback
   * @returns Promise com o feedback criado
   */
  async sendFeedback(feedbackData: SendFeedbackData): Promise<Feedback> {
    try {
      const response: AxiosResponse<Feedback> = await this.api.post('/sendfeedback', feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error sending feedback:', error);
      throw error;
    }
  }

  /**
   * Envia um feedback anônimo
   * @param receiverUserId ID do destinatário
   * @param message Mensagem do feedback
   * @returns Promise com o feedback criado
   */
  async sendAnonymousFeedback(receiverUserId: string, message: string): Promise<Feedback> {
    return this.sendFeedback({ receiverUserId, message });
  }

  /**
   * Remove um feedback
   * @param id ID do feedback
   * @returns Promise vazia em caso de sucesso
   */
  async deleteFeedback(id: string): Promise<void> {
    try {
      await this.api.delete(`/${id}`);
    } catch (error) {
      console.error(`Error deleting feedback ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtém feedbacks recebidos por um usuário
   * @param userId ID do usuário
   * @returns Promise com array de feedbacks
   */
  async getReceivedFeedbacks(userId: string): Promise<Feedback[]> {
    try {
      const allFeedbacks = await this.listFeedbacks();
      return allFeedbacks.filter(feedback => feedback.receiverUserId === userId);
    } catch (error) {
      console.error(`Error getting received feedbacks for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Obtém feedbacks enviados por um usuário
   * @param userId ID do usuário
   * @returns Promise com array de feedbacks
   */
  async getSentFeedbacks(userId: string): Promise<Feedback[]> {
    try {
      const allFeedbacks = await this.listFeedbacks();
      return allFeedbacks.filter(feedback => 
        feedback.senderUserId === userId || 
        (feedback.isAnonymous && feedback.senderUserId === undefined)
      );
    } catch (error) {
      console.error(`Error getting sent feedbacks for user ${userId}:`, error);
      throw error;
    }
  }
}

export default new FeedbackService();