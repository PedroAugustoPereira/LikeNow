export interface Feedback {
    id: string;
    user_id_sender: string;
    user_id_reciever: string;
    createdAt: Date;
    textoResumo: string;
    textoRelatorio: string;
  }