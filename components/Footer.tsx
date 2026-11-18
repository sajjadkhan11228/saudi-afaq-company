
"use client";

import { useEffect, useState } from "react";

import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

import { useLanguage } from "./LanguageProvider";
import { createClient } from "../lib/supabase/client";

const DEFAULT_SETTINGS = {
  company_name: "SAUDI AFAQ COMPANY",
  phone: "+966550748345",
  whatsapp: "+966550748345",
  email: "ik3630108@gmail.com",
  address: "Saudi Arabia",
};

type SiteSettings = {
  company_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
};

export default function Footer() {
  const { isArabic } = useLanguage();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [year, setYear] = useState(2026);

  const [supabase] = useState(() => createClient());

  // Fetch website settings from Supabase
  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("company_name, phone, whatsapp, email, address")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Footer settings error:", error);
        return;
      }

      if (data) {
        const siteSettings = data as SiteSettings;

        setSettings({
          company_name:
            siteSettings.company_name || DEFAULT_SETTINGS.company_name,
          phone: siteSettings.phone || DEFAULT_SETTINGS.phone,
          whatsapp: siteSettings.whatsapp || DEFAULT_SETTINGS.whatsapp,
          email: siteSettings.email || DEFAULT_SETTINGS.email,
          address: siteSettings.address || DEFAULT_SETTINGS.address,
        });
      }
    }

    fetchSettings();
  }, [supabase]);

  // Update copyright year after the component mounts
  useEffect(() => {
  const year = new Date().getFullYear();
  }, []);

  const phoneNumber = settings.phone.replace(/\s/g, "");
  const whatsappNumber = settings.whatsapp.replace(/\D/g, "");

  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const links = [
    { en: "Home", ar: "الرئيسية", href: "#home" },
    { en: "About Us", ar: "من نحن", href: "#about" },
    { en: "Services", ar: "خدماتنا", href: "#services" },
    { en: "Projects", ar: "مشاريعنا", href: "#projects" },
    { en: "Contact", ar: "اتصل بنا", href: "#contact" },
  ];

  const services = [
    { en: "General Contracting", ar: "المقاولات العامة" },
    { en: "Building Construction", ar: "إنشاء المباني" },
    { en: "Interior & Exterior", ar: "التشطيبات الداخلية والخارجية" },
    { en: "Maintenance Services", ar: "خدمات الصيانة" },
    { en: "Renovation & Finishing", ar: "التجديد والتشطيبات" },
    { en: "Project Management", ar: "إدارة المشاريع" },
  ];

  return (
    <footer
      id="contact"
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-[#101D30] text-white"
    >
      {/* Contact Banner */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-12 text-center sm:px-8 md:flex-row md:text-left">
          <div>
            <span className="mb-3 block text-xs font-bold tracking-[0.25em] text-[#D5B36A]">
              {isArabic ? "لنعمل معاً" : "LET'S WORK TOGETHER"}
            </span>

            <h2 className="text-2xl font-bold md:text-3xl">
              {isArabic
                ? "هل لديك مشروع جديد؟"
                : "Have a Project in Mind?"}
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-300">
              {isArabic
                ? "تواصل معنا لمناقشة متطلبات مشروعك."
                : "Contact our team to discuss your project requirements."}
            </p>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-3 rounded-lg bg-[#C9A45C] px-7 py-4 font-bold text-[#101D30] transition hover:-translate-y-1 hover:bg-white"
          >
            <MessageCircle size={21} />
            {isArabic ? "تواصل عبر واتساب" : "CONTACT US"}
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>

      {/* Footer Main */}
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4">

        {/* Company */}
        <div>
          <a href="#home" className="inline-block">
            <h2 className="text-2xl font-extrabold tracking-wide">
              {settings.company_name}
            </h2>
          </a>

          <p className="mt-2 text-xs font-semibold tracking-[0.2em] text-[#C9A45C]">
            BUILDING NEW HORIZONS
          </p>

          <p className="mt-6 text-sm leading-8 text-gray-300">
            {isArabic
              ? "شركة آفاق السعودية للمقاولات. نقدم حلولاً في المقاولات والبناء والتشطيبات والخدمات الإنشائية في المملكة العربية السعودية."
              : "SAUDI AFAQ COMPANY provides contracting, construction, finishing and property improvement solutions across Saudi Arabia."}
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm text-gray-300">
            <span className="animate-pulse text-xl">🇸🇦</span>
            {settings.address}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-6 text-lg font-bold text-white">
            {isArabic ? "روابط سريعة" : "Quick Links"}
          </h3>

          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-gray-300 transition hover:text-[#D5B36A]"
                >
                  {isArabic ? link.ar : link.en}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-6 text-lg font-bold text-white">
            {isArabic ? "خدماتنا" : "Our Services"}
          </h3>

          <ul className="space-y-4">
            {services.map((service) => (
              <li key={service.en} className="text-sm text-gray-300">
                {isArabic ? service.ar : service.en}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-6 text-lg font-bold text-white">
            {isArabic ? "معلومات التواصل" : "Contact Information"}
          </h3>

          <div className="space-y-5">
            <a
              href={`tel:${phoneNumber}`}
              dir="ltr"
              className="flex items-center gap-3 text-sm text-gray-300 transition hover:text-[#D5B36A]"
            >
              <Phone size={19} className="shrink-0 text-[#D5B36A]" />
              {settings.phone}
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="flex items-center gap-3 text-sm text-gray-300 transition hover:text-[#D5B36A]"
            >
              <MessageCircle size={19} className="shrink-0 text-[#D5B36A]" />
              WhatsApp
            </a>

            <a
              href={`mailto:${settings.email}`}
              dir="ltr"
              className="flex items-start gap-3 break-all text-sm text-gray-300 transition hover:text-[#D5B36A]"
            >
              <Mail size={19} className="mt-0.5 shrink-0 text-[#D5B36A]" />
              {settings.email}
            </a>

            <div className="flex items-center gap-3 text-sm text-gray-300">
              <MapPin size={19} className="shrink-0 text-[#D5B36A]" />
              {settings.address}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-center sm:px-8 md:flex-row">
          <p className="text-xs text-gray-400">
            © {year} {settings.company_name}. All Rights Reserved.
          </p>

          <p className="text-xs text-gray-400">
            {isArabic
              ? "الجودة والثقة والتميز"
              : "Quality • Trust • Excellence"}
          </p>
        </div>
      </div>
    </footer>
  );
}
