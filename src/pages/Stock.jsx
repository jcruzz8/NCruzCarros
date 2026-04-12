import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { Fuel, Calendar, Gauge, ArrowRight, Zap, CarFront, Filter, Search, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'; // Adicionei ChevronLeft e ChevronRight

const Stock = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // ESTADOS DOS FILTROS
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('recentes'); // recentes, preco-asc, preco-desc
  const [filterMake, setFilterMake] = useState('Todas');
  const [filterYear, setFilterYear] = useState('Todos');
  const [filterFuel, setFilterFuel] = useState('Todos');
  const [minPrice, setMinPrice] = useState('');

  // --- NOVO: ESTADOS PARA PAGINAÇÃO ---
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 9; // Máximo de 9 carros por página

  useEffect(() => {
    document.title = "Stock Local | NCRUZ Carros";
    window.scrollTo(0, 0);
    fetchCars();
  }, []);

  async function fetchCars() {
    setLoading(true);
    let { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCars(data);
      setFilteredCars(data);
    }
    setLoading(false);
  }

  // --- FUNÇÃO PARA LIMPAR O PREÇO ---
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    const numberMatches = priceString.match(/\d+/g);
    return numberMatches ? parseInt(numberMatches.join(''), 10) : 0;
  };

  // --- APLICAR FILTROS E ORDENAÇÃO ---
  useEffect(() => {
    let result = [...cars];

    // 1. Pesquisa por texto (Marca ou Modelo)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(car => 
        (car.make && car.make.toLowerCase().includes(term)) || 
        (car.model && car.model.toLowerCase().includes(term)) ||
        (car.version && car.version.toLowerCase().includes(term))
      );
    }

    // 2. Filtro de Marca
    if (filterMake !== 'Todas') {
      result = result.filter(car => car.make === filterMake);
    }

    // 3. Filtro de Ano
    if (filterYear !== 'Todos') {
      result = result.filter(car => car.year == filterYear);
    }

    // 4. Filtro de Combustível
    if (filterFuel !== 'Todos') {
      result = result.filter(car => car.fuel === filterFuel);
    }

    // 5. Filtro de Preço Mínimo
    if (minPrice) {
      const min = parseInt(minPrice, 10);
      result = result.filter(car => parsePrice(car.price) >= min);
    }

    // 6. Ordenação
    if (sortOrder === 'preco-asc') {
      result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortOrder === 'preco-desc') {
      result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sortOrder === 'recomendados') {
      const statusOrder = { 'Novo': 1, 'Disponível': 2, 'Reservado': 3, 'Vendido': 4 };
      result.sort((a, b) => (statusOrder[a.tag] || 5) - (statusOrder[b.tag] || 5));
    } else {
      result.sort((a, b) => b.id - a.id); 
    }

    setCurrentPage(1); // Importante: Volta à página 1 sempre que os filtros mudam!
    setFilteredCars(result);
  }, [cars, searchTerm, sortOrder, filterMake, filterYear, filterFuel, minPrice]);


  // --- LÓGICA DE PAGINAÇÃO ---
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe a página ao avançar
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe a página ao recuar
    }
  };

  // --- LISTAS DINÂMICAS PARA OS DROPDOWNS ---
  const uniqueMakes = ['Todas', ...new Set(cars.map(c => c.make).filter(Boolean))];
  const uniqueYears = ['Todos', ...new Set(cars.map(c => c.year).filter(Boolean))].sort((a, b) => b - a);
  const uniqueFuels = ['Todos', ...new Set(cars.map(c => c.fuel).filter(Boolean))];

  // --- LIMPAR TODOS OS FILTROS ---
  const resetFilters = () => {
    setSearchTerm('');
    setSortOrder('recentes');
    setFilterMake('Todas');
    setFilterYear('Todos');
    setFilterFuel('Todos');
    setMinPrice('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center pt-20">
        <div className="text-white text-xl animate-pulse flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
           A carregar a nossa garagem...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-dark min-h-screen pt-24 pb-24 relative overflow-hidden">
       
      {/* Padrão de Fundo */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* CABEÇALHO */}
        {cars.length > 0 && (
          <div className="text-center mb-10">
            <span className="text-brand-red font-bold tracking-widest text-sm uppercase">A nossa garagem</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">Stock Disponível</h1>
          </div>
        )}

        {cars.length === 0 ? (
          <div className="text-center py-24 bg-neutral-900/40 rounded-2xl border border-white/5 backdrop-blur-sm max-w-3xl mx-auto mt-12">
            <div className="flex justify-center mb-6">
              <div className="bg-brand-red/10 p-4 rounded-full border border-brand-red/20">
                <CarFront size={48} className="text-brand-red opacity-80" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Não há stock disponível de momento.</h3>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">Todos os carros já foram vendidos, mas a nossa especialidade é a importação à medida.</p>
            <Link to="/#contactos" className="inline-block px-8 py-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              Quero Encomendar
            </Link>
          </div>
        ) : (
          <>
            {/* ================= BARRA DE FILTROS ================= */}
            <div className="bg-neutral-900/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl mb-12 shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-2 text-white font-bold text-lg">
                  <Filter className="text-brand-red" size={24}/> 
                  Filtros & Ordenação
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  A mostrar <span className="text-white font-bold">{filteredCars.length}</span> viaturas
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input type="text" placeholder="Pesquisar modelo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black border border-white/10 text-white p-3 pl-10 rounded-lg focus:border-brand-red outline-none transition-colors" />
                </div>
                <div>
                  <select value={filterMake} onChange={(e) => setFilterMake(e.target.value)} className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:border-brand-red outline-none appearance-none">
                    {uniqueMakes.map(make => <option key={make} value={make}>{make === 'Todas' ? 'Todas as Marcas' : make}</option>)}
                  </select>
                </div>
                <div>
                  <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:border-brand-red outline-none appearance-none">
                    {uniqueYears.map(year => <option key={year} value={year}>{year === 'Todos' ? 'Todos os Anos' : year}</option>)}
                  </select>
                </div>
                <div>
                  <select value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:border-brand-red outline-none appearance-none">
                    <option value="">Preço a partir de...</option>
                    <option value="20000">20.000 €</option>
                    <option value="50000">50.000 €</option>
                    <option value="100000">100.000 €</option>
                    <option value="150000">150.000 €</option>
                  </select>
                </div>
                <div>
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full bg-black border border-brand-red/50 text-white p-3 rounded-lg focus:border-brand-red outline-none appearance-none font-medium">
                    <option value="recentes">+ Recentes</option>
                    <option value="recomendados">+ Recomendados</option>
                    <option value="preco-asc">Preço: Mais barato</option>
                    <option value="preco-desc">Preço: Mais caro</option>
                  </select>
                </div>
              </div>

              {(searchTerm !== '' || filterMake !== 'Todas' || filterYear !== 'Todos' || minPrice !== '') && (
                <div className="mt-4 flex justify-end">
                  <button onClick={resetFilters} className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-red transition-colors">
                    <XCircle size={16} /> Limpar Filtros
                  </button>
                </div>
              )}
            </div>

            {/* ================= GRELHA DE CARROS ================= */}
            {filteredCars.length === 0 ? (
              <div className="text-center py-20 bg-neutral-900/20 rounded-2xl border border-white/5 border-dashed">
                <Search size={48} className="text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Nenhum veículo encontrado</h3>
                <p className="text-gray-400 mb-6">Tente ajustar os filtros ou pesquisar por outra marca.</p>
                <button onClick={resetFilters} className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">
                  Ver todo o stock
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Usamos currentCars em vez de filteredCars para mostrar apenas 9 */}
                  {currentCars.map((car) => (
                    <Link to={`/carro/${car.id}`} key={car.id} className="group bg-neutral-900 rounded-lg overflow-hidden border border-white/5 hover:border-brand-red/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] flex flex-col">
                      
                      <div className="relative h-64 overflow-hidden">
                        <div className="absolute top-4 left-4 z-20">
                           <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-sm ${car.tag === 'Reservado' || car.tag === 'Vendido' ? 'bg-brand-red' : 'bg-brand-red'}`}>
                             {car.tag}
                           </span>
                        </div>
                        <img 
                          src={car.images && car.images.length > 0 ? car.images[0] : '/placeholder.jpg'} 
                          alt={`${car.make} ${car.model}`} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" />
                      </div>

                      <div className="p-6 flex flex-col flex-grow bg-neutral-900 relative z-20">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-white mb-1">{car.make} {car.model}</h3>
                          {/* SÓ APARECE A VERSÃO SE ELA EXISTIR */}
                          {(car.version || car.transmission) && (
                            <p className="text-brand-red font-medium text-sm truncate">{car.version || car.transmission}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 text-sm text-gray-400">
                          {/* RENDERIZAÇÃO CONDICIONAL DOS ÍCONES (Só aparecem se houver dados) */}
                          {car.year && (
                            <div className="flex items-center gap-2"><Calendar size={16} className="text-brand-red" /><span>{car.year}</span></div>
                          )}
                          {car.mileage && (
                            <div className="flex items-center gap-2"><Gauge size={16} className="text-brand-red" /><span>{car.mileage}</span></div>
                          )}
                          {car.fuel && (
                            <div className="flex items-center gap-2"><Fuel size={16} className="text-brand-red" /><span>{car.fuel}</span></div>
                          )}
                          {car.transmission && (
                            <div className="flex items-center gap-2"><Zap size={16} className="text-brand-red" /><span>{car.transmission}</span></div>
                          )}
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                          <div>
                            {/* SÓ APARECE O PREÇO SE ELE EXISTIR */}
                            {car.price && (
                              <>
                                <p className="text-xs text-gray-500 uppercase">Preço</p>
                                <p className="text-2xl font-bold text-white">{car.price}</p>
                              </>
                            )}
                          </div>
                          <div className="p-3 bg-white/5 group-hover:bg-brand-red rounded-full transition-colors group-hover:translate-x-1 duration-300">
                            <ArrowRight size={20} className="text-white" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* ================= PAGINAÇÃO UI ================= */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-16 gap-6">
                    <button 
                      onClick={prevPage} 
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-red transition-colors font-medium shadow-lg"
                    >
                      <ChevronLeft size={20} /> Anterior
                    </button>
                    
                    <span className="text-gray-400 font-medium">
                      Página <span className="text-white">{currentPage}</span> de {totalPages}
                    </span>
                    
                    <button 
                      onClick={nextPage} 
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-red transition-colors font-medium shadow-lg"
                    >
                      Seguinte <ChevronRight size={20} />
                    </button>
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