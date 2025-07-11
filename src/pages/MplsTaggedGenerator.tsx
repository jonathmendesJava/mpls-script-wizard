import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Download, Network, Settings, Building2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BranchOffice {
  name: string;
  tag: string;
  pwId: string;
  ip: string;
}

interface NetworkConfig {
  matrixName: string;
  matrixTag: string;
  matrixIp: string;
  vlanId: string;
  branchCount: number;
  branches: BranchOffice[];
}

const MplsTaggedGenerator = () => {
  const [config, setConfig] = useState<NetworkConfig>({
    matrixName: '',
    matrixTag: '',
    matrixIp: '',
    vlanId: '',
    branchCount: 0,
    branches: []
  });

  const [showScripts, setShowScripts] = useState(false);

  const handleMatrixIpChange = (value: string) => {
    // Remove vírgulas e substitui por pontos, permite apenas números e pontos
    const cleanedValue = value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
    setConfig(prev => ({ ...prev, matrixIp: cleanedValue }));
  };

  const handleBranchCountChange = (count: number) => {
    setConfig(prev => ({
      ...prev,
      branchCount: count,
      branches: Array(count).fill(null).map((_, index) => ({
        name: `EDD-FILIAL-${String(index + 1).padStart(3, '0')}`,
        tag: `FILIAL-${String(index + 1).padStart(2, '0')}`,
        pwId: '',
        ip: ''
      }))
    }));
  };

  const updateBranch = (index: number, field: keyof BranchOffice, value: string) => {
    setConfig(prev => ({
      ...prev,
      branches: prev.branches.map((branch, i) => 
        i === index ? { ...branch, [field]: value } : branch
      )
    }));
  };

  const generateMatrixScript = () => {
    const neighborsConfig = config.branches.map(branch => 
      `    neighbor ${branch.tag}\n     pw-id ${branch.pwId}\n     split-horizon disable\n    !`
    ).join('\n');

    return `mpls ldp
 lsr-id loopback-0
  interface l3-ptp-porta-5
  !
  interface l3-ptp-porta-6
  !
  neighbor targeted ${config.matrixIp}
  !
top
mpls l2vpn
 vpls-group TRANSPORTES-VPN
  vpn ${config.matrixTag}
   vfi
    pw-type vlan
${neighborsConfig}
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
  !
top
mpls l2vpn
 vpls-group TRANSPORTES-VPN
  vpn ${branch.tag}
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

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Script copiado!",
      description: `${title} foi copiado para a área de transferência.`,
    });
  };

  const downloadScript = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Download iniciado!",
      description: `Arquivo ${filename}.txt foi baixado.`,
    });
  };

  const validateForm = () => {
    if (!config.matrixName || !config.matrixTag || !config.matrixIp || !config.vlanId || config.branchCount === 0) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return false;
    }

    const hasEmptyBranches = config.branches.some(branch => !branch.name || !branch.tag || !branch.pwId);
    if (hasEmptyBranches) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os dados das filiais.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleGenerate = () => {
    if (validateForm()) {
      setShowScripts(true);
      toast({
        title: "Scripts gerados!",
        description: "Todos os scripts foram gerados com sucesso.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-100 flex flex-col">
      <div className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
              <Network className="h-10 w-10 text-green-600" />
              Gerador de Scripts MPLS
            </h1>
            <p className="text-lg text-gray-600">VLAN Tagged - Configuração automática de rede</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulário de Configuração */}
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
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
                      onChange={(e) => setConfig(prev => ({ ...prev, matrixName: e.target.value }))}
                      className="focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="matrixTag">Tag da Matriz</Label>
                    <Input
                      id="matrixTag"
                      placeholder="TRANSPORTE-MATRIZ"
                      value={config.matrixTag}
                      onChange={(e) => setConfig(prev => ({ ...prev, matrixTag: e.target.value }))}
                      className="focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="matrixIp">IP da Matriz</Label>
                    <Input
                      id="matrixIp"
                      placeholder="192.168.0.1"
                      value={config.matrixIp}
                      onChange={(e) => handleMatrixIpChange(e.target.value)}
                      className="focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-500">Use apenas pontos como separadores (ex: 192.168.1.1)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vlanId">VLAN-ID</Label>
                    <Input
                      id="vlanId"
                      placeholder="100"
                      value={config.vlanId}
                      onChange={(e) => setConfig(prev => ({ ...prev, vlanId: e.target.value }))}
                      className="focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchCount">Número de Filiais</Label>
                    <Input
                      id="branchCount"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="2"
                      value={config.branchCount || ''}
                      onChange={(e) => handleBranchCountChange(parseInt(e.target.value) || 0)}
                      className="focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </CardContent>
              </Card>

              {config.branchCount > 0 && (
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Configuração das Filiais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {config.branches.map((branch, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                        <h4 className="font-semibold text-gray-700">Filial {index + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor={`branchName${index}`}>Nome da Filial</Label>
                            <Input
                              id={`branchName${index}`}
                              value={branch.name}
                              onChange={(e) => updateBranch(index, 'name', e.target.value)}
                              className="focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`branchTag${index}`}>Tag da Filial</Label>
                            <Input
                              id={`branchTag${index}`}
                              placeholder="FILIAL-SP"
                              value={branch.tag}
                              onChange={(e) => updateBranch(index, 'tag', e.target.value)}
                              className="focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`pwId${index}`}>PW-ID</Label>
                            <Input
                              id={`pwId${index}`}
                              placeholder="1001"
                              value={branch.pwId}
                              onChange={(e) => updateBranch(index, 'pwId', e.target.value)}
                              className="focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Button 
                onClick={handleGenerate}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 text-lg font-semibold shadow-lg transition-all duration-200"
                size="lg"
              >
                Gerar Scripts de Configuração
              </Button>
            </div>

            {/* Scripts Gerados */}
            <div className="space-y-6">
              {showScripts && (
                <>
                  {/* Script da Matriz */}
                  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
                      <CardTitle>Script da Matriz: {config.matrixName}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                        {generateMatrixScript()}
                      </pre>
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => copyToClipboard(generateMatrixScript(), "Script da Matriz")}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copiar
                        </Button>
                        <Button
                          onClick={() => downloadScript(generateMatrixScript(), `script_matriz_${config.matrixName}`)}
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
                      <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
                        <CardTitle>Script da Filial: {branch.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                          {generateBranchScript(branch)}
                        </pre>
                        <div className="flex gap-2 mt-4">
                          <Button
                            onClick={() => copyToClipboard(generateBranchScript(branch), `Script da Filial ${branch.name}`)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Copy className="h-4 w-4" />
                            Copiar
                          </Button>
                          <Button
                            onClick={() => downloadScript(generateBranchScript(branch), `script_filial_${branch.name}`)}
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Rodapé */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">Desenvolvido por <span className="font-semibold text-blue-300">Fios Tecnologia</span></p>
        </div>
      </footer>
    </div>
  );
};

export default MplsTaggedGenerator;
