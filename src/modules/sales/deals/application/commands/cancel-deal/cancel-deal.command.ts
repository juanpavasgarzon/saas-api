export class CancelDealCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
