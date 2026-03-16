export class GetServiceQuery {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
