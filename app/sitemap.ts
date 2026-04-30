import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kauai-archive.kauai.es';

  // Base static routes
  const routes = [
    '',
    '/catalog',
    '/about',
    '/blog',
    '/designers'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch Products
  const productsQuery = query(collection(db, 'products'));
  const productsSnapshot = await getDocs(productsQuery);
  const productRoutes = productsSnapshot.docs.map((doc) => {
    const p = doc.data();
    return {
      url: `${baseUrl}/producto/${p.slug || doc.id}`, // using PDP root path as implemented
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  });

  // Fetch Blog Posts
  const blogQuery = query(collection(db, 'blog'));
  const blogSnapshot = await getDocs(blogQuery);
  const blogRoutes = blogSnapshot.docs.map((doc) => {
    const post = doc.data();
    return {
      url: `${baseUrl}/blog/${post.slug || doc.id}`,
      lastModified: post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  });

  // Fetch Brands
  const brandsQuery = query(collection(db, 'brands'));
  const brandsSnapshot = await getDocs(brandsQuery);
  const brandRoutes = brandsSnapshot.docs.map((doc) => {
    const b = doc.data();
    return {
      url: `${baseUrl}/designers/${b.slug || doc.id}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  });

  return [...routes, ...productRoutes, ...blogRoutes, ...brandRoutes];
}
