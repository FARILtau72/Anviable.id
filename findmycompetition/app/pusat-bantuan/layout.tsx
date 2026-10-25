import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pusat Bantuan & Kontak : naviable.id",
  description:
    "Pusat bantuan resmi, FAQ panduan kompetisi, dan saluran kontak kurator platform naviable.id.",
};

export default function PusatBantuanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
