export interface IEmailService {
  sendInvitation(to: string, token: string): Promise<void>;
}
