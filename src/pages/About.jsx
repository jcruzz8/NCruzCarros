import React from 'react';
import { ShieldCheck, Users, Award, MapPin } from 'lucide-react';

const About = () => {
  return (
    // Contentor principal
    <div className="bg-brand-dark min-h-screen pt-20 relative overflow-hidden">
      
      {/* ==================================================================================
          PADRÃO 1: TOPO (Grelha Arquitetónica)
          Desvanece para baixo usando mask-image
      ================================================================================== */}
      <div className="absolute top-0 left-0 right-0 h-[60vh] pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.06]" 
             style={{
               backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
               backgroundSize: '80px 80px',
               // O segredo: Apaga o padrão suavemente à medida que desce
               maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
               WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
             }}>
        </div>
        
        {/* Spot Light Vermelho no topo */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-red/10 blur-[120px] rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
      </div>


      {/* ==================================================================================
          PADRÃO 2: FUNDO (Pontos / Carbono)
          Começa suavemente onde o outro acaba
      ================================================================================== */}
      <div className="absolute inset-0 pointer-events-none -z-10">
         {/* Fundo base ligeiramente diferente para a parte de baixo */}
         <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-neutral-950 to-neutral-950"></div>

         {/* Padrão de Pontos (Dots) muito subtil em toda a altura, mas mais visível em baixo */}
         <div className="absolute inset-0 opacity-[0.03]" 
             style={{
               backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
               backgroundSize: '24px 24px',
               maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)',
               WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)'
             }}>
        </div>
      </div>


      {/* ==================================================================================
          CONTEÚDO DA PÁGINA
      ================================================================================== */}
      <div className="relative z-10"> 

        {/* 1. HEADER (Sobre o Padrão de Grelha) */}
        <div className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-brand-red font-bold tracking-widest text-sm uppercase">A Nossa História</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-8 leading-tight">
              Mais do que vender carros, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-400">criamos relações de confiança.</span>
            </h1>
            
            {/* Caixa de Texto Glass */}
            <div className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-white/5 shadow-2xl">
                <p className="text-lg text-gray-300 leading-relaxed text-justify md:text-center">
                Desde 1996, que a nossa equipa se dedica a importar veículos da Europa. O nosso compromisso é oferecer transparência total, qualidade garantida e um serviço personalizado a cada cliente.
                Mantemos sempre o cliente atualizado durante todo o processo de importação, garantindo uma experiência sem surpresas.
                A nossa alta experiência permite-nos oferecer os preços mais competitivos do mercado e um serviço tão rápido e eficiente quanto possível.
                O nosso stand apenas oferece garantia, em certas situações, variando de carro para carro. Caso o carro que esteja a ser importado ainda tenha a garantia da própria marca ativa, esta será sempre transferida para o cliente final.
                </p>
            </div>

            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 group">
                
                {/* Título flutuante sobre o mapa */}
                <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                    <MapPin size={16} className="text-brand-red" />
                    <span className="text-white text-sm font-bold">Visite o nosso Stand</span>
                </div>

                {/* Google Maps Embed */}
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m17!1m11!1m3!1d126.8637920945285!2d-9.166450942494269!3d38.792473013152055!2m2!1f34.587547698491!2f45!3m2!1i1024!2i768!4f35!3m3!1m2!1s0xd19329f9844073b%3A0x698f93abcfae02f8!2sR.%20de%20Angola%2C%20Olival%20Basto!5e1!3m2!1spt-PT!2spt!4v1769916425179!5m2!1spt-PT!2spt" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'grayscale(75%) invert(00%)' }} // Filtro Dark Mode no Mapa
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização do Stand"
                    className="opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                ></iframe>
            </div>

          </div>
        </div>

        {/* 2. VALORES (Sobre o Padrão de Pontos/Carbono) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 mt-12">
          
          {/* Título subtil para marcar a transição de secção */}
          <div className="text-center mb-16 opacity-50">
             <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-4"></div>
             <span className="uppercase tracking-widest text-xs">Os Nossos Pilares</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            
            {/* Imagem */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group bg-black/20 backdrop-blur-sm h-full min-h-[400px]">
               
               {/* Efeito Glow atrás do logo */}
               <div className="absolute inset-0 bg-brand-red/5 group-hover:bg-brand-red/10 transition-colors duration-500 z-0"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-red/20 blur-[50px] rounded-full z-0"></div>

               {/* MUDANÇA 3: 'object-cover' para preencher tudo */}
               <img 
                 src="/logo.JPEG" 
                 alt="Ncruz Brand" 
                 className="relative z-10 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
               />
            </div>

            {/* Lista de Valores */}
            <div className="space-y-6">
              
              <div className="flex gap-4 bg-neutral-900/40 p-6 rounded-xl border border-white/5 backdrop-blur-md transition-all hover:border-brand-red/30 hover:bg-neutral-900/80 group">
                <div className="bg-black/50 p-3 h-fit rounded-lg border border-white/10 text-brand-red group-hover:text-white transition-colors">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Transparência Total</h3>
                  <p className="text-gray-400 leading-relaxed">Não escondemos nada. Do histórico de manutenção aos custos de legalização, o cliente sabe exatamente o que está a comprar.</p>
                </div>
              </div>

              <div className="flex gap-4 bg-neutral-900/40 p-6 rounded-xl border border-white/5 backdrop-blur-md transition-all hover:border-brand-red/30 hover:bg-neutral-900/80 group">
                <div className="bg-black/50 p-3 h-fit rounded-lg border border-white/10 text-brand-red group-hover:text-white transition-colors">
                  <Users size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Acompanhamento Dedicado</h3>
                  <p className="text-gray-400 leading-relaxed">Não somos um stand gigante e impessoal. Tratamos cada pedido de importação como se fosse para a nossa própria garagem.</p>
                </div>
              </div>

              <div className="flex gap-4 bg-neutral-900/40 p-6 rounded-xl border border-white/5 backdrop-blur-md transition-all hover:border-brand-red/30 hover:bg-neutral-900/80 group">
                <div className="bg-black/50 p-3 h-fit rounded-lg border border-white/10 text-brand-red group-hover:text-white transition-colors">
                  <Award size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Entrega Rápida e Eficiente</h3>
                  <p className="text-gray-400 leading-relaxed">A nossa equipa garante entregas rápidas e eficientes, com prazos claros e transparentes para cada cliente.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. ESTATÍSTICAS (Footer da Página) */}
        <div className="border-t border-white/5 py-16 bg-neutral-950/50 backdrop-blur-sm relative overflow-hidden">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center relative z-10">
              <div>
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">500+</p>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">Carros Entregues</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">30</p>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">Anos de Mercado</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">24h</p>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">Suporte</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;