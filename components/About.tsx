
"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Award,
  Target,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { createClient } from "../lib/supabase/client";

type SiteSettings = {
  about_en: string | null;
  about_ar: string | null;
};

const DEFAULT_ABOUT_EN =
  "SAUDI AFAQ is a general contracting company brand focused on delivering professional construction and project solutions across Saudi Arabia. Our services include building construction, landscaping and stonework. Our goal is to build strong client relationships through quality workmanship, responsible project execution and attention to detail.";

const DEFAULT_ABOUT_AR =
  "آفاق السعودية شركة مقاولات عامة تهدف إلى تقديم حلول احترافية في البناء وتنفيذ المشاريع في جميع أنحاء المملكة العربية السعودية. تشمل خدماتنا أعمال البناء وتنسيق الحدائق والأعمال الحجرية. نسعى إلى بناء علاقات قوية مع عملائنا من خلال جودة العمل والتنفيذ المسؤول والاهتمام بالتفاصيل.";

const features = {
  en: [
    "Commitment to quality",
    "Professional project execution",
    "Customer-focused solutions",
    "Attention to every detail",
  ],
  ar: [
    "الالتزام بالجودة",
    "التنفيذ الاحترافي للمشاريع",
    "حلول تركز على احتياجات العملاء",
    "الاهتمام بكل التفاصيل",
  ],
};

export default function About() {
  const { isArabic } = useLanguage();

  const [settings, setSettings] = useState<SiteSettings>({
    about_en: DEFAULT_ABOUT_EN,
    about_ar: DEFAULT_ABOUT_AR,
  });

  useEffect(() => {
    async function fetchAbout() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("site_settings")
        .select("about_en, about_ar")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("About settings error:", error.message);
        return;
      }

      if (data) {
        setSettings({
          about_en: data.about_en || DEFAULT_ABOUT_EN,
          about_ar: data.about_ar || DEFAULT_ABOUT_AR,
        });
      }
    }

    fetchAbout();
  }, []);

  const description = isArabic
    ? settings.about_ar || DEFAULT_ABOUT_AR
    : settings.about_en || DEFAULT_ABOUT_EN;

  const currentFeatures = isArabic ? features.ar : features.en;

  return (
    <section
      id="about"
      dir={isArabic ? "rtl" : "ltr"}
      aria-labelledby="about-heading"
      className="bg-white px-5 py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

        {/* About Image */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85"
            alt={
              isArabic
                ? "تصميم معماري حديث وأعمال البناء في المملكة العربية السعودية"
                : "Modern architecture and building construction in Saudi Arabia"
            }
            loading="lazy"
            decoding="async"
            className="h-[420px] w-full rounded-xl object-cover"
          />

          <div className="absolute -bottom-6 -right-3 rounded-xl bg-[#101D30] p-6 text-white shadow-xl md:-right-6">
            <Award className="mb-2 text-[#D5B36A]" size={32} />
            <p className="font-bold">
              {isArabic ? "الجودة أولاً" : "Quality First"}
            </p>
            <p className="text-xs text-gray-300">
              {isArabic ? "في كل مشروع" : "In Every Project"}
            </p>
          </div>
        </div>

        {/* About Content */}
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#B28A45]">
            {isArabic ? "عن شركتنا" : "About Our Company"}
          </span>

          <h2
            id="about-heading"
            className="mt-4 text-3xl font-bold leading-tight text-[#101D30] md:text-5xl"
          >
            {isArabic
              ? "شركة آفاق السعودية للمقاولات العامة"
              : "SAUDI AFAQ – General Contracting Company in Saudi Arabia"}
          </h2>

          <p className="mt-6 whitespace-pre-line leading-8 text-gray-600">
            {description}
          </p>

          {/* Features */}
          <div className="mt-8 space-y-4">
            {currentFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2
                  className="shrink-0 text-[#B28A45]"
                  size={21}
                />
                <span className="text-sm font-medium text-[#101D30]">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Mission and Values */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-[#F7F8FA] p-5">
              <Target className="mb-2 text-[#B28A45]" />
              <h3 className="font-bold text-[#101D30]">
                {isArabic ? "رسالتنا" : "Our Mission"}
              </h3>
              <p className="mt-2 text-xs leading-6 text-gray-500">
                {isArabic
                  ? "تقديم حلول موثوقة لتنفيذ المشاريع."
                  : "Deliver dependable construction and project solutions."}
              </p>
            </div>

            <div className="rounded-lg bg-[#F7F8FA] p-5">
              <ShieldCheck className="mb-2 text-[#B28A45]" />
              <h3 className="font-bold text-[#101D30]">
                {isArabic ? "قيمنا" : "Our Values"}
              </h3>
              <p className="mt-2 text-xs leading-6 text-gray-500">
                {isArabic
                  ? "الثقة والجودة والمسؤولية."
                  : "Trust, quality and responsibility."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
