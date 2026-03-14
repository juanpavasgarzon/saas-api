export class ListSuppliersQuery {
  constructor(
    public readonly tenantId: string,
    public readonly search: string | undefined,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
