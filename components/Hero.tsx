
"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { createClient } from "../lib/supabase/client";

type SiteSettings = {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  hero_image: string | null;
  hero_title_en: string | null;
  hero_title_ar: string | null;
};

const DEFAULT_SETTINGS: SiteSettings = {
  phone: "+966550748345",
  whatsapp: "+966550748345",
  email: "ik3630108@gmail.com",
  hero_image: "/images/building.jpg",
  hero_title_en: "Building New Horizons.",
  hero_title_ar: "نبني آفاقاً جديدة",
};

export default function Hero() {
  const { isArabic } = useLanguage();

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("site_settings")
        .select(
          "phone, whatsapp, email, hero_image, hero_title_en, hero_title_ar"
        )
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Hero settings error:", error.message);
        return;
      }

      if (data) {
        setSettings({
          phone: data.phone || DEFAULT_SETTINGS.phone,
          whatsapp: data.whatsapp || DEFAULT_SETTINGS.whatsapp,
          email: data.email || DEFAULT_SETTINGS.email,
          hero_image: data.hero_image || DEFAULT_SETTINGS.hero_image,
          hero_title_en:
            data.hero_title_en || DEFAULT_SETTINGS.hero_title_en,
          hero_title_ar:
            data.hero_title_ar || DEFAULT_SETTINGS.hero_title_ar,
        });
      }
    }

    fetchSettings();
  }, []);

  const phone = settings.phone || DEFAULT_SETTINGS.phone || "";
  const email = settings.email || DEFAULT_SETTINGS.email || "";

  const whatsappNumber = (
    settings.whatsapp ||
    DEFAULT_SETTINGS.whatsapp ||
    "+966550748345"
  ).replace(/\D/g, "");

  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const heroImage =
    settings.hero_image || "/images/building.jpg";

  const heading = isArabic
    ? settings.hero_title_ar || DEFAULT_SETTINGS.hero_title_ar
    : settings.hero_title_en || DEFAULT_SETTINGS.hero_title_en;

  return (
    <section
      id="home"
      dir={isArabic ? "rtl" : "ltr"}
      className="relative flex min-h-[680px] items-center overflow-hidden bg-[#101D30] text-white"
    >
      {/* Dynamic Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${heroImage}")`,
        }}
        role="img"
        aria-label="SAUDI AFAQ construction project"
      />

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#101D30]/85 via-[#101D30]/50 to-[#101D30]/15" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24">
        <div className="max-w-3xl">

          {/* Saudi Badge */}
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#C9A45C]/50 bg-[#101D30]/60 px-5 py-3 text-sm text-[#E5C783] backdrop-blur-sm">
            <span className="animate-pulse text-xl">🇸🇦</span>
            {isArabic
              ? "شركة مقاولات في المملكة العربية السعودية"
              : "CONTRACTING COMPANY IN SAUDI ARABIA"}
          </div>

          {/* Dynamic Heading */}
          <h1 className="whitespace-pre-line text-5xl font-bold leading-tight md:text-7xl">
            {heading}
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-xl text-base leading-8 text-gray-200 md:text-lg">
            {isArabic
              ? "نقدم حلولاً احترافية في المقاولات والبناء، مع التركيز على الجودة والثقة والتميز في جميع أنحاء المملكة العربية السعودية."
              : "Delivering quality, trust and excellence through professional contracting and construction solutions across Saudi Arabia."}
          </p>

          {/* Main Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-md bg-green-600 px-7 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-green-700"
            >
              <MessageCircle size={21} />
              {isArabic ? "تواصل عبر واتساب" : "WhatsApp Us"}
            </a>

            <a
              href={`tel:${phone}`}
              dir="ltr"
              className="inline-flex items-center gap-3 rounded-md bg-[#C9A45C] px-7 py-4 font-semibold text-[#101D30] transition hover:-translate-y-1 hover:bg-white"
            >
              <Phone size={20} />
              {isArabic ? "اتصل الآن" : "Call Now"}
            </a>

            <a
              href="#projects"
              className="inline-flex items-center gap-3 rounded-md border border-white/50 px-7 py-4 font-semibold transition hover:border-[#D5B36A] hover:text-[#D5B36A]"
            >
              {isArabic ? "مشاريعنا" : "Our Projects"}
              <ArrowRight
                size={19}
                className={isArabic ? "rotate-180" : ""}
              />
            </a>
          </div>

          {/* Contact Information */}
          <div className="mt-12 grid gap-4 border-t border-white/30 pt-7 sm:grid-cols-2">
            <a
              href={`tel:${phone}`}
              dir="ltr"
              className="flex items-center gap-3 transition hover:text-[#D5B36A]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-[#D5B36A]">
                <Phone size={20} />
              </span>

              <span>
                <span className="block text-xs text-gray-200">
                  {isArabic ? "اتصل بنا" : "Call Us"}
                </span>
                <span className="font-semibold">{phone}</span>
              </span>
            </a>

            <a
              href={`mailto:${email}`}
              dir="ltr"
              className="flex min-w-0 items-center gap-3 transition hover:text-[#D5B36A]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-[#D5B36A]">
                <Mail size={20} />
              </span>

              <span className="min-w-0">
                <span className="block text-xs text-gray-200">
                  {isArabic ? "البريد الإلكتروني" : "Email Us"}
                </span>
                <span className="break-all text-sm font-semibold">
                  {email}
                </span>
              </span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
