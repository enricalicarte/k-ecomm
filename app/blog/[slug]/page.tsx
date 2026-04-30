import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPostFromSlug(slug: string) {
  try {
    // First try a direct lookup by ID (in case ID == slug)
    const docSnap = await getDoc(doc(db, 'blog', slug));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as any;
    }

    // If not found by ID, query by slug field
    const q = query(collection(db, 'blog'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as any;
    }
  } catch (error) {
    console.error("Error fetching editorial post:", error);
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostFromSlug(resolvedParams.slug);
  
  if (!post) return { title: 'Post not found | kauai archive' };
  
  const title = `${post.title} | kauai archive`;
  const excerpt = post.excerpt || '';
  const publishedAt = post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString();  
  const url = `https://kauai.es/blog/${resolvedParams.slug}`;

  return {
    title,
    description: excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: excerpt,
      url,
      images: post.image ? [post.image] : [],
      type: 'article',
      publishedTime: publishedAt,
      siteName: 'kauai archive',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: excerpt,
      images: post.image ? [post.image] : [],
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = await getPostFromSlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Basic html string clean up
  const htmlContent = (post.content || '')
    .replace(/<h2>/g, '<h2 class="text-3xl font-light italic font-serif text-dusty-rose mt-12 mb-6">')
    .replace(/<h3>/g, '<h3 class="text-xl font-medium tracking-tight mt-8 mb-4">')
    .replace(/<p>/g, '<p class="text-charcoal/80 leading-relaxed text-base mb-6">')
    .replace(/<ul>/g, '<ul class="list-disc pl-6 text-charcoal/80 leading-relaxed text-base mb-6 space-y-2">')
    .replace(/<li>/g, '<li>');

  return (
    <main className="flex-grow px-6 md:px-12 pb-32 pt-16 max-w-4xl mx-auto w-full bg-bone text-charcoal">
       <div className="mb-12">
         <Link href="/blog" className="text-[10px] text-charcoal/50 uppercase tracking-[0.2em] hover:text-dusty-rose transition-colors">
            [ Back to Editorials ]
         </Link>
       </div>
       
       <header className="border-b border-charcoal/20 pb-12 mb-12">
          <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-sage-green mb-6">
            {post.tag || 'Editorial'}
          </span>
          <h1 className="font-serif text-5xl md:text-6xl font-light leading-none mb-6 tracking-tight">
             {post.title}
          </h1>
          <p className="text-xl text-charcoal/70 font-light leading-relaxed mb-8">
             {post.excerpt}
          </p>
          <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] font-medium text-charcoal/40">
             {post.readTime && <span>{post.readTime} min read</span>}
             {post.date && <span>{post.date}</span>}
          </div>
       </header>

       {post.image && (
         <div className="w-full aspect-[21/9] relative mb-16 brutalist-border overflow-hidden bg-[#EAE8E4] paper-shadow p-2">
           <div className="w-full h-full relative">
             <Image src={post.image} alt={post.title} fill className="object-cover grayscale-[0.2]" referrerPolicy="no-referrer" />
           </div>
         </div>
       )}

       {/* Content container */}
       <div 
         className="prose prose-neutral max-w-none prose-headings:font-light prose-p:text-charcoal/80 prose-a:text-dusty-rose"
         dangerouslySetInnerHTML={{ __html: htmlContent }} 
       />

       <footer className="mt-24 pt-12 border-t border-charcoal/20 text-center">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-charcoal/60">Explore The Archive</h4>
          <Link href="/catalogo" className="paper-shadow border border-charcoal bg-bone px-10 py-5 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-charcoal hover:text-bone transition-all duration-500 ease-out">
             View Collection 01
          </Link>
       </footer>
    </main>
  );
}
