'use client';
import { usePathname } from 'next/navigation';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  
  // No pt-20 to avoid blank space under the transparent header.
  // The content will start exactly at the top of the screen.
  return (
    <div className={`flex-grow flex flex-col relative z-10`}>
      {children}
    </div>
  );
}
