
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Network } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { NetworkConfig, BranchOffice } from '@/types/mpls';
import { ConfigurationForm } from '@/components/ConfigurationForm';
import { BranchConfiguration } from '@/components/BranchConfiguration';
import { ScriptDisplay } from '@/components/ScriptDisplay';
import { validateForm, copyToClipboard, downloadScript } from '@/utils/mplsUtils';

const Index = () => {
  const [config, setConfig] = useState<NetworkConfig>({
    matrixName: '',
    matrixTag: '', // Added missing matrixTag
    matrixIp: '',
    vlanId: '',
    branchCount: 0,
    branches: []
  });

  const [showScripts, setShowScripts] = useState(false);

  const handleBranchCountChange = (count: number) => {
    setConfig(prev => ({
      ...prev,
      branchCount: count,
      branches: Array(count).fill(null).map((_, index) => ({
        name: `EDD-FILIAL-${String(index + 1).padStart(3, '0')}`,
        tag: `FILIAL-${String(index + 1).padStart(2, '0')}`, // Added missing tag
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

  const handleGenerate = () => {
    if (validateForm(config)) {
      setShowScripts(true);
      toast({
        title: "Scripts gerados!",
        description: "Todos os scripts foram gerados com sucesso.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
              <Network className="h-10 w-10 text-blue-600" />
              Gerador de Scripts MPLS
            </h1>
            <p className="text-lg text-gray-600">VLAN Untagged (DM4360) - Configuração automática de rede</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulário de Configuração */}
            <div className="space-y-6">
              <ConfigurationForm
                config={config}
                onConfigChange={setConfig}
                onBranchCountChange={handleBranchCountChange}
              />

              <BranchConfiguration
                config={config}
                onBranchUpdate={updateBranch}
              />

              <Button 
                onClick={handleGenerate}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold shadow-lg transition-all duration-200"
                size="lg"
              >
                Gerar Scripts de Configuração
              </Button>
            </div>

            {/* Scripts Gerados */}
            <div className="space-y-6">
              <ScriptDisplay
                config={config}
                showScripts={showScripts}
                onCopyScript={copyToClipboard}
                onDownloadScript={downloadScript}
              />
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

export default Index;
