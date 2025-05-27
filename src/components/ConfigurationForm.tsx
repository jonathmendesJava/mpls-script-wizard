
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { NetworkConfig } from '@/types/mpls';

interface ConfigurationFormProps {
  config: NetworkConfig;
  onConfigChange: (config: NetworkConfig) => void;
  onBranchCountChange: (count: number) => void;
  onMatrixIpChange?: (value: string) => void;
}

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  config,
  onConfigChange,
  onBranchCountChange,
  onMatrixIpChange
}) => {
  const updateConfig = (field: keyof Omit<NetworkConfig, 'branches' | 'branchCount'>, value: string) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };

  const handleMatrixIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onMatrixIpChange) {
      onMatrixIpChange(e.target.value);
    } else {
      updateConfig('matrixIp', e.target.value);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuração da Matriz
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="matrixName">Nome da Matriz</Label>
          <Input
            id="matrixName"
            placeholder="EDD-MATRIZ"
            value={config.matrixName}
            onChange={(e) => updateConfig('matrixName', e.target.value)}
            className="focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="matrixIp">IP da Matriz</Label>
          <Input
            id="matrixIp"
            placeholder="192.168.1.1"
            value={config.matrixIp}
            onChange={handleMatrixIpChange}
            className="focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">Use apenas pontos como separadores (ex: 192.168.1.1)</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="vlanId">VLAN do Circuito</Label>
          <Input
            id="vlanId"
            placeholder="100"
            value={config.vlanId}
            onChange={(e) => updateConfig('vlanId', e.target.value)}
            className="focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="branchCount">Quantidade de Filiais</Label>
          <Input
            id="branchCount"
            type="number"
            min="1"
            max="10"
            placeholder="2"
            value={config.branchCount || ''}
            onChange={(e) => onBranchCountChange(parseInt(e.target.value) || 0)}
            className="focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </CardContent>
    </Card>
  );
};
