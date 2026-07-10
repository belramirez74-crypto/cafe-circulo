import { motion } from 'framer-motion';

export default function GallerySection({ galleryImages, galleryIdx, setGalleryIdx, settings }) {
  return (
    <section className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center">
          <p className="font-script text-cafe-cream text-xl">{settings?.gallery_tagline_1 || 'más que un café de especialidad,'}</p>
          <p className="font-script text-cafe-cream text-xl -mt-1">{settings?.gallery_tagline_2 || 'una comunidad.'}</p>
        </div>
        <div className="bg-cafe-surface border border-cafe-border/60 rounded-xl overflow-hidden">
          {galleryImages.length > 0 ? (
            <div className="relative aspect-[16/9]">
              {galleryImages.slice(0, 4).map((img, i) => (
                <motion.img
                  key={img}
                  src={img}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i === galleryIdx ? 1 : 0 }}
                  transition={{ duration: 0.8 }}
                />
              ))}
              {galleryImages.slice(0, 4).length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {galleryImages.slice(0, 4).map((_, i) => (
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
