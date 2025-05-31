export class CreateFeedbackDto {
  senderUserId?: string;
  receiverUserId: string;
  message: string;
}
