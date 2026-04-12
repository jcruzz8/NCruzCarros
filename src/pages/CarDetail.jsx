import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Calendar, Gauge, Fuel, Zap, ArrowLeft, CheckCircle2, Phone, MessageSquare, Settings, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    document.title = "Detalhes do Veículo | NCRUZ Carros";
    window.scrollTo(0, 0);
    fetchCarDetails();
  }, [id]);

  async function fetchCarDetails() {
    setLoading(true);
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Erro ao procurar carro:", error);
    } else if (data) {
      setCar(data);
      setCurrentIndex(0);
    }
    setLoading(false);
  }

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (car && car.images) {
      setCurrentIndex((prev) => (prev === car.images.length - 1 ? 0 : prev + 1));
    }
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (car && car.images) {
      setCurrentIndex((prev) => (prev === 0 ? car.images.length - 1 : prev - 1));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center pt-20">
        <div className="text-white text-xl flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
           A preparar o veículo...
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center pt-20 text-white gap-6">
        <h1 className="text-3xl font-bold">Veículo não encontrado</h1>
        <p className="text-gray-400">Este anúncio pode já ter sido removido ou vendido.</p>
        <Link to="/stock" className="px-6 py-3 bg-brand-red font-bold rounded-lg hover:bg-red-700 transition-colors">
          Voltar ao Stock
        </Link>
      </div>
    );
  }

  const currentImageUrl = car.images && car.images.length > 0 ? car.images[currentIndex] : '/placeholder.jpg';

  return (
    <div className="bg-brand-dark min-h-screen pt-24 pb-12 relative overflow-hidden">
      
      {/* --- LIGHTBOX --- */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-12 cursor-zoom-out"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-brand-red rounded-full transition-all z-[101]"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
          >
            <X size={32} />
          </button>

          <div className="relative w-full max-w-6xl h-[80vh] flex items-center justify-center">
            {car.images && car.images.length > 1 && (
              <button 
                onClick={handlePrevImage} 
                className="absolute left-0 p-3 text-white bg-black/50 hover:bg-brand-red rounded-full transition-colors z-[101] -translate-x-2 md:-translate-x-8 shadow-lg"
              >
                <ChevronLeft size={36} />
              </button>
            )}

            <img 
              src={currentImageUrl} 
              alt="Imagem ampliada" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />

            {car.images && car.images.length > 1 && (
              <button 
                onClick={handleNextImage} 
                className="absolute right-0 p-3 text-white bg-black/50 hover:bg-brand-red rounded-full transition-colors z-[101] translate-x-2 md:translate-x-8 shadow-lg"
              >
                <ChevronRight size={36} />
              </button>
            )}
          </div>
          
          {car.images && car.images.length > 1 && (
            <div className="absolute bottom-6 text-white font-medium tracking-widest text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
              {currentIndex + 1} / {car.images.length}
            </div>
          )}
        </div>
      )}

      {/* Padrão de Fundo */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 relative z-10">
        <Link to="/stock" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Voltar ao Stand
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* ================= LADO ESQUERDO: GALERIA DE FOTOS ================= */}
          <div className="flex flex-col gap-4">
            
            <div 
              className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 group cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img src={currentImageUrl} alt={car.model} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="bg-black/50 p-4 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                  <ZoomIn size={32} />
                </div>
              </div>

              <div className="absolute top-4 left-4">
                 {/* ALTERAÇÃO 1: Vendido agora fica vermelho (apenas Reservado fica cinza) */}
                 <span className={`px-4 py-2 text-white font-bold rounded-sm shadow-lg tracking-wider uppercase text-sm ${car.tag === 'Reservado' ? 'bg-brand-red' : 'bg-brand-red'}`}>
                   {car.tag}
                 </span>
              </div>
            </div>

            {/* Miniaturas das Fotos */}
            {car.images && car.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {car.images.map((img, index) => (
                  <button 
                    key={index} 
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${currentIndex === index ? 'border-brand-red opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* ================= LADO DIREITO: INFORMAÇÕES E CTA ================= */}
          <div className="flex flex-col h-full justify-center">
            
            <div className="mb-8 border-b border-white/10 pb-8">
              <h2 className="text-gray-400 font-medium text-lg uppercase tracking-widest mb-1">{car.make}</h2>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{car.model}</h1>
              <p className="text-brand-red text-xl font-medium">{car.version}</p>
              <p className="text-4xl font-bold text-white mt-6">{car.price}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                <p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Calendar size={14}/> Ano</p>
                <p className="text-white font-bold">{car.year || 'N/A'}</p>
              </div>
              <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                <p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Gauge size={14}/> Quilómetros</p>
                <p className="text-white font-bold">{car.mileage || 'N/A'}</p>
              </div>
              <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                <p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Fuel size={14}/> Combustível</p>
                <p className="text-white font-bold">{car.fuel || 'N/A'}</p>
              </div>
              <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                <p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Zap size={14}/> Potência</p>
                <p className="text-white font-bold">{car.power || 'N/A'}</p>
              </div>
              <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm md:col-span-2">
                <p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Settings size={14}/> Caixa</p>
                <p className="text-white font-bold">{car.transmission || 'N/A'}</p>
              </div>
            </div>

            {car.description && (
              <div className="mb-10">
                <h3 className="text-white font-bold mb-3 uppercase tracking-wider text-sm">Sobre este veículo</h3>
                <div className="text-gray-400 leading-relaxed text-sm bg-neutral-900/30 p-6 rounded-xl border border-white/5 whitespace-pre-line">
                  {car.description}
                </div>
              </div>
            )}

            {/* ALTERAÇÃO 2: Renderização Condicional da Caixa de Contacto (Vendido vs Disponível) */}
            {car.tag === 'Vendido' ? (
              <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 p-8 rounded-2xl border border-brand-red/30 shadow-[0_0_30px_rgba(220,38,38,0.1)] relative overflow-hidden mt-auto">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="text-brand-red" />
                  Este {car.make} já foi vendido!
                </h3>
                <p className="text-gray-300 text-sm mb-6">
                  Não chegou a tempo? Não se preocupe. A nossa especialidade é a importação à medida. Entre já em contacto connosco para encontrarmos um igual para si.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/#contactos" className="flex-1 bg-brand-red hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-lg">
                    <MessageSquare size={18} />
                    Pedir Orçamento
                  </a>
                  <a href="tel:+351928346476" className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm">
                    <Phone size={18} />
                    Ligar Agora
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 p-8 rounded-2xl border border-brand-red/30 shadow-[0_0_30px_rgba(220,38,38,0.1)] relative overflow-hidden mt-auto">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="text-brand-red" />
                  Interessado neste {car.make}?
                </h3>
                <p className="text-gray-300 text-sm mb-6">
                  Marque já a sua visita e venha ver este carro ao nosso stand. Sem qualquer compromisso.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/#contactos" className="flex-1 bg-brand-red hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-lg">
                    <MessageSquare size={18} />
                    Pedir Informações
                  </a>
                  <a href="tel:+351928346476" className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm">
                    <Phone size={18} />
                    Ligar Agora
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;