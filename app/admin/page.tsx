'use client';

import { useEffect, useState, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, setDoc, writeBatch } from 'firebase/firestore';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const prods: any[] = [];
      querySnapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() });
      });
      setProducts(prods);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar permanentemente "${name}"?`)) {
      try {
        await deleteDoc(doc(db, 'products', id));
        setProducts(products.filter(p => p.id !== id));
        if (selected.has(id)) {
            const newSel = new Set(selected);
            newSel.delete(id);
            setSelected(newSel);
        }
      } catch (error) {
        console.error('Error deleting product', error);
        alert('Error eliminando producto');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar permanentemente los ${selected.size} elementos seleccionados?`)) return;
    setLoading(true);
    try {
      const batch = writeBatch(db);
      selected.forEach(id => {
        batch.delete(doc(db, 'products', id));
      });
      await batch.commit();
      setProducts(products.filter(p => !selected.has(p.id)));
      setSelected(new Set());
    } catch (error) {
      console.error('Bulk deletion error', error);
      alert('Error realizando borrado masivo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        // Basic parser for CSV
        const delimiter = text.indexOf(';') > -1 ? ';' : (text.indexOf('\t') > -1 ? '\t' : ',');
        const rows = text.split('\n').filter(r => r.trim().length > 0);
        
        let headers: string[] = [];
        const productsMap = new Map();

        // Create mappings to find existing products
        const existingMap = new Map<string, string>();
        products.forEach(p => {
             existingMap.set(p.id, p.id);
             if (p.codigoProducto) existingMap.set(String(p.codigoProducto).trim().toLowerCase(), p.id);
             if (p.slug) existingMap.set(p.slug.toLowerCase(), p.id);
        });

        const splitRow = (rowStr: string) => {
            const result = [];
            let current = '';
            let inQuotes = false;
            for(let i=0; i<rowStr.length; i++) {
                const char = rowStr[i];
                if(char === '"') { inQuotes = !inQuotes; }
                else if(char === delimiter && !inQuotes) { result.push(current); current = ''; }
                else { current += char; }
            }
            result.push(current);
            return result.map(s => s.trim());
        };

        rows.forEach((rowStr, rowIndex) => {
            const cols = splitRow(rowStr);
            if(rowIndex === 0) {
                headers = cols.map(h => h.replace(/^"|"$/g, '').trim());
                return;
            }
            const rowData: Record<string, string> = {};
            headers.forEach((h, i) => { rowData[h] = cols[i] ? cols[i].replace(/^"|"$/g, '') : ''; });
            
            const name = rowData['Nombre Artículo'] || rowData['Nombre'] || rowData['name'];
            const brand = rowData['MARCA'] || rowData['Marca'] || rowData['marca'] || rowData['brand'];
            const talla = rowData['TALLA'] || rowData['Talla'] || rowData['talla'] || rowData['size'];
            const referencia = rowData['Referencia'] || rowData['referencia'];
            const codigoProducto = rowData['Código Producto'] || rowData['Codigo Producto'] || rowData['Codigo'] || rowData['codigo'];
            const price = rowData['Precio'] || rowData['precio'] || rowData['Price'] || '0';
            
            if(!name) return;
            
            const slug = `${brand}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            
            // Try to find an existing ID matching referral, code or slug
            let primaryKey = '';
            if (referencia && existingMap.has(String(referencia).trim().toLowerCase())) {
                primaryKey = existingMap.get(String(referencia).trim().toLowerCase())!;
            } else if (codigoProducto && existingMap.has(String(codigoProducto).trim().toLowerCase())) {
                primaryKey = existingMap.get(String(codigoProducto).trim().toLowerCase())!;
            } else if (existingMap.has(slug)) {
                primaryKey = existingMap.get(slug)!;
            } else {
                primaryKey = referencia ? String(referencia).trim() : slug;
            }
            
            if(!productsMap.has(primaryKey)) {
               // Obtenemos tallas previas si existen
               let prevSizes = new Set<string>();
               const existingProd = products.find(p => p.id === primaryKey);
               if (existingProd && existingProd.sizes) {
                   try {
                       const parsed = JSON.parse(existingProd.sizes);
                       if (Array.isArray(parsed)) parsed.forEach(s => prevSizes.add(String(s)));
                   } catch(e) {}
               }

               productsMap.set(primaryKey, {
                   name,
                   brand: brand || '',
                   slug, // Guardamos el slug de todas formas para la URL
                   price: parseFloat(price.replace(',', '.')) || parseFloat(price) || 0,
                   category: rowData['Familia'] || rowData['familia'] || '',
                   subfamily: rowData['Subfamilia'] || rowData['subfamilia'] || '',
                   codigoProducto: codigoProducto ? String(codigoProducto).trim() : '',
                   sizes: prevSizes,
                   description: referencia ? `Ref: ${referencia}` : '',
               });
            }
            if (talla) {
                productsMap.get(primaryKey).sizes.add(talla.toString().trim());
            }
        });

        const batch = writeBatch(db);
        let count = 0;
        for (const [pk, prod] of productsMap.entries()) {
            batch.set(doc(db, 'products', pk), {
                ...prod,
                sizes: JSON.stringify(Array.from(prod.sizes))
            }, { merge: true }); 
            count++;
        }
        await batch.commit();
        
        alert(`Success: Imported/Updated ${count} unique elements.`);
        fetchProducts(); 
      } catch (err) {
        console.error(err);
        alert('An error occurred during parsing.');
      } finally {
        if (e.target) e.target.value = '';
      }
    };
    reader.onerror = () => {
      alert("File read error.");
      setLoading(false);
    }
    reader.readAsText(file);
  };

  const brandsFilter = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  if (loading) return <p className="text-charcoal/50 text-[10px] uppercase font-mono tracking-[0.2em] blink">Loading Catalog...</p>;

  return (
    <div className="font-sans">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 font-sans tracking-tight">Gestión del Catálogo</h1>
          <p className="text-sm text-gray-500 mt-2">Administra tu repositorio global de prendas.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
             type="file" 
             accept=".csv" 
             className="hidden" 
             ref={fileInputRef} 
             onChange={handleCSVUpload} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white text-gray-700 border border-gray-300 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm"
          >
            Importar CSV
          </button>
          <Link 
            href="/admin/products/new" 
            className="bg-indigo-600 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
          >
            + Añadir Producto
          </Link>
        </div>
      </div>

      <div className="flex gap-4 items-center justify-between mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
         <div className="flex items-center gap-4 text-sm text-gray-600">
           <span className="font-medium text-gray-900">Seleccionar:</span>
           <button onClick={() => setSelected(new Set(products.map(p => p.id)))} className="hover:text-indigo-600 font-medium">Todos</button>
           <button onClick={() => setSelected(new Set())} className="hover:text-indigo-600 font-medium">Ninguno</button>
           <select 
             className="ml-4 bg-transparent border-gray-300 border-b pb-1 text-gray-700 focus:outline-none focus:border-indigo-500"
             onChange={(e) => {
               if(!e.target.value) return;
               const newSel = new Set(selected);
               products.filter(p => p.brand === e.target.value).forEach(p => newSel.add(p.id));
               setSelected(newSel);
               e.target.value = '';
             }}
           >
              <option value="">+ Por Diseñador...</option>
              {brandsFilter.map(b => (
                 <option key={b as string} value={b as string}>{b as string}</option>
              ))}
           </select>
         </div>

         {selected.size > 0 && (
            <div className="flex items-center gap-4 animate-in fade-in zoom-in duration-200">
               <span className="text-sm font-medium text-gray-700">{selected.size} seleccionados</span>
               <button 
                 onClick={handleBulkDelete}
                 className="bg-red-50 text-red-600 px-4 py-2 text-sm font-medium rounded-md hover:bg-red-100 transition-colors"
               >
                 Eliminar Selección
               </button>
            </div>
         )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="accent-indigo-600 w-4 h-4 rounded text-indigo-600 rounded"
                    checked={selected.size === products.length && products.length > 0} 
                    onChange={(e) => {
                       if(e.target.checked) setSelected(new Set(products.map(p => p.id)));
                       else setSelected(new Set());
                    }} 
                  />
                </th>
                <th className="px-6 py-4">Prenda</th>
                <th className="px-6 py-4">Diseñador</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                    El catálogo está actualmente vacío.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${selected.has(product.id) ? 'bg-indigo-50/50' : ''}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox"
                        className="accent-indigo-600 w-4 h-4 rounded text-indigo-600"
                        checked={selected.has(product.id)}
                        onChange={(e) => {
                           const newSel = new Set(selected);
                           if (e.target.checked) newSel.add(product.id);
                           else newSel.delete(product.id);
                           setSelected(newSel);
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-4">
                      {product.image ? (
                        <div className="w-12 h-12 aspect-square bg-gray-100 bg-cover bg-center shrink-0 rounded" style={{ backgroundImage: `url(${product.image})` }}></div>
                      ) : (
                        <div className="w-12 h-12 aspect-square bg-gray-100 shrink-0 rounded flex items-center justify-center text-gray-400">
                            No img
                        </div>
                      )}
                      <div className="flex flex-col border-l border-gray-200 pl-4">
                        <span className="truncate max-w-[200px] text-gray-900">{product.name}</span>
                        <span className="text-xs text-gray-500 font-mono mt-1">ID: {product.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.brand}</td>
                    <td className="px-6 py-4 text-gray-600">{Number(product.price || 0).toFixed(2)} €</td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/products/${product.id}`}
                        className="text-indigo-600 hover:text-indigo-900 font-medium mr-4"
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
