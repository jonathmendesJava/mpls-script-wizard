
import { NetworkConfig } from '@/types/mpls';
import { toast } from '@/hooks/use-toast';

export const validateForm = (config: NetworkConfig): boolean => {
  if (!config.matrixName || !config.matrixIp || !config.vlanId || config.branchCount === 0) {
    toast({
      title: "Erro de validação",
      description: "Por favor, preencha todos os campos obrigatórios.",
      variant: "destructive"
    });
    return false;
  }

  const hasEmptyBranches = config.branches.some(branch => !branch.name || !branch.pwId || !branch.ip);
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

export const copyToClipboard = (text: string, title: string) => {
  navigator.clipboard.writeText(text);
  toast({
    title: "Script copiado!",
    description: `${title} foi copiado para a área de transferência.`,
  });
};

export const downloadScript = (text: string, filename: string) => {
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
