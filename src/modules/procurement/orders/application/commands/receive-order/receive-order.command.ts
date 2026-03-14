export class ReceiveOrderCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
