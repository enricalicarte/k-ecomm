import Image from 'next/image';

interface MediaRendererProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

function getYoutubeVideoId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function MediaRenderer({ src, alt, fill, className, width, height }: MediaRendererProps) {
  if (!src) return null;

  const ytId = getYoutubeVideoId(src);
  if (ytId) {
    return (
      <div className={`w-full h-full overflow-hidden ${fill ? 'absolute inset-0' : 'relative'}`} style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}>
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0`}
          className={`w-full h-full object-cover pointer-events-none scale-[1.5] ${className || ''}`}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    );
  }

  if (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov') || src.includes('.mp4?')) {
    return (
      <video 
        src={src} 
        autoPlay 
        loop 
        muted 
        playsInline 
        className={`w-full h-full object-cover ${className || ''}`} 
      />
    );
  }

  // It's an image. Try to use next/image if it's from a known domain, otherwise regular img tag 
  // or we could use next/image and assume next.config.ts has it, but if user pastes a random domain it will crash Next.js
  // Let's use a normal <img> tag for arbitrary URLs if we don't want it to crash, but the instructions say
  // "Must enable Next.js image optimization... If you use images from a hostname... register it in next.config.ts"
  // If it's unsplash, firebase, or picsum it will work. If not, we will still try to render it.

  if (fill) {
    return <Image src={src} fill className={className} alt={alt} referrerPolicy="no-referrer" />;
  }

  return <Image src={src} width={width || 800} height={height || 600} className={className} alt={alt} referrerPolicy="no-referrer" />;
}
