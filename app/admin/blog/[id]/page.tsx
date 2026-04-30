'use client';

import { useState, useEffect, use } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function AdminBlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const isNew = id === 'new';
  const router = useRouter();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    tag: '',
    excerpt: '',
    content: '',
    readTime: 5,
    date: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
    image: ''
  });

  useEffect(() => {
    if (isNew) return;
    const fetchPost = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'blog', id));
        if (docSnap.exists()) {
          setFormData(docSnap.data() as any);
        }
      } catch (error) {
        console.error('Error fetching blog post', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSmartSlug = () => {
    const generated = formData.title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, slug: generated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const targetSlug = isNew ? formData.slug : id;
      await setDoc(doc(db, 'blog', targetSlug), formData);
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error saving', error);
      alert('Error sincronizando con la base de datos');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500 font-sans text-sm p-10">Cargando Ensayo...</p>;

  return (
    <div className="max-w-4xl font-sans">
      <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-6">
        <Link href="/admin/blog" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors border border-gray-200 rounded px-3 py-1">← Volver</Link>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          {isNew ? 'Nueva Noticia / Editorial' : 'Editar Editorial'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
         <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 space-y-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-100 pb-4">Metadatos Centrales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Titular</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Slug (URL)
                        {isNew && <button type="button" onClick={handleSmartSlug} className="ml-4 text-indigo-600 hover:text-indigo-800 transition-colors">Generar auto</button>}
                    </label>
                    <input type="text" name="slug" value={formData.slug} onChange={handleChange} required disabled={!isNew} className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:border-indigo-500 outline-none disabled:bg-gray-50" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Etiqueta de Clasificación</label>
                    <input type="text" name="tag" value={formData.tag} onChange={handleChange} required placeholder="Ej: Entrevista, Archivo..." className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:border-indigo-500 outline-none" />
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Extracto Corto</label>
                <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} required rows={3} className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:border-indigo-500 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Tiempo Lectura Est. (Minutos)</label>
                    <input type="number" name="readTime" value={formData.readTime} onChange={handleChange} required min="1" className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Fecha</label>
                    <input type="text" name="date" value={formData.date} onChange={handleChange} required className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:border-indigo-500 outline-none" />
                </div>
            </div>
         </div>

         <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
             <h2 className="text-lg font-medium text-gray-900 mb-6 border-b border-gray-100 pb-4">Activos y Contenido</h2>
             <div className="mb-8 w-full md:w-2/3 border border-gray-200 p-4 rounded bg-gray-50">
                 <ImageUpload
                    label="Imagen Principal"
                    folder="blog"
                    value={formData.image}
                    onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                 />
             </div>
             
             <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex justify-between">
                    <span>Contenido principal (HTML Crudo soportado)</span>
                </label>
                <textarea 
                  name="content" 
                  value={formData.content} 
                  onChange={handleChange} 
                  required 
                  rows={20} 
                  className="w-full border border-gray-200 rounded p-4 text-sm font-mono focus:border-indigo-500 outline-none" 
                />
             </div>
         </div>

         <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-indigo-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Artículo'}
            </button>
         </div>
      </form>
    </div>
  );
}
