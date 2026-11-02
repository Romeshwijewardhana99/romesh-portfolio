import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { getSiteSettings } from "@/lib/site-settings";

export default async function PublicLayout({ children }) {
  const settings = await getSiteSettings();

  return (
    <div style={{ "--public-bg": "#F7F7F2" }} className="public-site min-h-screen bg-[#F7F7F2] text-[#183027] [font-family:var(--font-geist-sans),Arial,sans-serif]">
      <a href="#public-main" className="public-skip-link">Skip to content</a>
      <Navbar siteName={settings?.siteName} />
      <div id="public-main" tabIndex={-1} className="public-content">{children}</div>
      <Footer settings={settings} />
    </div>
  );
}
