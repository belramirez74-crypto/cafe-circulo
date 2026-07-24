import { useEffect, useState } from 'react';
import { getFeaturedItems, getUpcomingEvents, getLandingSettings } from '../../lib/api';

export default function useLandingData() {
  const [featured, setFeatured] = useState([]);
  const [events, setEvents] = useState([]);
  const [settings, setSettings] = useState({});
  const [galleryIdx, setGalleryIdx] = useState(0);

  useEffect(() => {
    getLandingSettings()
      .then(res => {
        setSettings(res.data);
        if (res.data?.hero_bg_image) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = res.data.hero_bg_image;
          document.head.appendChild(link);
        }
        if (res.data?.recommended_items?.length > 0) {
          setFeatured(res.data.recommended_items.filter(r => r.name));
        } else {
          return getFeaturedItems().then(r => setFeatured(r.data));
        }
      })
      .catch(() => setSettings({}));
    getUpcomingEvents().then(res => setEvents(res.data)).catch(() => {});
  }, []);

  const galleryImages = settings?.gallery_images?.filter(Boolean) || [];

  useEffect(() => {
    if (galleryImages.length < 2) return;
    const timer = setInterval(() => setGalleryIdx(p => (p + 1) % Math.min(galleryImages.length, 4)), 4000);
    return () => clearInterval(timer);
  }, [galleryImages.length]);

  return { featured, events, settings, galleryIdx, setGalleryIdx, galleryImages };
}
