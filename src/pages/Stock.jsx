import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { 
  Fuel, Calendar, Gauge, ArrowRight, Zap, CarFront, Filter, Search, 
  XCircle, ChevronLeft, ChevronRight, ChevronDown, RotateCcw 
} from 'lucide-react';

const FilterField = ({ label, children, fullWidth = false }) => (
  <div className={`relative mt-2 ${fullWidth ? 'md:col-span-2 lg:col-span-4' : ''}`}>
    <label className="absolute -top-2.5 left-4 bg-neutral-900 px-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest z-10">
      {label}
    </label>
    <div className="relative z-0">
      {children}
      {children.type === 'select' && (
        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      )}
    </div>
  </div>
);

const Stock = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filterMake, setFilterMake] = useState('Todas');
  const [filterModel, setFilterModel] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState(''); 
  const [maxPrice, setMaxPrice] = useState('');
  const [maxMileage, setMaxMileage] = useState('');
  const [minYear, setMinYear] = useState(''); 
  const [filterTransmission, setFilterTransmission] = useState('Todas');
  const [filterFuel, setFilterFuel] = useState('Todos');
  const [filterSegment, setFilterSegment] = useState('Todos');
  const [filterSeats, setFilterSeats] = useState('Todas');
  const [filterDoors, setFilterDoors] = useState('Todas');
  const [sortOrder, setSortOrder] = useState('recentes');
  
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 9;

  useEffect(() => {
    document.title = "Stock Local | NCRUZ Carros";
    fetchCars();
  }, []);

  // ================= CORREÇÃO DO SCROLL =================
  // Este espião deteta sempre que a página muda e força a subida
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);
  // ======================================================

  async function fetchCars() {
    setLoading(true);
    let { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setCars(data);
      setFilteredCars(data);
    }
    setLoading(false);
  }

  const parseNumber = (str) => {
    if (!str) return 0;
    const numberMatches = String(str).match(/\d+/g);
    return numberMatches ? parseInt(numberMatches.join(''), 10) : 0;
  };

  const formatText = (str) => {
    if (!str) return '';
    const cleanStr = str.trim();
    return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1).toLowerCase();
  };

  const uniqueMakes = useMemo(() => {
    const makes = cars.map(c => formatText(c.make)).filter(Boolean);
    return ['Todas', ...new Set(makes)].sort();
  }, [cars]);
  
  const availableModels = useMemo(() => {
    if (filterMake === 'Todas') return ['Todos'];
    const models = cars
      .filter(c => formatText(c.make).toLowerCase() === filterMake.toLowerCase())
      .map(c => formatText(c.model))
      .filter(Boolean);
    return ['Todos', ...new Set(models)].sort();
  }, [cars, filterMake]);

  const uniqueFuels = useMemo(() => ['Todos', ...new Set(cars.map(c => formatText(c.fuel)).filter(Boolean))], [cars]);
  const uniqueSegments = useMemo(() => ['Todos', ...new Set(cars.map(c => formatText(c.segment)).filter(Boolean))], [cars]);
  
  const yearBounds = useMemo(() => {
    const years = cars.map(c => parseNumber(c.year)).filter(y => y > 1900);
    if (!years.length) return { min: 1990, max: new Date().getFullYear() };
    return { min: Math.min(...years), max: Math.max(...years) };
  }, [cars]);

  useEffect(() => { setFilterModel('Todos'); }, [filterMake]);

  // LÓGICA DE FILTRAGEM
  useEffect(() => {
    let result = [...cars];

    if (filterMake !== 'Todas') result = result.filter(car => formatText(car.make).toLowerCase() === filterMake.toLowerCase());
    if (filterModel !== 'Todos') result = result.filter(car => formatText(car.model).toLowerCase() === filterModel.toLowerCase());
    if (filterFuel !== 'Todos') result = result.filter(car => formatText(car.fuel).toLowerCase() === filterFuel.toLowerCase());
    if (filterTransmission !== 'Todas') result = result.filter(car => car.transmission?.toLowerCase().includes(filterTransmission.toLowerCase()));
    if (filterSegment !== 'Todos') result = result.filter(car => formatText(car.segment).toLowerCase() === filterSegment.toLowerCase());
    if (filterSeats !== 'Todas') result = result.filter(car => car.seats?.includes(filterSeats));
    if (filterDoors !== 'Todas') result = result.filter(car => car.doors?.includes(filterDoors));
    
    if (showOnlyAvailable) {
      result = result.filter(car => car.tag === 'Disponível' || car.tag === 'Novo');
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(car => car.version?.toLowerCase().includes(term) || car.model?.toLowerCase().includes(term));
    }

    if (minYear) result = result.filter(car => parseNumber(car.year) >= parseInt(minYear, 10));
    if (maxMileage) result = result.filter(car => parseNumber(car.mileage) <= parseInt(maxMileage, 10));

    if (maxPrice) {
      result = result.filter(car => {
        const p = parseNumber(car.price);
        return p > 0 && p <= parseInt(maxPrice, 10);
      });
    }

    if (sortOrder === 'preco-asc') result.sort((a, b) => parseNumber(a.price) - parseNumber(b.price));
    else if (sortOrder === 'preco-desc') result.sort((a, b) => parseNumber(b.price) - parseNumber(a.price));
    else if (sortOrder === 'recomendados') {
      const statusOrder = { 'Novo': 1, 'Disponível': 2, 'Reservado': 3, 'Vendido': 4 };
      result.sort((a, b) => (statusOrder[a.tag] || 5) - (statusOrder[b.tag] || 5));
    } else result.sort((a, b) => b.id - a.id); 

    setCurrentPage(1); 
    setFilteredCars(result);
  }, [cars, filterMake, filterModel, searchTerm, sortOrder, minYear, filterFuel, maxPrice, maxMileage, filterTransmission, filterSegment, filterSeats, filterDoors, showOnlyAvailable]);

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  const resetFilters = () => {
    setFilterMake('Todas'); setFilterModel('Todos'); setSearchTerm(''); setMaxPrice('');
    setMaxMileage(''); setMinYear(''); setFilterTransmission('Todas'); 
    setFilterFuel('Todos'); setFilterSegment('Todos'); setFilterSeats('Todas'); 
    setFilterDoors('Todas'); setSortOrder('recentes'); setShowOnlyAvailable(false); setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm !== '' || filterMake !== 'Todas' || minYear !== '' || filterFuel !== 'Todos' || maxPrice !== '' || maxMileage !== '' || filterTransmission !== 'Todas' || filterSegment !== 'Todos' || filterSeats !== 'Todas' || filterDoors !== 'Todas' || showOnlyAvailable;

  if (loading) return <div className="min-h-screen bg-brand-dark flex items-center justify-center pt-20"><div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-brand-dark min-h-screen pt-24 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {cars.length > 0 && (
          <div className="text-center mb-8">
            <span className="text-brand-red font-bold tracking-widest text-sm uppercase italic">A nossa garagem</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">Stock Disponível</h1>
          </div>
        )}

        {cars.length === 0 ? (
          <div className="text-center py-24 bg-neutral-900/40 rounded-2xl border border-white/5 backdrop-blur-sm max-w-3xl mx-auto mt-12">
            <div className="flex justify-center mb-6"><div className="bg-brand-red/10 p-4 rounded-full border border-brand-red/20"><CarFront size={48} className="text-brand-red opacity-80" /></div></div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Não há stock disponível de momento.</h3>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">Todos os carros já foram vendidos, mas a nossa especialidade é a importação à medida.</p>
            <Link to="/#contactos" className="inline-block px-8 py-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(220,38,38,0.3)]">Quero Encomendar</Link>
          </div>
        ) : (
          <>
            <div className={`relative mb-16 transition-all duration-500`}>
              {!showFilters ? (
                <button onClick={() => setShowFilters(true)} className="w-full flex justify-between items-center p-6 bg-neutral-900 border border-white/10 rounded-2xl hover:border-brand-red/50 transition-all shadow-xl group">
                  <div className="flex items-center gap-3 text-white font-bold text-lg"><Filter className="text-brand-red group-hover:scale-110 transition-transform" size={24}/> Filtrar Pesquisa</div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">A mostrar <span className="text-white font-bold">{filteredCars.length}</span> viaturas <ChevronDown size={20} /></div>
                </button>
              ) : (
                <div className="relative bg-neutral-900 border border-white/10 rounded-2xl p-6 sm:p-8 pt-10 pb-16 shadow-2xl animate-in fade-in zoom-in duration-300">
                  <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3 text-white font-bold text-lg"><Filter className="text-brand-red" size={24}/> Pesquisa Avançada</div>
                    <div className="flex items-center gap-4">
                      <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors bg-white/5 px-3 py-1.5 rounded-full"><RotateCcw size={14} /> Limpar Filtros</button>
                      <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white p-1"><XCircle size={24} /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
                    <FilterField label="Marca">
                      <select value={filterMake} onChange={(e) => setFilterMake(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-lg text-white appearance-none focus:border-brand-red outline-none">
                        {uniqueMakes.map(m => <option key={m} value={m}>{m === 'Todas' ? 'Selecionar Marca' : m}</option>)}
                      </select>
                    </FilterField>

                    <FilterField label="Modelo">
                      <select disabled={filterMake === 'Todas'} value={filterModel} onChange={(e) => setFilterModel(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-lg text-white appearance-none focus:border-brand-red outline-none disabled:opacity-30">
                        {availableModels.map(m => <option key={m} value={m}>{m === 'Todos' ? 'Todos os Modelos' : m}</option>)}
                      </select>
                    </FilterField>

                    <FilterField label="Intervalo de Preço">
                      <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-lg text-white appearance-none focus:border-brand-red outline-none">
                        <option value="">Preço até...</option>
                        {[2500, 5000, 7500, 10000, 15000, 20000, 25000, 50000, 75000, 100000].map(v => (
                          <option key={v} value={v} className="text-white">Até {v.toLocaleString('pt-PT')} €</option>
                        ))}
                      </select>
                    </FilterField>

                    <FilterField label="Kilómetros">
                      <select value={maxMileage} onChange={(e) => setMaxMileage(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-lg text-white appearance-none focus:border-brand-red outline-none">
                        <option value="">Sem limite de Km</option>
                        {[50000, 100000, 150000, 200000, 300000, 400000, 500000].map(v => (
                          <option key={v} value={v}>Até {v.toLocaleString('pt-PT')} km</option>
                        ))}
                      </select>
                    </FilterField>

                    <FilterField label={`Ano: ${minYear || yearBounds.min} a ${yearBounds.max}`} fullWidth>
                      <div className="flex items-center gap-4 px-2 py-4">
                        <span className="text-xs text-gray-500 font-bold">{yearBounds.min}</span>
                        <input 
                          type="range" min={yearBounds.min} max={yearBounds.max} 
                          value={minYear || yearBounds.min} onChange={(e) => setMinYear(e.target.value)}
                          className="flex-1 accent-brand-red h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-gray-500 font-bold">{yearBounds.max}</span>
                      </div>
                    </FilterField>

                    <FilterField label="Transmissão">
                      <select value={filterTransmission} onChange={(e) => setFilterTransmission(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-lg text-white appearance-none focus:border-brand-red outline-none">
                        <option value="Todas">Todas</option>
                        <option value="Manual">Manual</option>
                        <option value="Automática">Automática</option>
                      </select>
                    </FilterField>

                    <FilterField label="Combustível">
                      <select value={filterFuel} onChange={(e) => setFilterFuel(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-lg text-white appearance-none focus:border-brand-red outline-none">
                        {uniqueFuels.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </FilterField>

                    <FilterField label="Segmento">
                      <select value={filterSegment} onChange={(e) => setFilterSegment(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-lg text-white appearance-none focus:border-brand-red outline-none">
                        {uniqueSegments.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </FilterField>

                    <FilterField label="Lotação">
                      <select value={filterSeats} onChange={(e) => setFilterSeats(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-lg text-white appearance-none focus:border-brand-red outline-none">
                        <option value="Todas">Qualquer lotação</option>
                        {['2', '3', '4', '5', '7', '9'].map(s => <option key={s} value={s}>{s} Lugares</option>)}
                      </select>
                    </FilterField>

                    <FilterField label="Portas">
                      <select value={filterDoors} onChange={(e) => setFilterDoors(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-lg text-white appearance-none focus:border-brand-red outline-none">
                        <option value="Todas">Todas</option>
                        <option value="2">2 Portas</option>
                        <option value="3">3 Portas</option>
                        <option value="4">4 Portas</option>
                        <option value="5">5 Portas</option>
                      </select>
                    </FilterField>

                    <FilterField label="Ordenar Por">
                      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full bg-black border border-brand-red/30 p-4 rounded-lg text-white appearance-none focus:border-brand-red outline-none">
                        <option value="recentes">+ Recentes</option>
                        <option value="recomendados">+ Recomendados</option>
                        <option value="preco-asc">Preço: Mais baixo</option>
                        <option value="preco-desc">Preço: Mais alto</option>
                      </select>
                    </FilterField>

                    <FilterField label="Outras Versões">
                      <input type="text" placeholder="Ex: AMG, M-Sport..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-lg text-white focus:border-brand-red outline-none" />
                    </FilterField>

                    {/* TOGGLE PARA MOSTRAR APENAS DISPONÍVEIS */}
                    <div className="md:col-span-2 lg:col-span-4 flex items-center justify-start mt-2">
                      <button 
                        onClick={() => setShowOnlyAvailable(!showOnlyAvailable)} 
                        className="group flex items-center gap-3 focus:outline-none"
                      >
                        <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${showOnlyAvailable ? 'bg-brand-red' : 'bg-white/20 group-hover:bg-white/30'}`}>
                          <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${showOnlyAvailable ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                        <span className="text-gray-300 font-medium text-sm transition-colors group-hover:text-white">
                          Mostrar apenas automóveis disponíveis
                        </span>
                      </button>
                    </div>

                  </div>

                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-20">
                    <button onClick={() => setShowFilters(false)} className="bg-brand-red text-white font-bold px-10 py-4 rounded-full flex items-center gap-3 shadow-2xl hover:bg-red-700 hover:scale-105 transition-all text-sm tracking-widest uppercase">
                      Ver {filteredCars.length} Resultados <Search size={18}/>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* --- GRELHA DE CARROS --- */}
            {filteredCars.length === 0 ? (
              <div className="text-center py-20 bg-neutral-900/20 rounded-2xl border border-white/5 border-dashed">
                <Search size={48} className="text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Sem resultados</h3>
                <p className="text-gray-400 mb-6">Tenta ajustar os critérios da tua pesquisa.</p>
                <button onClick={resetFilters} className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">Limpar Tudo</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentCars.map((car) => (
                    <Link to={`/carro/${car.id}`} key={car.id} className="group bg-neutral-900 rounded-lg overflow-hidden border border-white/5 hover:border-brand-red/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] flex flex-col">
                      <div className="relative h-64 overflow-hidden">
                        <div className="absolute top-4 left-4 z-20">
                           <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-sm shadow-lg ${car.tag === 'Reservado' ? 'bg-gray-600' : 'bg-brand-red'}`}>{car.tag}</span>
                        </div>
                        <img src={car.images?.[0] || '/placeholder.jpg'} alt={car.model} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" />
                      </div>
                      <div className="p-6 flex flex-col flex-grow relative z-10">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-white mb-1">{car.make} {car.model}</h3>
                          {car.version && <p className="text-brand-red font-medium text-sm truncate uppercase tracking-tighter">{car.version}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 text-xs text-gray-400 font-medium">
                          {car.year && <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg"><Calendar size={14} className="text-brand-red" /><span>{car.year}</span></div>}
                          {car.mileage && <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg"><Gauge size={14} className="text-brand-red" /><span>{car.mileage}</span></div>}
                          {car.fuel && <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg"><Fuel size={14} className="text-brand-red" /><span>{car.fuel}</span></div>}
                          {car.segment && <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg"><CarFront size={14} className="text-brand-red" /><span>{car.segment}</span></div>}
                        </div>
                        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                          <div>
                            {car.price ? (
                              <><p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Preço NCRUZ</p><p className="text-2xl font-black text-white">{car.price}</p></>
                            ) : (
                              <p className="text-lg font-bold text-gray-400 italic">Sob Consulta</p>
                            )}
                          </div>
                          <div className="p-3 bg-white/5 group-hover:bg-brand-red rounded-full transition-all group-hover:translate-x-1 shadow-lg"><ArrowRight size={20} className="text-white" /></div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-16 gap-4">
                    <button onClick={prevPage} disabled={currentPage === 1} className="p-3 rounded-full bg-neutral-800 text-white disabled:opacity-20 hover:bg-brand-red transition-all shadow-xl"><ChevronLeft size={24} /></button>
                    <span className="text-gray-400 font-bold text-sm">Página {currentPage} de {totalPages}</span>
                    <button onClick={nextPage} disabled={currentPage === totalPages} className="p-3 rounded-full bg-neutral-800 text-white disabled:opacity-20 hover:bg-brand-red transition-all shadow-xl"><ChevronRight size={24} /></button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Stock;