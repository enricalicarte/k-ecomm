'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import Link from 'next/link';
import seedData from '@/data/seed-data.json';
import { Loader2 } from 'lucide-react';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'blog'));
      const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(fetched);
    } catch (error) {
      console.error('Error fetching blog posts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts();
  }, []);

  const handleDelete = async (id: string, title?: string) => {
    if (!confirm(`¿Eliminar permanentemente "${title || id}"?`)) return;
    try {
      await deleteDoc(doc(db, 'blog', id));
      fetchPosts();
    } catch (error) {
      alert('Error eliminando documento');
    }
  };

  const handleMigrate = async () => {
    if (!confirm('¿Importar editoriales de prueba en la base de datos en vivo?')) return;
    setLoading(true);
    try {
      const batch = writeBatch(db);
      for (const post of seedData.posts) {
        const docRef = doc(db, 'blog', post.slug);
        batch.set(docRef, {
            title: post.title,
            slug: post.slug,
            tag: post.tag,
            excerpt: post.excerpt,
            content: post.content,
            readTime: post.readTime || 5,
            date: post.date || new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
            image: post.image || '',
            createdAt: new Date().toISOString()
        });
      }
      await batch.commit();
      fetchPosts();
    } catch (error) {
       console.error(error);
       alert('Error iniciando importación');
    } finally {
       setLoading(false);
    }
  };

  if (loading) {
      return (
          <div className="flex items-center justify-center h-64 bg-white/50 rounded-lg">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
      );
  }

  return (
    <div className="font-sans">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 font-sans tracking-tight">Editoriales</h1>
          <p className="text-sm text-gray-500 mt-2">Gestiona artículos y publicaciones del blog.</p>
        </div>
        <div className="flex items-center gap-3">
          {posts.length === 0 && (
             <button onClick={handleMigrate} className="bg-white text-gray-700 border border-gray-300 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm">
               Inyectar Datos Base
             </button>
          )}
          <Link href="/admin/blog/new" className="bg-indigo-600 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm">
            + Añadir Post
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4">Titular</th>
                        <th className="px-6 py-4">Categoría</th>
                        <th className="px-6 py-4">Fecha</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                      {posts.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                            El archivo editorial está vacío.
                          </td>
                        </tr>
                      ) : (
                        posts.map(post => (
                            <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                               <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                               <td className="px-6 py-4">
                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                       {post.tag}
                                   </span>
                               </td>
                               <td className="px-6 py-4 text-gray-600">{post.date}</td>
                               <td className="px-6 py-4 text-right">
                                   <Link href={`/admin/blog/${post.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium mr-4">Editar</Link>
                                   <button onClick={() => handleDelete(post.id, post.title)} className="text-red-600 hover:text-red-900 font-medium">Eliminar</button>
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
