
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  BriefcaseBusiness,
  LogOut,
  Globe,
  ShieldCheck,
  Loader2,
  ArrowUpRight,
} from "lucide-react";

import { createClient } from "../../../lib/supabase/client";

const ADMIN_ID = "2f836c05-a359-4467-a4be-36706e272ce8";

export default function AdminDashboard() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !data.user || data.user.id !== ADMIN_ID) {
        router.replace("/admin");
        return;
      }

      setAdminEmail(data.user.email || "");
      setLoading(false);
    }

    checkAdmin();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101D30]">
        <Loader2 className="animate-spin text-[#D5B36A]" size={38} />
      </main>
    );
  }

  const menuItems = [
    {
      title: "Overview",
      description: "Your website dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      title: "Manage Projects",
      description: "Add and manage company projects",
      icon: FolderKanban,
      href: "/admin/dashboard/projects",
    },
    {
      title: "Manage Services",
      description: "Manage your company services",
      icon: BriefcaseBusiness,
      href: "/admin/dashboard/services",
    },
    {
      title: "Website Settings",
      description: "Manage contact and website details",
      icon: Settings,
      href: "/admin/dashboard/settings",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F4F6F9]">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 bg-[#101D30] px-6 py-5 text-white shadow-lg sm:px-10">
        <div>
          <h1 className="text-xl font-bold">
            SAUDI <span className="text-[#D5B36A]">AFAQ</span>
          </h1>
          <p className="mt-1 text-xs tracking-widest text-[#D5B36A]">
            ADMIN CONTROL PANEL
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10"
        >
          <LogOut size={17} />
          Logout
        </button>
      </header>

      {/* Dashboard Content */}
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-10">
        <div className="mb-8">
          <p className="text-sm text-gray-500">Welcome back</p>

          <h2 className="mt-1 text-3xl font-bold text-[#101D30]">
            Admin Dashboard
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Manage your SAUDI AFAQ company website from one place.
          </p>
        </div>

        {/* Admin Information */}
        <div className="mb-8 rounded-2xl border border-[#C9A45C]/30 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[#B18B45]" size={28} />

            <div>
              <p className="font-semibold text-[#101D30]">
                Administrator Access
              </p>

              <p className="text-sm text-gray-500">
                {adminEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group block rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#C9A45C]/50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#C9A45C]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A45C]/10 text-[#A47B32] transition group-hover:bg-[#C9A45C] group-hover:text-[#101D30]">
                    <Icon size={25} />
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="text-gray-300 transition group-hover:text-[#A47B32]"
                  />
                </div>

                <h3 className="font-bold text-[#101D30] transition group-hover:text-[#A47B32]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {item.description}
                </p>

                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#A47B32]">
                  Open Section →
                </p>
              </Link>
            );
          })}
        </div>

        {/* Company Information */}
        <div className="mt-8 rounded-2xl bg-[#101D30] p-7 text-white">
          <Globe className="mb-4 text-[#D5B36A]" size={30} />

          <h3 className="text-xl font-bold">
            SAUDI AFAQ COMPANY
          </h3>

          <p className="mt-2 text-sm text-gray-300">
            Building New Horizons — Manage your website professionally.
          </p>
        </div>
      </div>
    </main>
  );
}
