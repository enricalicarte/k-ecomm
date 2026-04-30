"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Updated allowed list or logic can go here. For now we just authorize.
        setUser(currentUser);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-70px)] bg-bone">
        <p className="text-charcoal/50 text-[10px] uppercase font-mono tracking-[0.2em] blink">
          Authenticating...
        </p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="flex-grow flex flex-col md:flex-row min-h-[calc(100vh-70px)] bg-gray-50">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col shrink-0 shadow-sm z-20 sticky top-[70px] md:static">
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-100">
          <div>
            <h2 className="font-sans text-lg md:text-xl font-semibold text-gray-900 tracking-tight">
              Kauai Workspace
            </h2>
            <p className="hidden md:block text-xs font-sans tracking-tight text-gray-500 mt-1 truncate">
              {user.email}
            </p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="md:hidden text-xs font-sans tracking-wide text-red-600 hover:text-red-700 transition-colors font-medium flex items-center gap-1"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Salir
          </button>
        </div>
        <nav className="flex-none md:flex-1 py-1 md:py-4 flex flex-row md:flex-col font-sans text-sm tracking-wide overflow-x-auto md:overflow-x-visible hide-scrollbar border-b md:border-b-0 border-gray-100">
          <Link
            href="/admin"
            className={`whitespace-nowrap px-4 py-3 md:px-6 transition-colors ${pathname === "/admin" ? "text-indigo-700 font-medium md:bg-indigo-50 md:border-r-4 border-b-2 md:border-b-0 border-indigo-700" : "text-gray-600 hover:text-gray-900 md:hover:bg-gray-50 border-b-2 md:border-b-0 border-transparent"}`}
          >
            Catálogo
          </Link>
          <Link
            href="/admin/categories"
            className={`whitespace-nowrap px-4 py-3 md:px-6 transition-colors ${pathname.startsWith("/admin/categories") ? "text-indigo-700 font-medium md:bg-indigo-50 md:border-r-4 border-b-2 md:border-b-0 border-indigo-700" : "text-gray-600 hover:text-gray-900 md:hover:bg-gray-50 border-b-2 md:border-b-0 border-transparent"}`}
          >
            Categorías
          </Link>
          <Link
            href="/admin/pages"
            className={`whitespace-nowrap px-4 py-3 md:px-6 transition-colors ${pathname.startsWith("/admin/pages") ? "text-indigo-700 font-medium md:bg-indigo-50 md:border-r-4 border-b-2 md:border-b-0 border-indigo-700" : "text-gray-600 hover:text-gray-900 md:hover:bg-gray-50 border-b-2 md:border-b-0 border-transparent"}`}
          >
            Páginas y Textos
          </Link>
          <Link
            href="/admin/blog"
            className={`whitespace-nowrap px-4 py-3 md:px-6 transition-colors ${pathname.startsWith("/admin/blog") ? "text-indigo-700 font-medium md:bg-indigo-50 md:border-r-4 border-b-2 md:border-b-0 border-indigo-700" : "text-gray-600 hover:text-gray-900 md:hover:bg-gray-50 border-b-2 md:border-b-0 border-transparent"}`}
          >
            Gazette
          </Link>
          <Link
            href="/admin/marcas"
            className={`whitespace-nowrap px-4 py-3 md:px-6 transition-colors ${pathname.startsWith("/admin/marcas") ? "text-indigo-700 font-medium md:bg-indigo-50 md:border-r-4 border-b-2 md:border-b-0 border-indigo-700" : "text-gray-600 hover:text-gray-900 md:hover:bg-gray-50 border-b-2 md:border-b-0 border-transparent"}`}
          >
            Diseñadores
          </Link>
          <Link
            href="/admin/carousels"
            className={`whitespace-nowrap px-4 py-3 md:px-6 transition-colors ${pathname.startsWith("/admin/carousels") ? "text-indigo-700 font-medium md:bg-indigo-50 md:border-r-4 border-b-2 md:border-b-0 border-indigo-700" : "text-gray-600 hover:text-gray-900 md:hover:bg-gray-50 border-b-2 md:border-b-0 border-transparent"}`}
          >
            Carruseles
          </Link>
          <Link
            href="/admin/analytics"
            className={`whitespace-nowrap px-4 py-3 md:px-6 transition-colors ${pathname.startsWith("/admin/analytics") ? "text-indigo-700 font-medium md:bg-indigo-50 md:border-r-4 border-b-2 md:border-b-0 border-indigo-700" : "text-gray-600 hover:text-gray-900 md:hover:bg-gray-50 border-b-2 md:border-b-0 border-transparent"}`}
          >
            Analíticas
          </Link>
          <Link
            href="/admin/ventas"
            className={`whitespace-nowrap px-4 py-3 md:px-6 transition-colors ${pathname.startsWith("/admin/ventas") ? "text-indigo-700 font-medium md:bg-indigo-50 md:border-r-4 border-b-2 md:border-b-0 border-indigo-700" : "text-gray-600 hover:text-gray-900 md:hover:bg-gray-50 border-b-2 md:border-b-0 border-transparent"}`}
          >
            Transacciones
          </Link>
          <Link
            href="/admin/settings"
            className={`whitespace-nowrap px-4 py-3 md:px-6 transition-colors ${pathname.startsWith("/admin/settings") ? "text-indigo-700 font-medium md:bg-indigo-50 md:border-r-4 border-b-2 md:border-b-0 border-indigo-700" : "text-gray-600 hover:text-gray-900 md:hover:bg-gray-50 border-b-2 md:border-b-0 border-transparent"}`}
          >
            Configuración
          </Link>
        </nav>
        <div className="hidden md:block p-6 border-t border-gray-100 mt-auto bg-gray-50">
          <button
            onClick={() => signOut(auth)}
            className="text-sm font-sans tracking-wide text-red-600 hover:text-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 p-6 md:p-12 overflow-x-auto bg-gray-50/50 relative">
        <div className="max-w-6xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
