import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Metadata } from 'next';
import Image from 'next/image';
import PageRenderer from '@/components/PageRenderer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Editorial | Studio K',
  description: 'Editorial essays and lookbooks from Action K.',
};

async function getPosts() {
  try {
    const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const posts: any[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
  } catch (error) {
    console.error("Error fetching editorial posts", error);
    return [];
  }
}

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <main className="bg-bone min-h-screen text-charcoal">
      <div className="pt-32 pb-12 px-6 md:px-12 max-w-[1400px] mx-auto">
         <h1 className="font-sans text-[clamp(4rem,8vw,6rem)] text-charcoal tracking-tighter leading-none mb-12 max-w-[100vw] break-words">
           editorial
         </h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-32 flex flex-col md:flex-row gap-16">
        <aside className="w-full md:w-64 shrink-0 font-sans">
          <div className="sticky top-32 space-y-4">
             <button className="block w-full text-left font-sans text-sm tracking-wide text-charcoal underline underline-offset-4">
               All
             </button>
             {/* If we had categories, they would go here */}
          </div>
        </aside>

        <div className="flex-1">
          {posts.length === 0 ? (
            <div className="py-32 text-center">
               <p className="text-charcoal/60 uppercase tracking-[0.2em] text-xs">No editorials published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-24 items-start">
              {posts.map((post, index) => {
                const mt = index % 2 !== 0 ? 'sm:mt-32' : '';
                return (
                <article key={post.slug || post.id} className={`group flex flex-col ${mt}`}>
                  <Link href={`/blog/${post.slug || post.id}`} className="block w-full aspect-[4/3] bg-gray-100 relative overflow-hidden mb-6">
                    {post.image ? (
                      <Image src={post.image} alt={post.title} fill className="object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-bone">
                         <span className="text-charcoal/40 uppercase tracking-[0.5em] text-[10px] font-bold">kauai</span>
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-col">
                    <h2 className="font-sans text-sm font-normal text-charcoal mb-4 hover:opacity-70 transition-opacity">
                      <Link href={`/blog/${post.slug || post.id}`}>{post.title}</Link>
                    </h2>
                  </div>
                </article>
              )})}
            </div>
          )}
        </div>
      </div>
      <PageRenderer pageId="blog" />
    </main>
  );
}
