
export interface BranchOffice {
  name: string;
  pwId: string;
  ip: string;
}

export interface NetworkConfig {
  matrixName: string;
  matrixIp: string;
  vlanId: string;
  branchCount: number;
  branches: BranchOffice[];
}
