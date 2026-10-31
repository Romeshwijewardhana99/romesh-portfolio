import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

import {
  getSiteSettings,
} from "@/lib/site-settings";

export default async function PublicLayout({
  children,
}) {
  const settings =
    await getSiteSettings();

  return (
    <div className="min-h-screen bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white">
      <Navbar
        siteName={
          settings?.siteName
        }
      />

      {children}

      <Footer
        settings={settings}
      />
    </div>
  );
}