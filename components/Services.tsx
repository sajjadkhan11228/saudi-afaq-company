
"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  HardHat,
  Paintbrush,
  Wrench,
  Building,
  Layers3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { createClient } from "../lib/supabase/client";

type Service = {
  id: string;
  title_en: string;
  title_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  icon: string | null;
  sort_order: number;
};

const iconMap: Record<string, LucideIcon> = {
  building2: Building2,
  building: Building,
  hardhat: HardHat,
  paintbrush: Paintbrush,
  wrench: Wrench,
  layers3: Layers3,
};

function getServiceIcon(iconName: string | null): LucideIcon {
  if (!iconName) return Wrench;

  return iconMap[iconName.toLowerCase()] || Wrench;
}

export default function Services() {
  const { isArabic } = useLanguage();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("services")
        .select(
          "id, title_en, title_ar, description_en, description_ar, icon, sort_order"
        )
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error loading services:", error.message);
        setServices([]);
      } else {
        setServices(data || []);
      }

      setLoading(false);
    }

    fetchServices();
  }, []);

  return (
    <section
      id="services"
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-white px-5 py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#B28A45]">
            {isArabic ? "ماذا نقدم" : "What We Do"}
          </span>

          <h2 className="mt-4 text-3xl font-bold text-[#101D30] md:text-5xl">
            {isArabic ? "خدماتنا الاحترافية" : "Our Professional Services"}
          </h2>

          <p className="mt-5 leading-8 text-gray-500">
            {isArabic
              ? "حلول متكاملة في المقاولات والبناء لتلبية احتياجات عملائنا في جميع أنحاء المملكة العربية السعودية."
              : "Comprehensive contracting and construction solutions designed to meet the needs of our clients across Saudi Arabia."}
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl border border-gray-100 p-8"
              >
                <div className="mb-6 h-14 w-14 rounded-lg bg-gray-200" />
                <div className="mb-4 h-4 w-12 rounded bg-gray-200" />
                <div className="mb-4 h-6 w-3/4 rounded bg-gray-200" />
                <div className="h-16 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            {isArabic
              ? "لا توجد خدمات متاحة حالياً."
              : "No services available at the moment."}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = getServiceIcon(service.icon);

              const title = isArabic
                ? service.title_ar || service.title_en
                : service.title_en;

              const description = isArabic
                ? service.description_ar || service.description_en
                : service.description_en;

              return (
                <div
                  key={service.id}
                  className="group rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#C9A45C] hover:shadow-xl"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-[#101D30] text-[#D5B36A] transition group-hover:bg-[#C9A45C] group-hover:text-[#101D30]">
                    <Icon size={27} />
                  </div>

                  <span className="text-xs font-semibold text-[#B28A45]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="mt-3 text-xl font-bold text-[#101D30]">
                    {title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-gray-500">
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
