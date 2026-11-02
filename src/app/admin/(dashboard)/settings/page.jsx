import { getSiteSettings } from "@/lib/site-settings";
import { requireAdmin } from "@/lib/auth/admin";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import AdminPageHeading from "@/components/admin/AdminPageHeading";

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <section className="mx-auto max-w-5xl">
      <AdminPageHeading eyebrow="Portfolio configuration / 06" title="Site Settings"
        description="Manage the site identity, hero message, contacts, profile image, social links and search visibility."
      />
      <SiteSettingsForm settings={settings} />
    </section>
  );
}
