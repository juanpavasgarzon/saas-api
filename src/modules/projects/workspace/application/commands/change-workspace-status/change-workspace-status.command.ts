import { type ICommand } from '@nestjs/cqrs';

export type ProjectStatusAction = 'activate' | 'hold' | 'complete' | 'cancel';

export class ChangeProjectStatusCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly projectId: string,
    public readonly action: ProjectStatusAction,
  ) {}
}
