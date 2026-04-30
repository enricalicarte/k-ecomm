'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

type Carousel = {
  id: string;
  title: string;
  type: 'products' | 'brands' | 'blog';
  source: 'latest' | 'category' | 'featured' | 'manual';
  filterValue: string;
  manualItems?: string[];
  placement: 'home' | 'tienda';
  order: number;
  autoScroll?: boolean;
};

export default function AdminCarouselsPage() {
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Partial<Carousel>>({});
  const [products, setProducts] = useState<any[]>([]);

  const fetchCarousels = async () => {
    setLoading(true);
    const qs = await getDocs(collection(db, 'carousels'));
    const data: Carousel[] = [];
    qs.forEach(doc => data.push({ id: doc.id, ...doc.data() } as Carousel));
    data.sort((a, b) => (a.order || 0) - (b.order || 0));
    setCarousels(data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCarousels();
    const fetchProducts = async () => {
      const qs = await getDocs(collection(db, 'products'));
      const prods: any[] = [];
      qs.forEach(doc => prods.push({ id: doc.id, ...doc.data() }));
      setProducts(prods);
    };
    fetchProducts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current.title || !current.type) return alert("Título y tipo son OBLIGATORIOS.");

    const id = current.id || `car_${Date.now()}`;
    
    await setDoc(doc(db, 'carousels', id), {
      ...current,
      id: id,
      order: current.order || carousels.length
    });
    
    setIsEditing(false);
    fetchCarousels();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Seguro que quieres eliminar este módulo? Será removido de la interfaz pública.")) {
      await deleteDoc(doc(db, 'carousels', id));
      fetchCarousels();
    }
  };

  const openNew = () => {
    setCurrent({
      title: '', type: 'products', source: 'latest', filterValue: '', placement: 'home', order: carousels.length
    });
    setIsEditing(true);
  };

  if (loading) return <p className="text-gray-500 p-10 font-sans text-sm">Cargando Módulos...</p>;

  return (
    <div className="max-w-4xl font-sans">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Módulos Dinámicos</h1>
          <p className="text-sm text-gray-500 mt-1">Inyecta carruseles dinámicos a la interfaz.</p>
        </div>
        <button onClick={openNew} className="bg-indigo-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2">
          <Plus size={16} /> Inicializar Módulo
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 relative shadow-sm">
          <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
          <h2 className="text-xl font-medium text-gray-900 mb-6">{current.id ? 'Modificar Módulo' : 'Nuevo Módulo'}</h2>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Título del Módulo</label>
                <input required type="text" placeholder="ej. Lanzamientos" value={current.title || ''} onChange={e => setCurrent({...current, title: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Ubicación</label>
                <select value={current.placement || 'home'} onChange={e => setCurrent({...current, placement: e.target.value as any})} className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none">
                  <option value="home">Inicio (Página Principal)</option>
                  <option value="tienda">Catálogo</option>
                </select>
              </div>

              <div>
                 <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Entidad a mostrar</label>
                 <select value={current.type || 'products'} onChange={e => setCurrent({...current, type: e.target.value as any})} className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none">
                    <option value="products">Prendas / Productos</option>
                    <option value="brands">Diseñadores</option>
                    <option value="blog">Editoriales</option>
                 </select>
              </div>

              <div>
                 <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Motor de Reglas</label>
                 <select value={current.source || 'latest'} onChange={e => setCurrent({...current, source: e.target.value as any})} className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none">
                    <option value="latest">Agregados Recientes</option>
                    {current.type === 'products' && <option value="category">Filtro de Categoría</option>}
                    {current.type === 'products' && <option value="manual">Selección Manual</option>}
                    {(current.type === 'brands' || current.type === 'blog') && <option value="featured">Marcados como Destacados</option>}
                 </select>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <input type="checkbox" id="autoScroll" checked={current.autoScroll || false} onChange={e => setCurrent({...current, autoScroll: e.target.checked})} className="w-4 h-4 accent-indigo-600 rounded" />
              <label htmlFor="autoScroll" className="text-sm font-medium text-gray-700 cursor-pointer">Desplazamiento Automático (Auto-Scroll)</label>
            </div>

            {current.source === 'category' && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-6">
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Filtro de Categoría (Coincidencia Exacta)</label>
                <input type="text" placeholder="ej. Ropa Exterior" value={current.filterValue || ''} onChange={e => setCurrent({...current, filterValue: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                <p className="text-xs text-gray-500 mt-2">Escribe la categoría exacta (o substring parcial) para hacer los queries.</p>
              </div>
            )}

            {current.source === 'manual' && current.type === 'products' && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-6">
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-4">Selección de Productos</label>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {products.map(p => {
                    const isSelected = (current.manualItems || []).includes(p.id);
                    return (
                      <label key={p.id} className={`flex items-center p-3 border rounded cursor-pointer hover:bg-white transition-colors ${isSelected ? 'border-indigo-500 bg-white' : 'border-gray-200'}`}>
                        <input 
                          type="checkbox" 
                          className="mr-3 accent-indigo-600 w-4 h-4 rounded"
                          checked={isSelected}
                          onChange={(e) => {
                            const currentItems = current.manualItems || [];
                            if (e.target.checked) {
                              setCurrent({ ...current, manualItems: [...currentItems, p.id] });
                            } else {
                              setCurrent({ ...current, manualItems: currentItems.filter(id => id !== p.id) });
                            }
                          }}
                        />
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-medium text-gray-900 truncate">{p.name || 'Sin Título'}</p>
                          <p className="text-xs text-gray-500 mt-1">{p.category || 'Sin Categoría'}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-4">Selecciona los productos específicos que aparecerán en este bloque.</p>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded transition">Cancelar</button>
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded text-sm hover:bg-indigo-700 transition">Guardar Módulo</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-100 text-gray-600 p-4 grid grid-cols-12 gap-4 rounded-t-md font-medium text-sm">
             <div className="col-span-2">Destino</div>
             <div className="col-span-4">Título</div>
             <div className="col-span-2">Entidad</div>
             <div className="col-span-3">Motor de Reglas</div>
          </div>
          <div className="bg-white rounded-b-md border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-200">
          {carousels.map(carousel => (
            <div key={carousel.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
               <div className="col-span-2">
                 <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${carousel.placement === 'home' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                   {carousel.placement}
                 </span>
               </div>
               <div className="col-span-4 font-medium text-gray-900">{carousel.title}</div>
               <div className="col-span-2 text-sm text-gray-500">{carousel.type}</div>
               <div className="col-span-3 text-sm text-gray-500">
                 {carousel.source} <span className="text-gray-900 font-medium">{carousel.filterValue ? `[${carousel.filterValue}]` : ''}</span>
               </div>
               <div className="col-span-1 flex justify-end gap-3 transition-opacity">
                 <button onClick={() => { setCurrent(carousel); setIsEditing(true); }} className="text-indigo-600 hover:text-indigo-800">
                   <Edit2 size={16} />
                 </button>
                 <button onClick={() => handleDelete(carousel.id)} className="text-red-500 hover:text-red-700">
                   <Trash2 size={16} />
                 </button>
               </div>
            </div>
          ))}
          </div>
          {carousels.length === 0 && (
            <div className="text-center py-24 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-900 font-medium mb-1">No hay módulos dinámicos activos</p>
                <p className="text-sm text-gray-500">Inicializa un módulo para generar feeds de contenido en la interfaz pública.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
