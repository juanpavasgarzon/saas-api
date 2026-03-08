export interface AssetAssignmentProps {
  id: string;
  assetId: string;
  projectId: string | null;
  employeeId: string | null;
  assignedAt: Date;
  returnedAt: Date | null;
}
