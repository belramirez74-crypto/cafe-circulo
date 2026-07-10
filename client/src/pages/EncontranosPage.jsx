import useLandingData from '../components/sections/useLandingData';
import EncontranosSection from '../components/sections/EncontranosSection';

export default function EncontranosPage() {
  const { settings } = useLandingData();
  return (
    <div className="min-h-screen pt-16">
      <EncontranosSection settings={settings} />
    </div>
  );
}
