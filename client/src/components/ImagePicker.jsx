import { useState, useEffect, useRef } from 'react';
import { Upload, Image, Link, X, Loader, Film } from 'lucide-react';
import { uploadImage, getUploadedImages } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

function isVideoUrl(url) {
  return /\.(mp4|webm|mov)$/i.test(url) || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
}

export default function ImagePicker({ value, onChange, onClose }) {
  const [tab, setTab] = useState('upload');
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(value || '');
  const [gallery, setGallery] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const fileRef = useRef();
  const { t } = useLanguage();

  useEffect(() => {
    if (tab === 'gallery') {
      setLoadingGallery(true);
      getUploadedImages().then(res => setGallery(res.data)).catch(() => {}).finally(() => setLoadingGallery(false));
    }
  }, [tab]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      onChange(res.data.url);
      onClose?.();
    } catch (err) {
      alert(err.response?.data?.error || t('upload_error'));
    } finally {
      setUploading(false);
    }
  };

  const handleUrl = () => {
    if (url.trim()) {
      onChange(url.trim());
      onClose?.();
    }
  };

  const renderThumb = (item, small = false) => {
    if (item.type === 'video') {
      return (
        <div className="w-full h-full bg-cafe-card flex items-center justify-center relative">
          <Film className={small ? 'w-4 h-4 text-cafe-accent' : 'w-8 h-8 text-cafe-accent'} />
          <span className="absolute bottom-1 right-1 text-[9px] bg-black/60 text-white px-1 rounded">MP4</span>
        </div>
      );
    }
    return <img src={item.url} alt="" className="w-full h-full object-cover" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div className="bg-cafe-surface border border-cafe-border w-full max-w-lg rounded-xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cafe-border">
          <h2 className="font-display text-lg text-cafe-text">{t('picker_title')}</h2>
          <button onClick={onClose} className="text-cafe-muted hover:text-cafe-text">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-cafe-border">
          <button onClick={() => setTab('upload')} className={`flex-1 flex items-center justify-center gap-2 py-3 font-display text-xs tracking-wider transition-colors ${tab === 'upload' ? 'text-cafe-accent border-b-2 border-cafe-accent' : 'text-cafe-muted hover:text-cafe-text'}`}>
            <Upload className="w-4 h-4" /> {t('picker_upload')}
          </button>
          <button onClick={() => setTab('gallery')} className={`flex-1 flex items-center justify-center gap-2 py-3 font-display text-xs tracking-wider transition-colors ${tab === 'gallery' ? 'text-cafe-accent border-b-2 border-cafe-accent' : 'text-cafe-muted hover:text-cafe-text'}`}>
            <Image className="w-4 h-4" /> {t('picker_gallery')}
          </button>
          <button onClick={() => setTab('url')} className={`flex-1 flex items-center justify-center gap-2 py-3 font-display text-xs tracking-wider transition-colors ${tab === 'url' ? 'text-cafe-accent border-b-2 border-cafe-accent' : 'text-cafe-muted hover:text-cafe-text'}`}>
            <Link className="w-4 h-4" /> URL
          </button>
        </div>

        {/* Upload Tab */}
        {tab === 'upload' && (
          <div className="p-6 text-center">
            <input ref={fileRef} type="file" accept="image/*,video/mp4,video/webm,video/quicktime" onChange={handleFile} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full aspect-video border-2 border-dashed border-cafe-border hover:border-cafe-accent transition-colors flex flex-col items-center justify-center gap-3 disabled:opacity-50"
            >
              {uploading ? (
                <Loader className="w-8 h-8 text-cafe-accent animate-spin" />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-cafe-muted" />
                  <p className="text-cafe-muted text-sm">{t('picker_click')}</p>
                  <p className="text-cafe-muted-dark text-xs">{t('picker_formats')}</p>
                </>
              )}
            </button>
          </div>
        )}

        {/* Gallery Tab */}
        {tab === 'gallery' && (
          <div className="p-4 max-h-80 overflow-y-auto">
            {loadingGallery ? (
              <div className="flex justify-center py-8">
                <Loader className="w-6 h-6 text-cafe-accent animate-spin" />
              </div>
            ) : gallery.length === 0 ? (
              <p className="text-center text-cafe-muted text-sm py-8">{t('picker_empty')}</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {gallery.map(item => (
                  <button
                    key={item.filename}
                    onClick={() => { onChange(item.url); onClose?.(); }}
                    className={`aspect-video rounded overflow-hidden border-2 transition-colors ${value === item.url ? 'border-cafe-accent' : 'border-transparent hover:border-cafe-border'}`}
                  >
                    {renderThumb(item, true)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* URL Tab */}
        {tab === 'url' && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">{t('picker_url_label')}</label>
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full px-3 py-2 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent"
                placeholder="https://... o youtube.com/watch?v=... o vimeo.com/..."
                autoFocus
              />
            </div>
            {url && (
              <div className="aspect-video rounded overflow-hidden border border-cafe-border bg-cafe-card">
                {(() => {
                  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
                  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
                  if (ytMatch) {
                    return <iframe src={`https://www.youtube.com/embed/${ytMatch[1]}`} className="w-full h-full" allowFullScreen title={t('picker_preview')} />;
                  }
                  if (vimeoMatch) {
                    return <iframe src={`https://player.vimeo.com/video/${vimeoMatch[1]}`} className="w-full h-full" allowFullScreen title={t('picker_preview')} />;
                  }
                  if (/\.(mp4|webm|mov)$/i.test(url)) {
                    return <video src={url} className="w-full h-full object-cover" controls />;
                  }
                  return <img src={url} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />;
                })()}
              </div>
            )}
            <button
              onClick={handleUrl}
              disabled={!url.trim()}
              className="w-full py-2 bg-cafe-accent text-white font-display text-sm tracking-wider hover:bg-cafe-burgundy-light transition-colors disabled:opacity-50 rounded-xl shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40"
            >
              {t('picker_use_url')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
