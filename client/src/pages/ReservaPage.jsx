import useLandingData from '../components/sections/useLandingData';
import ReservaSection from '../components/sections/ReservaSection';

export default function ReservaPage() {
  const { settings } = useLandingData();
  return (
    <div className="min-h-screen pt-20">
      <ReservaSection settings={settings} />
    </div>
  );
}
