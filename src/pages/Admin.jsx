import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Upload, X, Plus, Trash2, Edit2, XCircle, Star, Eye, Calendar, Gauge, Fuel, Zap, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'; // Adicionei CheckCircle2 e AlertCircle

const Admin = () => {
  const [loading, setLoading] = useState(false);
  
  // Imagens Novas
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  // Imagens Antigas
  const [editImages, setEditImages] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);
  
  // Preview e Toast (Notificação Elegante)
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' }); // NOVO ESTADO PARA O TOAST

  const [existingCars, setExistingCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    make: '', model: '', version: '', price: '', year: '',
    mileage: '', fuel: '', transmission: '', power: '',
    tag: 'Disponível', description: ''
  });

  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // --- FUNÇÃO DO TOAST (A MENSAGEM BONITA) ---
  const showToastMessage = (message, type = 'success') => {
    setToast({ show: true, message, type });
    // Esconde a mensagem automaticamente após 4 segundos
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  useEffect(() => {
    if (isAuthenticated) fetchExistingCars();
  }, [isAuthenticated]);

  const fetchExistingCars = async () => {
    setLoadingCars(true);
    const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
    if (!error && data) setExistingCars(data);
    setLoadingCars(false);
  };

  const handleDeleteCar = async (id) => {
    // O confirm continua a ser útil para evitar que apagues sem querer
    if (!window.confirm('Tem a certeza que deseja apagar este anúncio?')) return;
    try {
      const { error } = await supabase.from('cars').delete().eq('id', id);
      if (error) throw error;
      
      showToastMessage('Anúncio apagado com sucesso!', 'success'); // MENSAGEM NOVA
      fetchExistingCars();
      if (editingId === id) cancelEdit();
    } catch (error) {
      showToastMessage('Erro ao apagar carro: ' + error.message, 'error'); // MENSAGEM NOVA
    }
  };

  const handleEditClick = (car) => {
    setEditingId(car.id);
    setFormData({
      make: car.make || '', model: car.model || '', version: car.version || '',
      price: car.price || '', year: car.year || '', mileage: car.mileage || '',
      fuel: car.fuel || '', transmission: car.transmission || '', power: car.power || '',
      tag: car.tag || 'Disponível', description: car.description || ''
    });
    
    setEditImages(car.images || []);
    setFiles([]);
    setPreviews([]);
    setCoverIndex(0);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      make: '', model: '', version: '', price: '', year: '',
      mileage: '', fuel: '', transmission: '', power: '',
      tag: 'Disponível', description: ''
    });
    setEditImages([]);
    setFiles([]);
    setPreviews([]);
    setCoverIndex(0);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeEditImage = (indexToRemove) => {
    setEditImages(prev => prev.filter((_, i) => i !== indexToRemove));
    if (coverIndex === indexToRemove) setCoverIndex(0);
    else if (coverIndex > indexToRemove) setCoverIndex(coverIndex - 1);
  };

  const removeNewImage = (indexToRemove) => {
    setFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    setPreviews(prev => prev.filter((_, i) => i !== indexToRemove));
    
    const globalIndex = editImages.length + indexToRemove;
    if (coverIndex === globalIndex) setCoverIndex(0);
    else if (coverIndex > globalIndex) setCoverIndex(coverIndex - 1);
  };

  const getCoverImageUrl = () => {
    if (coverIndex < editImages.length) return editImages[coverIndex];
    if (previews.length > 0) return previews[coverIndex - editImages.length];
    return '/placeholder.jpg';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newImageUrls = [];

      for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from('car-images').upload(fileName, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('car-images').getPublicUrl(fileName);
        newImageUrls.push(publicUrl);
      }

      let finalImages = [...editImages, ...newImageUrls];

      if (finalImages.length > 0 && coverIndex > 0 && coverIndex < finalImages.length) {
        const cover = finalImages.splice(coverIndex, 1)[0];
        finalImages.unshift(cover);
      }

      if (editingId) {
        const { error: dbError } = await supabase.from('cars').update({ ...formData, images: finalImages }).eq('id', editingId);
        if (dbError) throw dbError;
        showToastMessage('Anúncio atualizado com sucesso!', 'success'); // MENSAGEM NOVA
      } else {
        const { error: dbError } = await supabase.from('cars').insert([{ ...formData, images: finalImages }]);
        if (dbError) throw dbError;
        showToastMessage('Novo anúncio publicado com sucesso!', 'success'); // MENSAGEM NOVA
      }

      cancelEdit();
      fetchExistingCars();

    } catch (error) {
      showToastMessage('Erro ao guardar anúncio: ' + error.message, 'error'); // MENSAGEM NOVA DE ERRO
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-neutral-900 p-8 rounded-xl border border-white/10 w-full max-w-md text-center">
          <h2 className="text-2xl text-white font-bold mb-4">Área Reservada</h2>
          <input type="password" placeholder="Código de Acesso" className="w-full bg-black border border-white/20 p-3 rounded text-white mb-4" onChange={(e) => setAccessCode(e.target.value)} />
          <button onClick={() => accessCode === import.meta.env.VITE_ADMIN_PASSWORD ? setIsAuthenticated(true) : alert('Código errado')} className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-3 rounded transition-colors">Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-12 px-4 relative overflow-x-hidden">
      
      {/* ================= TOAST NOTIFICATION (MENSAGEM ELEGANTE) ================= */}
      {toast.show && (
        <div className="fixed bottom-8 right-8 z-[200] animate-bounce">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border backdrop-blur-md text-white transition-all duration-300
            ${toast.type === 'success' ? 'bg-green-950/80 border-green-500/50' : 'bg-red-950/80 border-red-500/50'}`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="text-green-400" size={24} /> : <AlertCircle className="text-red-400" size={24} />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* ================= MODAL DE PREVIEW ================= */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          
          <div className="relative w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowPreview(false)} className="absolute -top-12 right-0 text-gray-400 hover:text-white flex items-center gap-2">
              <X size={20}/> Fechar Preview
            </button>
            
            <div className="bg-neutral-900 rounded-lg overflow-hidden border border-white/10 flex flex-col shadow-2xl">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute top-4 left-4 z-20">
                   <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-sm ${formData.tag === 'Reservado' || formData.tag === 'Vendido' ? 'bg-gray-600' : 'bg-brand-red'}`}>
                     {formData.tag}
                   </span>
                </div>
                <img src={getCoverImageUrl()} alt="Capa" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" />
              </div>

              <div className="p-6 flex flex-col flex-grow bg-neutral-900 relative z-20">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">{formData.make || 'Marca'} {formData.model || 'Modelo'}</h3>
                  <p className="text-brand-red font-medium text-sm truncate">{formData.version || formData.transmission || 'Versão / Caixa'}</p>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2"><Calendar size={16} className="text-brand-red" /><span>{formData.year || 'Ano'}</span></div>
                  <div className="flex items-center gap-2"><Gauge size={16} className="text-brand-red" /><span>{formData.mileage || 'Km'}</span></div>
                  <div className="flex items-center gap-2"><Fuel size={16} className="text-brand-red" /><span>{formData.fuel || 'Combust.'}</span></div>
                  <div className="flex items-center gap-2"><Zap size={16} className="text-brand-red" /><span>{formData.transmission || 'Caixa'}</span></div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Preço</p>
                    <p className="text-2xl font-bold text-white">{formData.price || '0€'}</p>
                  </div>
                  <div className="p-3 bg-brand-red rounded-full">
                    <ArrowRight size={20} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}


      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LADO ESQUERDO: Formulário */}
        <div className={`bg-neutral-900 p-8 rounded-2xl border ${editingId ? 'border-brand-red shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'border-white/10'} h-fit transition-all`}>
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h1 className="text-2xl font-bold text-white">
              {editingId ? '✏️ Editar Anúncio' : 'Adicionar Novo Carro'}
            </h1>
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowPreview(true)} className="text-gray-400 hover:text-brand-red flex items-center gap-1 text-sm font-medium transition-colors">
                <Eye size={18} /> Pré-visualizar
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm">
                  <XCircle size={18} /> Cancelar Edição
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="bg-black/50 p-6 rounded-xl border border-dashed border-white/20">
              <div className="flex justify-between items-end mb-4">
                <label className="block text-white font-bold">Galeria & Capa</label>
                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center gap-2 bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white px-3 py-1.5 rounded text-sm transition-colors font-medium">
                  <Upload size={16} /> Adicionar
                </label>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
              </div>
              <p className="text-xs text-gray-500 mb-4">Clica na ⭐ para definir a foto principal do anúncio.</p>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                {editImages.map((src, index) => (
                  <div key={`edit-${index}`} className={`relative aspect-square rounded overflow-hidden group border-2 ${coverIndex === index ? 'border-brand-red' : 'border-transparent'}`}>
                    <img src={src} alt="antiga" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center gap-2">
                      <button type="button" onClick={() => setCoverIndex(index)} className={`p-1.5 rounded-full ${coverIndex === index ? 'text-yellow-400' : 'text-white hover:text-yellow-400'}`} title="Definir como Capa">
                        <Star fill={coverIndex === index ? 'currentColor' : 'none'} size={18} />
                      </button>
                      <button type="button" onClick={() => removeEditImage(index)} className="p-1.5 text-white hover:text-red-500 rounded-full" title="Apagar Imagem">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    {coverIndex === index && <div className="absolute top-0 left-0 bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded-br">CAPA</div>}
                  </div>
                ))}

                {previews.map((src, index) => {
                  const globalIndex = editImages.length + index;
                  return (
                    <div key={`new-${index}`} className={`relative aspect-square rounded overflow-hidden group border-2 ${coverIndex === globalIndex ? 'border-brand-red' : 'border-transparent'}`}>
                      <img src={src} alt="nova" className="w-full h-full object-cover" />
                      <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl opacity-80">NOVA</div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center gap-2">
                        <button type="button" onClick={() => setCoverIndex(globalIndex)} className={`p-1.5 rounded-full ${coverIndex === globalIndex ? 'text-yellow-400' : 'text-white hover:text-yellow-400'}`} title="Definir como Capa">
                          <Star fill={coverIndex === globalIndex ? 'currentColor' : 'none'} size={18} />
                        </button>
                        <button type="button" onClick={() => removeNewImage(index)} className="p-1.5 text-white hover:text-red-500 rounded-full" title="Remover Nova">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {coverIndex === globalIndex && <div className="absolute top-0 left-0 bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded-br z-10">CAPA</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input name="make" placeholder="Marca (Ex: Porsche)" value={formData.make} onChange={handleInputChange} required className="bg-black border border-white/10 p-3 rounded text-white" />
              <input name="model" placeholder="Modelo (Ex: 911)" value={formData.model} onChange={handleInputChange} required className="bg-black border border-white/10 p-3 rounded text-white" />
              <input name="version" placeholder="Versão (Ex: Carrera S)" value={formData.version} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white" />
              <input name="price" placeholder="Preço (Ex: 140.000€)" value={formData.price} onChange={handleInputChange} required className="bg-black border border-white/10 p-3 rounded text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input name="year" placeholder="Ano" value={formData.year} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white" />
              <input name="mileage" placeholder="Km" value={formData.mileage} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white" />
              <select name="fuel" value={formData.fuel} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white">
                <option value="">Combustível</option>
                <option value="Gasolina">Gasolina</option>
                <option value="Diesel">Diesel</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Elétrico">Elétrico</option>
              </select>
              <input name="power" placeholder="Potência (cv)" value={formData.power} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white" />
              <input name="transmission" placeholder="Caixa" value={formData.transmission} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white" />
              <select name="tag" value={formData.tag} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white">
                <option value="Disponível">Disponível</option>
                <option value="Reservado">Reservado</option>
                <option value="Vendido">Vendido</option>
                <option value="Novo">Novo</option>
              </select>
            </div>

            <textarea name="description" placeholder="Descrição detalhada do veículo..." rows="4" value={formData.description} onChange={handleInputChange} className="w-full bg-black border border-white/10 p-3 rounded text-white"></textarea>

            <button type="submit" disabled={loading} className={`w-full text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 ${editingId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-brand-red hover:bg-red-700'}`}>
              {loading ? "A processar..." : (editingId ? "Atualizar Anúncio" : "Publicar Anúncio")}
              {!loading && (editingId ? <Edit2 size={20} /> : <Plus size={20} />)}
            </button>
          </form>
        </div>

        {/* LADO DIREITO: Gerir Stock Atual */}
        <div className="bg-neutral-900 p-8 rounded-2xl border border-white/10 h-fit">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Gerir Stock Atual</h2>
          
          {loadingCars ? (
            <p className="text-gray-400">A carregar stock...</p>
          ) : existingCars.length === 0 ? (
            <p className="text-gray-400">Não há carros em stock de momento.</p>
          ) : (
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {existingCars.map((car) => (
                <div key={car.id} className={`bg-black p-4 rounded-xl border flex items-center justify-between group transition-colors ${editingId === car.id ? 'border-brand-red' : 'border-white/10'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-neutral-800 rounded overflow-hidden">
                      <img src={car.images && car.images.length > 0 ? car.images[0] : '/placeholder.jpg'} alt={car.model} className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm sm:text-base">{car.make} {car.model}</p>
                      <div className="flex gap-2 text-xs text-gray-500">
                        <span>{car.price}</span> • 
                        <span className={car.tag === 'Disponível' ? 'text-green-500' : car.tag === 'Vendido' ? 'text-red-500' : 'text-orange-500'}>{car.tag}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={() => handleEditClick(car)} className={`p-2 rounded transition-colors ${editingId === car.id ? 'text-brand-red bg-red-500/10' : 'text-gray-500 hover:text-orange-400 hover:bg-orange-500/10'}`} title="Editar Anúncio">
                      <Edit2 size={20} />
                    </button>
                    <button onClick={() => handleDeleteCar(car.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Apagar Anúncio">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Admin;