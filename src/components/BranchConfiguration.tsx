
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2 } from 'lucide-react';
import { NetworkConfig, BranchOffice } from '@/types/mpls';

interface BranchConfigurationProps {
  config: NetworkConfig;
  onBranchUpdate: (index: number, field: keyof BranchOffice, value: string) => void;
}

export const BranchConfiguration: React.FC<BranchConfigurationProps> = ({
  config,
  onBranchUpdate
}) => {
  if (config.branchCount === 0) return null;

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Configuração das Filiais
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {config.branches.map((branch, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
            <h4 className="font-semibold text-gray-700">Filial {index + 1}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor={`branchName${index}`}>Nome da Filial</Label>
                <Input
                  id={`branchName${index}`}
                  value={branch.name}
                  onChange={(e) => onBranchUpdate(index, 'name', e.target.value)}
                  className="focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`branchIp${index}`}>IP da Filial</Label>
                <Input
                  id={`branchIp${index}`}
                  placeholder="192.168.1.2"
                  value={branch.ip}
                  onChange={(e) => onBranchUpdate(index, 'ip', e.target.value)}
                  className="focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`pwId${index}`}>PW-ID</Label>
                <Input
                  id={`pwId${index}`}
                  placeholder="1001"
                  value={branch.pwId}
                  onChange={(e) => onBranchUpdate(index, 'pwId', e.target.value)}
                  className="focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
