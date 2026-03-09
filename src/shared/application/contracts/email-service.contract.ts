export interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export interface IEmailService {
  sendMail(input: SendEmailInput): Promise<void>;
}
