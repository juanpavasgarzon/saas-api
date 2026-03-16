export interface ILineItemTypeAdapter {
  /**
   * Returns the subset of `ids` that exist (and are usable) for the given tenant.
   * Products and services must be active; assets just need to exist.
   */
  findExistingIds(ids: string[], tenantId: string): Promise<string[]>;
}
