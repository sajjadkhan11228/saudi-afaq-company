
"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../lib/supabase/client";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, LogOut, Settings } from "lucide-react";

const ADMIN_ID = "2f836c05-a359-4467-a4be-36706e272ce8";

type SiteSettings = {
  id: number;
  company_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hero_image: string | null;
  hero_title_en: string;
  hero_title_ar: string;
  about_en: string | null;
  about_ar: string | null;
};

const defaultSettings: SiteSettings = {
  id: 1,
  company_name: "SAUDI AFAQ COMPANY",
  phone: "+966550748345",
  whatsapp: "+966550748345",
  email: "ik3630108@gmail.com",
  address: "Saudi Arabia",
  hero_image: "",
  hero_title_en: "Building New Horizons.",
  hero_title_ar: "نبني آفاقاً جديدة",
  about_en: "",
  about_ar: "",
};

export default function WebsiteSettingsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function initialize() {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (!active) return;

      if (authError || authData.user?.id !== ADMIN_ID) {
        router.replace("/admin");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (!active) return;

      if (fetchError) {
        setError(fetchError.message);
      } else if (data) {
        setSettings({
          ...defaultSettings,
          ...data,
          hero_image: data.hero_image ?? "",
          about_en: data.about_en ?? "",
          about_ar: data.about_ar ?? "",
        });
      } else {
        setError("Settings row not found. Please check your site_settings table.");
      }

      setLoading(false);
    }

    initialize();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  function updateField(
    field: keyof SiteSettings,
    value: string
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      company_name: settings.company_name.trim(),
      phone: settings.phone.trim(),
      whatsapp: settings.whatsapp.trim(),
      email: settings.email.trim(),
      address: settings.address.trim(),
      hero_image: settings.hero_image?.trim() || null,
      hero_title_en: settings.hero_title_en.trim(),
      hero_title_ar: settings.hero_title_ar.trim(),
      about_en: settings.about_en?.trim() || null,
      about_ar: settings.about_ar?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    const { error: saveError } = await supabase
      .from("site_settings")
      .update(payload)
      .eq("id", 1);

    if (saveError) {
      setError(saveError.message);
    } else {
      setMessage("Website settings saved successfully!");
    }

    setSaving(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#101D30] text-white">
        Loading website settings...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7]">
      <header className="bg-[#101D30] text-white px-5 py-5">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              SAUDI AFAQ
            </h1>
            <p className="text-sm text-[#D5B36A]">
              Website Settings
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="flex items-center gap-2 border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10"
            >
              <ArrowLeft size={17} />
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#C9A45C] text-[#101D30] px-4 py-2 rounded-lg font-semibold hover:bg-[#D5B36A]"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-5 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Settings className="text-[#C9A45C]" size={30} />
            <h2 className="text-3xl font-bold text-[#101D30]">
              Manage Website Settings
            </h2>
          </div>
          <p className="text-gray-500 mt-2">
            Update your company information and website content.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-lg bg-green-100 text-green-800 p-4">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 text-red-700 p-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-[#101D30] mb-5">
              Company Information
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  value={settings.company_name}
                  onChange={(e) => updateField("company_name", e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  value={settings.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  value={settings.whatsapp}
                  onChange={(e) => updateField("whatsapp", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Address
                </label>
                <input
                  value={settings.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-[#C9A45C]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-[#101D30] mb-5">
              Hero Section
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hero Heading (English)
                </label>
                <input
                  value={settings.hero_title_en}
                  onChange={(e) => updateField("hero_title_en", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hero Heading (Arabic)
                </label>
                <input
                  dir="rtl"
                  value={settings.hero_title_ar}
                  onChange={(e) => updateField("hero_title_ar", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hero Background Image URL
                </label>
                <input
                  type="url"
                  value={settings.hero_image ?? ""}
                  onChange={(e) => updateField("hero_image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-[#C9A45C]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter a public image URL. Leave empty to keep the existing local image.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-[#101D30] mb-5">
              About Company
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  About Us (English)
                </label>
                <textarea
                  rows={6}
                  value={settings.about_en ?? ""}
                  onChange={(e) => updateField("about_en", e.target.value)}
                  placeholder="Write about your company..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  About Us (Arabic)
                </label>
                <textarea
                  dir="rtl"
                  rows={6}
                  value={settings.about_ar ?? ""}
                  onChange={(e) => updateField("about_ar", e.target.value)}
                  placeholder="اكتب نبذة عن الشركة..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-[#C9A45C]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-[#101D30] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1b304b] disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? "Saving..." : "Save Website Settings"}
          </button>
        </form>
      </section>
    </main>
  );
}
