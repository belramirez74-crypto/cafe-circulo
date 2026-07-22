import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

function isLocalVideo(url) {
  return /\.(mp4|webm|mov)$/i.test(url);
}

function isVideoUrl(url) {
  return isLocalVideo(url) || /(?:youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/|player\.vimeo\.com\/video\/)/.test(url);
}

function getVideoEmbed(url) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=0`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
  return url;
}

function LocalVideo({ src, isActive }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isActive]);

  const toggleMute = (e) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setMuted(vid.muted);
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
        title={muted ? 'Activar sonido' : 'Silenciar'}
      >
        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </div>
  );
}

export default function GallerySection({ galleryImages, galleryIdx, setGalleryIdx, settings }) {
  const [taglineIdx, setTaglineIdx] = useState(0);
  const timerRef = useRef(null);
  const lines = settings?.gallery_taglines || ['más que un café de especialidad,', 'una comunidad.'];
  const currentLine = lines[taglineIdx % lines.length];

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTaglineIdx(prev => prev + 1);
    }, 3500);
    return () => clearInterval(timerRef.current);
  }, [lines.length]);

  const items = (galleryImages || []).slice(0, 4);

  return (
    <section className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center min-h-[5rem]">
          <p
            key={taglineIdx}
            className="font-script text-cafe-burgundy text-2xl sm:text-3xl tagline-rotate"
          >
            {currentLine}
          </p>
        </div>
        <div className="bg-cafe-surface border border-cafe-border/60 rounded-xl overflow-hidden">
          {items.length > 0 ? (
            <div className="relative aspect-[16/9]">
              {items.map((item, i) => (
                <motion.div
                  key={item}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i === galleryIdx ? 1 : 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {isLocalVideo(item) ? (
                    <LocalVideo src={item} isActive={i === galleryIdx} />
                  ) : isVideoUrl(item) ? (
                    <iframe
                      src={getVideoEmbed(item)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`Video ${i + 1}`}
                    />
                  ) : (
                    <img
                      src={item}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </motion.div>
              ))}
              {items.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIdx(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === galleryIdx ? 'bg-cafe-cream' : 'bg-cafe-cream/30'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-cafe-muted text-sm">Sin imágenes</div>
          )}
        </div>
      </div>
    </section>
  );
}
