export class GetAssetQuery {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
