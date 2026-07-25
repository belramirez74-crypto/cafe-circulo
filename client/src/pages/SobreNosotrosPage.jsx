import useLandingData from '../components/sections/useLandingData';
import SobreNosotrosSection from '../components/sections/SobreNosotrosSection';

export default function SobreNosotrosPage() {
  const { settings } = useLandingData();
  return (
    <div className="min-h-screen pt-20">
      <SobreNosotrosSection settings={settings} />
    </div>
  );
}
