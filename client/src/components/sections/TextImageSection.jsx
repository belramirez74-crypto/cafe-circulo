import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function TextImageSection({ module }) {
  const { title, subtitle, paragraph, cta_text, cta_link, image_url, image_align } = module || {};
  if (!title && !paragraph && !image_url) return null;
  const imgLeft = image_align === 'left';

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className={`flex flex-col ${imgLeft ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10`}>
          <motion.div
            initial={{ opacity: 0, x: imgLeft ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-4"
          >
            {subtitle && (
              <p className="font-display text-sm tracking-widest text-cafe-accent uppercase">{subtitle}</p>
            )}
            {title && (
              <h2 className="font-display text-3xl sm:text-4xl text-cafe-text">{title}</h2>
            )}
            {paragraph && (
              <p className="text-cafe-muted leading-relaxed max-w-xl">{paragraph}</p>
            )}
            {cta_text && cta_link && (
              <Link
                to={cta_link}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-cafe-accent text-white font-display text-sm tracking-wider rounded-full hover:opacity-90 transition-all"
              >
                {cta_text} <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </motion.div>
          {image_url && (
            <motion.div
              initial={{ opacity: 0, x: imgLeft ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img src={image_url} alt={title || ''} className="w-full h-full object-cover" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
