import useLandingData from '../components/sections/useLandingData';
import SobreNosotrosSection from '../components/sections/SobreNosotrosSection';

export default function SobreNosotrosPage() {
  const { settings } = useLandingData();
  return (
    <div className="min-h-screen pt-16">
      <SobreNosotrosSection settings={settings} />
    </div>
  );
}
