'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPagesList() {
    const pages = [
        { id: 'home', name: 'Home (Inicio)' },
        { id: 'shop', name: 'Catálogo / Tienda' },
        { id: 'lookbook', name: 'Lookbook' },
        { id: 'sobre', name: 'Sobre Nosotros' },
        { id: 'blog', name: 'Gazette (Blog)' }
    ];

    return (
        <div className="font-sans">
            <div className="mb-8 pb-6 border-b border-gray-200">
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Constructor de Páginas</h1>
                <p className="text-sm text-gray-500 mt-2">Gestiona los módulos y el diseño de cada página de la tienda.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {pages.map(page => (
                        <div key={page.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div>
                                <h3 className="font-medium text-gray-900">{page.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">/{page.id === 'home' ? '' : page.id}</p>
                            </div>
                            <Link href={`/admin/pages/${page.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm border border-indigo-200 px-4 py-2 rounded-md hover:bg-indigo-50">
                                Editar Diseño
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
