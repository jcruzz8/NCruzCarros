import React from 'react';
import { MessageSquare, SearchCheck, Key, ArrowRight, ShieldCheck } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: MessageSquare,
    title: "Consulta & Definição",
    desc: "Reunimos consigo para definir o carro dos seus sonhos: marca, modelo, extras e orçamento máximo.",
  },
  {
    id: 2,
    icon: SearchCheck,
    title: "Procura & Inspeção",
    desc: "A nossa equipa localiza as melhores opções na Europa.",
  },
  {
    id: 3,
    icon: Key,
    title: "Entrega Chave na Mão",
    desc: "Tratamos do transporte, inspeção, legalização (ISV/IUC) e entregamos o carro à sua porta com matrícula portuguesa.",
  }
];

const ImportProcess = () => {
  return (
    <section id="importacao" className="py-24 bg-neutral-950 relative overflow-hidden">
      {/* Background Decorativo subtil */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabeçalho */}
        <div className="text-center mb-20">
          <span className="text-brand-red font-bold tracking-widest text-sm uppercase">Sem Dores de Cabeça</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 text-white">
            Importação em <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-400">3 Passos Simples</span>
          </h2>
        </div>

        {/* Container dos Passos */}
        <div className="relative">
          
          {/* A Linha Conectora (Visível apenas em Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-800">
            {/* Gradiente vermelho animado ou fixo para dar estilo */}
            <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-50 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex flex-col items-center text-center group">
                
                {/* Círculo do Ícone */}
                <div className="relative">
                  <div className="w-24 h-24 bg-neutral-900 border-2 border-gray-700 rounded-full flex items-center justify-center mb-6 z-10 relative transition-all duration-500 group-hover:border-brand-red group-hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                    <step.icon className="w-10 h-10 text-gray-400 group-hover:text-brand-red transition-colors duration-300" />
                  </div>
                  
                  {/* Número do passo (Badge) */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-sm border-4 border-neutral-950">
                    {step.id}
                  </div>
                </div>

                {/* Texto */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-red transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>

              </div>
            ))}
          </div>
        </div>

        {/* Call to Action desta secção */}
        <div className="mt-20 flex flex-col items-center">
          <div className="p-8 bg-neutral-900/50 border border-white/5 rounded-2xl max-w-3xl w-full text-center backdrop-blur-sm">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left">
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="text-brand-red" />
                        Segurança Total
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">Todo o processo é realizado por um membro da equipa. Atualizando e conversando sempre com o cliente ao longo da importação.</p>
                </div>
                <a 
                  href="/#contactos" 
                  className="whitespace-nowrap px-8 py-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-sm transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center gap-2 w-fit"
                >
                  Simular Importação
                  <ArrowRight size={18} />
                </a>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ImportProcess;