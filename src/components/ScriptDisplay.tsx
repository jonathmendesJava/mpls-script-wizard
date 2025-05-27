
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import { NetworkConfig, BranchOffice } from '@/types/mpls';

interface ScriptDisplayProps {
  config: NetworkConfig;
  showScripts: boolean;
  onCopyScript: (text: string, title: string) => void;
  onDownloadScript: (text: string, filename: string) => void;
}

export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({
  config,
  showScripts,
  onCopyScript,
  onDownloadScript
}) => {
  const generateMatrixScript = () => {
    const neighborsConfig = config.branches.map(branch => 
      `  neighbor targeted ${branch.ip}\n  !`
    ).join('\n');

    const pwConfig = config.branches.map(branch => 
      `    neighbor ${branch.ip}\n     pw-id ${branch.pwId}\n     split-horizon disable\n    !`
    ).join('\n');

    return `mpls ldp
 lsr-id loopback-0
  interface l3-ptp-porta-5
  !
  interface l3-ptp-porta-6
  !
${neighborsConfig}
top
mpls l2vpn
vpls-group TRANSPORTES-VPN
  vpn ${config.matrixName}
   vfi
    pw-type vlan
${pwConfig}
   !
   bridge-domain
    dot1q ${config.vlanId}
    access-interface gigabit-ethernet-1/1/3
    !
   !
  !
 !
!`;
  };

  const generateBranchScript = (branch: BranchOffice) => {
    return `mpls ldp
 lsr-id loopback-0
  interface l3-ptp-porta-5
  !
  interface l3-ptp-porta-6
  !
  neighbor targeted ${config.matrixIp}
  top
mpls l2vpn
 vpls-group TRANSPORTES-VPN
  vpn ${branch.name}
   vfi
    pw-type vlan
    neighbor ${config.matrixIp}
     pw-id ${branch.pwId}
     split-horizon disable
    !
   !
   bridge-domain
    dot1q ${config.vlanId}
    access-interface gigabit-ethernet-1/1/3
    !
   !
  !
 !
!`;
  };

  if (!showScripts) return null;

  return (
    <div className="space-y-6">
      {/* Script da Matriz */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle>Script da Matriz: {config.matrixName}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
            {generateMatrixScript()}
          </pre>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => onCopyScript(generateMatrixScript(), "Script da Matriz")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copiar
            </Button>
            <Button
              onClick={() => onDownloadScript(generateMatrixScript(), `script_matriz_${config.matrixName}`)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scripts das Filiais */}
      {config.branches.map((branch, index) => (
        <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <CardTitle>Script da Filial: {branch.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
              {generateBranchScript(branch)}
            </pre>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => onCopyScript(generateBranchScript(branch), `Script da Filial ${branch.name}`)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copiar
              </Button>
              <Button
                onClick={() => onDownloadScript(generateBranchScript(branch), `script_filial_${branch.name}`)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
