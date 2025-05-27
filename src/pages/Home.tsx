
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Network, Settings, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ScriptGenerator {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  available: boolean;
}

const scriptGenerators: ScriptGenerator[] = [
  {
    id: 'mpls-vlan-untagged',
    name: 'MPLS com VLAN Untagged',
    description: 'Gere automaticamente os scripts da matriz e das filiais com base nas configurações do seu circuito DM4360',
    icon: Network,
    route: '/mpls-generator',
    available: true
  },
  // Futuros geradores podem ser adicionados aqui
  {
    id: 'mpls-vlan-tagged',
    name: 'MPLS com VLAN Tagged',
    description: 'Configuração de scripts para circuitos com VLAN Tagged (Em breve)',
    icon: Settings,
    route: '#',
    available: false
  }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex flex-col">
      {/* Cabeçalho */}
      <header className="bg-gradient-to-r from-green-800 to-blue-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Network className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Geradores de Script</h1>
          </div>
          <p className="text-green-100 mt-2">Sistema de configuração automática de rede</p>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 mt-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Escolha o tipo de script que você deseja gerar
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Selecione uma das opções abaixo para automatizar a configuração da sua rede
            </p>
          </div>

          {/* Grid de Geradores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {scriptGenerators.map((generator) => (
              <Card 
                key={generator.id} 
                className={`shadow-lg border-0 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  !generator.available ? 'opacity-60' : ''
                }`}
              >
                <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <generator.icon className="h-6 w-6" />
                    {generator.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <CardDescription className="text-gray-700 mb-6 leading-relaxed">
                    {generator.description}
                  </CardDescription>
                  
                  {generator.available ? (
                    <Button 
                      asChild
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 text-lg font-semibold shadow-lg transition-all duration-200"
                      size="lg"
                    >
                      <Link to={generator.route} className="flex items-center justify-center gap-2">
                        Acessar Gerador
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      disabled
                      className="w-full py-3 text-lg font-semibold"
                      size="lg"
                    >
                      Em breve
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      {/* Rodapé */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">Desenvolvido por <span className="font-semibold text-blue-300">Fios Tecnologia</span></p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
