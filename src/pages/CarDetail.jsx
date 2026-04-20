import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { 
  Calendar, Gauge, Fuel, Zap, ArrowLeft, CheckCircle2, Phone, MessageSquare, 
  Settings, ZoomIn, X, ChevronLeft, ChevronRight, Users, CarFront, Flag, 
  Wind, Palette, DoorOpen, ShieldCheck, Activity, ArrowRight, PlayCircle 
} from 'lucide-react';

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false); // NOVO: Controla se a imagem está super ampliada

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCarDetails();
  }, [id]);

  const parseNumber = (str) => {
    if (!str) return 0;
    const match = String(str).match(/\d+/g);
    return match ? parseInt(match.join(''), 10) : 0;
  };

  const cleanText = (str) => str ? str.trim().toLowerCase() : '';

  async function fetchCarDetails() {
    setLoading(true);
    const { data: currentCar, error } = await supabase.from('cars').select('*').eq('id', id).single();

    if (error) {
      console.error("Erro ao procurar carro:", error);
    } else if (currentCar) {
      setCar(currentCar);
      setCurrentIndex(0);
      document.title = `${currentCar.make} ${currentCar.model} | NCRUZ Carros`;
      
      const { data: otherCars } = await supabase.from('cars').select('*').neq('id', currentCar.id);
      
      if (otherCars) {
        const targetPrice = parseNumber(currentCar.price);
        const targetModel = cleanText(currentCar.model);
        const targetMake = cleanText(currentCar.make);

        otherCars.sort((a, b) => {
          const getStatusWeight = (tag) => (tag === 'Disponível' || tag === 'Novo' ? 1 : 2);
          const weightA = getStatusWeight(a.tag);
          const weightB = getStatusWeight(b.tag);
          if (weightA !== weightB) return weightA - weightB;

          const aSameModel = cleanText(a.model) === targetModel;
          const bSameModel = cleanText(b.model) === targetModel;
          if (aSameModel && !bSameModel) return -1;
          if (!aSameModel && bSameModel) return 1;

          const aSameMake = cleanText(a.make) === targetMake;
          const bSameMake = cleanText(b.make) === targetMake;
          if (aSameMake && !bSameMake) return -1;
          if (!aSameMake && bSameMake) return 1;

          const distA = Math.abs(parseNumber(a.price) - targetPrice);
          const distB = Math.abs(parseNumber(b.price) - targetPrice);
          return distA - distB;
        });

        setSimilarCars(otherCars.slice(0, 3));
      }
    }
    setLoading(false);
  }

  const images = car?.images || [];
  const hasVideo = !!car?.video_link;
  const mediaCount = images.length + (hasVideo ? 1 : 0);
  const isVideoCurrent = hasVideo && currentIndex === images.length;

  const handleNextMedia = (e) => { e.stopPropagation(); if (mediaCount > 0) setCurrentIndex((prev) => (prev === mediaCount - 1 ? 0 : prev + 1)); };
  const handlePrevMedia = (e) => { e.stopPropagation(); if (mediaCount > 0) setCurrentIndex((prev) => (prev === 0 ? mediaCount - 1 : prev - 1)); };

  // Setas no Lightbox agora tiram o zoom ao mudar de foto
  const handleLightboxNext = (e) => { e.stopPropagation(); setIsZoomed(false); if (images.length > 0) setCurrentIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1)); };
  const handleLightboxPrev = (e) => { e.stopPropagation(); setIsZoomed(false); if (images.length > 0) setCurrentIndex((prev) => (prev <= 0 ? images.length - 1 : prev - 1)); };

  const closeLightbox = () => { setIsLightboxOpen(false); setIsZoomed(false); };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtu.be')) return url.replace('youtu.be/', 'youtube.com/embed/');
    if (url.includes('watch?v=')) return url.replace('watch?v=', 'embed/').split('&')[0];
    return url;
  };

  if (loading) return <div className="min-h-screen bg-brand-dark flex items-center justify-center pt-20"><div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div></div>;
  if (!car) return <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center pt-20 text-white gap-6"><h1 className="text-3xl font-bold">Veículo não encontrado</h1><Link to="/stock" className="px-6 py-3 bg-brand-red font-bold rounded-lg hover:bg-red-700 transition-colors">Voltar ao Stock</Link></div>;

  const currentImageUrl = images.length > 0 ? images[currentIndex] : '/placeholder.jpg';

  return (
    <div className="bg-brand-dark min-h-screen pt-24 pb-24 relative overflow-hidden">
      
      {/* ================= LIGHTBOX DE ZOOM AVANÇADO ================= */}
      {isLightboxOpen && !isVideoCurrent && (
        <div 
          className={`fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm transition-all duration-300 ${isZoomed ? 'overflow-auto cursor-zoom-out' : 'flex items-center justify-center p-4 cursor-zoom-out'}`} 
          onClick={closeLightbox}
        >
          {/* Botão de Fechar fixo no canto */}
          <button className="fixed top-6 right-6 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-brand-red rounded-full transition-all z-[1000]" onClick={(e) => { e.stopPropagation(); closeLightbox(); }}>
            <X size={32} />
          </button>
          
          <div className={`relative flex items-center justify-center ${isZoomed ? 'min-w-full min-h-full p-4' : 'w-full max-w-6xl h-[80vh]'}`}>
            
            {!isZoomed && images.length > 1 && (
              <button onClick={handleLightboxPrev} className="absolute left-0 p-3 text-white bg-black/50 hover:bg-brand-red rounded-full transition-colors z-[101] -translate-x-2 md:-translate-x-8">
                <ChevronLeft size={36} />
              </button>
            )}
            
            {/* Imagem Ampliável */}
            <img 
              src={currentImageUrl} 
              alt="Ampliada" 
              className={`${isZoomed ? 'w-[150vw] md:w-[120vw] max-w-none cursor-zoom-out' : 'max-w-full max-h-full object-contain cursor-zoom-in'} rounded-lg shadow-2xl transition-all duration-300 origin-center`} 
              onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }} 
              title={isZoomed ? "Reduzir imagem" : "Ampliar imagem ao máximo"}
            />

            {!isZoomed && images.length > 1 && (
              <button onClick={handleLightboxNext} className="absolute right-0 p-3 text-white bg-black/50 hover:bg-brand-red rounded-full transition-colors z-[101] translate-x-2 md:translate-x-8">
                <ChevronRight size={36} />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 relative z-10">
        <Link to="/stock" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"><ArrowLeft size={20} /> Voltar ao Stand</Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="flex flex-col gap-4">
            
            {/* VISOR PRINCIPAL */}
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 group">
              {isVideoCurrent ? (
                <iframe src={getEmbedUrl(car.video_link)} className="w-full h-full" allowFullScreen></iframe>
              ) : (
                <div className="w-full h-full relative cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
                  <img src={currentImageUrl} alt={car.model} className="w-full h-full object-cover" />
                  <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsLightboxOpen(true); }} className="absolute bottom-4 right-4 p-3 bg-black/60 hover:bg-brand-red text-white rounded-full backdrop-blur-md z-30 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:scale-110 cursor-pointer pointer-events-auto" title="Fazer Zoom">
                    <ZoomIn size={24}/>
                  </button>
                </div>
              )}

              {mediaCount > 1 && (
                <>
                  <button onClick={handlePrevMedia} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-brand-red text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md z-40 shadow-lg pointer-events-auto"><ChevronLeft size={28}/></button>
                  <button onClick={handleNextMedia} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-brand-red text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md z-40 shadow-lg pointer-events-auto"><ChevronRight size={28}/></button>
                </>
              )}

              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                 <span className={`px-4 py-2 text-white font-bold rounded-sm shadow-lg tracking-wider uppercase text-sm ${car.tag === 'Reservado' ? 'bg-gray-600' : 'bg-brand-red'}`}>{car.tag}</span>
              </div>
            </div>

            {/* Miniaturas */}
            {mediaCount > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {images.map((img, index) => (
                  <button key={index} onClick={() => setCurrentIndex(index)} className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${currentIndex === index ? 'border-brand-red opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
                {hasVideo && (
                  <button onClick={() => setCurrentIndex(images.length)} className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all bg-neutral-800 flex items-center justify-center group ${isVideoCurrent ? 'border-brand-red opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                    <PlayCircle size={28} className="text-brand-red opacity-80 group-hover:scale-110 transition-transform" />
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest text-white">VÍDEO</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col h-full">
            <div className="mb-8 border-b border-white/10 pb-8">
              <h2 className="text-gray-400 font-medium text-lg uppercase tracking-widest mb-1">{car.make}</h2>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{car.model}</h1>
              {car.version && <p className="text-brand-red text-xl font-medium">{car.version}</p>}
              {car.price && <p className="text-4xl font-bold text-white mt-6">{car.price}</p>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {car.year && <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5"><p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Calendar size={14}/> Registo</p><p className="text-white font-bold">{car.year}</p></div>}
              {car.mileage && <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5"><p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Gauge size={14}/> Km's</p><p className="text-white font-bold">{car.mileage}</p></div>}
              {car.fuel && <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5"><p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Fuel size={14}/> Combustível</p><p className="text-white font-bold">{car.fuel}</p></div>}
              {car.power && <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5"><p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Zap size={14}/> Potência</p><p className="text-white font-bold">{car.power}</p></div>}
              {car.transmission && <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5"><p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Settings size={14}/> Caixa</p><p className="text-white font-bold">{car.transmission}</p></div>}
              {car.engine_capacity && <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5"><p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Activity size={14}/> Cilindrada</p><p className="text-white font-bold">{car.engine_capacity}</p></div>}
              {car.origin && <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5"><p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Flag size={14}/> Origem</p><p className="text-white font-bold">{car.origin}</p></div>}
              {car.segment && <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5"><p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><CarFront size={14}/> Segmento</p><p className="text-white font-bold">{car.segment}</p></div>}
              {car.color && <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5"><p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Palette size={14}/> Cor</p><p className="text-white font-bold">{car.color}</p></div>}
              {car.doors && <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5"><p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><DoorOpen size={14}/> Portas</p><p className="text-white font-bold">{car.doors}</p></div>}
              {car.seats && <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5"><p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Users size={14}/> Lugares</p><p className="text-white font-bold">{car.seats}</p></div>}
              {car.condition && <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5"><p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Activity size={14}/> Estado</p><p className="text-white font-bold">{car.condition}</p></div>}
              {car.emissions && <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5"><p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Wind size={14}/> Emissões</p><p className="text-white font-bold">{car.emissions}</p></div>}
              {car.consumption && <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5"><p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><Fuel size={14}/> Consumos</p><p className="text-white font-bold">{car.consumption}</p></div>}
              {car.warranty && <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 md:col-span-2"><p className="text-gray-500 text-xs uppercase mb-1 flex items-center gap-2"><ShieldCheck size={14}/> Garantia</p><p className="text-white font-bold">{car.warranty}</p></div>}
            </div>

            {car.description && (
              <div className="mb-10">
                <h3 className="text-white font-bold mb-3 uppercase tracking-wider text-sm">Sobre este veículo</h3>
                <div className="text-gray-400 leading-relaxed text-sm bg-neutral-900/30 p-6 rounded-xl border border-white/5 whitespace-pre-line">{car.description}</div>
              </div>
            )}

            {car.tag === 'Vendido' ? (
              <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 p-8 rounded-2xl border border-brand-red/30 shadow-[0_0_30px_rgba(220,38,38,0.1)] relative overflow-hidden mt-auto">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><CheckCircle2 className="text-brand-red" />Este {car.make} já foi vendido!</h3>
                <p className="text-gray-300 text-sm mb-6">Não chegou a tempo? Não se preocupe. A nossa especialidade é a importação à medida. Entre já em contacto connosco para encontrarmos um igual para si.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/#contactos" className="flex-1 bg-brand-red hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-lg"><MessageSquare size={18} />Pedir Orçamento</a>
                  <a href="tel:+351928346476" className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"><Phone size={18} />Ligar Agora</a>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 p-8 rounded-2xl border border-brand-red/30 shadow-[0_0_30px_rgba(220,38,38,0.1)] relative overflow-hidden mt-auto">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><CheckCircle2 className="text-brand-red" />Interessado neste {car.make}?</h3>
                <p className="text-gray-300 text-sm mb-6">Marque já a sua visita e venha ver este carro ao nosso stand. Sem qualquer compromisso.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/#contactos" className="flex-1 bg-brand-red hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-lg"><MessageSquare size={18} />Pedir Informações</a>
                  <a href="tel:+351928346476" className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"><Phone size={18} />Ligar Agora</a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= SECÇÃO VEÍCULOS RECOMENDADOS ================= */}
        {similarCars.length > 0 && (
          <div className="mt-24 pt-12 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-8">Recomendados para si</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarCars.map((similarCar) => (
                <Link to={`/carro/${similarCar.id}`} key={similarCar.id} className="group bg-neutral-900 rounded-xl overflow-hidden border border-white/5 hover:border-brand-red/50 transition-all duration-300 flex flex-col hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <div className="relative h-56 overflow-hidden">
                    <img src={similarCar.images?.[0] || '/placeholder.jpg'} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 z-10"><span className={`px-3 py-1 text-xs font-bold uppercase text-white rounded-sm shadow-lg ${similarCar.tag === 'Reservado' ? 'bg-gray-600' : 'bg-brand-red'}`}>{similarCar.tag}</span></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" />
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow relative z-20">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white leading-tight">{similarCar.make} {similarCar.model}</h3>
                      {similarCar.version && <p className="text-brand-red font-medium text-xs truncate uppercase">{similarCar.version}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-6 text-xs text-gray-400 font-medium">
                      {similarCar.year && <div className="flex items-center gap-1.5"><Calendar size={12} className="text-brand-red" /><span>{similarCar.year}</span></div>}
                      {similarCar.mileage && <div className="flex items-center gap-1.5"><Gauge size={12} className="text-brand-red" /><span>{similarCar.mileage}</span></div>}
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                      {similarCar.price ? (
                        <p className="text-xl font-black text-white">{similarCar.price}</p>
                      ) : (
                        <p className="text-sm font-bold text-gray-400 italic">Sob Consulta</p>
                      )}
                      <div className="p-2 bg-white/5 group-hover:bg-brand-red rounded-full transition-all group-hover:translate-x-1"><ArrowRight size={16} className="text-white" /></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CarDetail;