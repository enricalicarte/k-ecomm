'use client';

import { useState, useEffect, use } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

type Props = {
  params: Promise<{ id: string }>;
};

export default function ProductEditorPage({ params }: Props) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const isNew = id === 'new';
  const router = useRouter();
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    brand: '',
    price: 0,
    category: '',
    subfamily: '',
    description: '',
    codigoProducto: '',
    sizes: '[]',
    images: [] as string[],
  });

  useEffect(() => {
    if (!isNew) {
      const fetchDoc = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'products', id));
          if (docSnap.exists()) {
            const data = docSnap.data();
            let loadedImages = data.images || [];
            if (loadedImages.length === 0 && data.image) {
                loadedImages = [data.image]; // migration for old products
            }
            setFormData({
              name: data.name || '',
              slug: data.slug || id,
              brand: data.brand || '',
              price: data.price || 0,
              category: data.category || '',
              subfamily: data.subfamily || '',
              description: data.description || '',
              codigoProducto: data.codigoProducto || '',
              sizes: data.sizes || '[]',
              images: loadedImages,
            });
          } else {
            alert('Prenda no encontrada.');
            router.push('/admin');
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchDoc();
    }
  }, [isNew, id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const addImage = () => {
      setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const updateImage = (index: number, url: string) => {
      setFormData(prev => {
          const newImages = [...prev.images];
          newImages[index] = url;
          return { ...prev, images: newImages };
      });
  };

  const removeImage = (index: number) => {
      setFormData(prev => {
          const newImages = [...prev.images];
          newImages.splice(index, 1);
          return { ...prev, images: newImages };
      });
  };

  const generateSlug = (name: string, brand: string) => {
    return `${brand}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleSmartSlug = () => {
    if (formData.name && formData.brand) {
      setFormData(prev => ({ ...prev, slug: generateSlug(prev.name, prev.brand) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const targetSlug = formData.slug || generateSlug(formData.name, formData.brand);
      // Filter out empty images
      const validImages = formData.images.filter(img => img.trim() !== '');
      
      const payload = {
        name: formData.name,
        slug: targetSlug,
        brand: formData.brand,
        price: formData.price,
        category: formData.category,
        subfamily: formData.subfamily,
        description: formData.description,
        codigoProducto: formData.codigoProducto,
        sizes: formData.sizes, // Storing as JSON string to mirror seed structure
        images: validImages,
        image: validImages.length > 0 ? validImages[0] : '', // backwards compatibility
      };

      if (isNew) {
        // Use slug as doc ID
        await setDoc(doc(db, 'products', targetSlug), payload);
      } else {
        await updateDoc(doc(db, 'products', id), payload);
      }
      
      router.push('/admin');
    } catch (error) {
      console.error('Error saving', error);
      alert('Error guardando la prenda.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500 text-sm font-sans">Cargando Datos...</p>;

  return (
    <div className="max-w-4xl font-sans">
      <div className="flex items-center gap-6 mb-8 border-b border-gray-200 pb-6">
        <Link href="/admin" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">← Volver</Link>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          {isNew ? 'Registrar Prenda' : 'Modificar Prenda'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Diseñador / Marca</label>
            <input 
              type="text" 
              name="brand" 
              value={formData.brand} 
              onChange={handleChange} 
              required
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Prenda</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
              <span>Slug del Sistema / Referencia</span>
              {isNew && <button type="button" onClick={handleSmartSlug} className="text-indigo-600 hover:text-indigo-700 text-xs">Auto-Gen</button>}
            </label>
            <input 
              type="text" 
              name="slug" 
              value={formData.slug} 
              onChange={handleChange} 
              required={isNew}
              disabled={!isNew} 
              className="w-full border border-gray-300 rounded-md p-3 text-sm bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Código de Producto (EAN/SKU)</label>
            <input 
              type="text" 
              name="codigoProducto" 
              value={formData.codigoProducto} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Precio (EUR)</label>
            <input 
              type="number" 
              name="price" 
              step="0.01"
              value={formData.price} 
              onChange={handleChange} 
              required
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <input 
              type="text" 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub-familia</label>
            <input 
              type="text" 
              name="subfamily" 
              value={formData.subfamily} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" 
            />
          </div>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-4 border-b border-gray-100 pb-2">Fotografía de Archivo</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
             {formData.images.map((imgUrl, index) => (
                <div key={index} className="relative bg-gray-50 p-4 rounded-md border border-gray-200">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest">SEC {index + 1} {index === 0 && '[HERO]'}</span>
                      <button 
                         type="button" 
                         onClick={() => removeImage(index)}
                         className="text-xs text-red-600 font-medium hover:text-red-700 transition-colors"
                      >
                         Descartar
                      </button>
                   </div>
                   <ImageUpload
                     label=""
                     folder="products"
                     value={imgUrl}
                     onChange={url => updateImage(index, url)}
                   />
                </div>
             ))}
          </div>
          <button 
             type="button"
             onClick={addImage}
             className="px-6 py-4 border border-dashed border-gray-300 rounded-md text-gray-600 text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors w-full"
          >
             + Añadir Imagen a la Secuencia
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tallas Disponibles (Formato Array)</label>
          <input 
            type="text" 
            name="sizes" 
            value={formData.sizes} 
            onChange={handleChange} 
            placeholder="[&#39;S&#39;, &#39;M&#39;, &#39;L&#39;]"
            className="w-full border border-gray-300 rounded-md p-3 font-mono text-xs focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" 
          />
          <p className="text-xs text-gray-500 mt-2">Formato requerido: JS String Array (ej. [&#39;40&#39;, &#39;41&#39;, &#39;42&#39;])</p>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Editorial (Opcional)</label>
           <textarea 
             name="description" 
             value={formData.description} 
             onChange={handleChange}
             rows={6}
             className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" 
           ></textarea>
        </div>

        <div className="pt-8 border-t border-gray-200 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-indigo-600 text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
          >
            {saving ? 'Guardando...' : 'Guardar Artículo'}
          </button>
        </div>
      </form>
    </div>
  );
}
