
export interface BranchOffice {
  name: string;
  tag: string;
  pwId: string;
  ip: string;
}

export interface NetworkConfig {
  matrixName: string;
  matrixTag: string;
  matrixIp: string;
  vlanId: string;
  branchCount: number;
  branches: BranchOffice[];
}
