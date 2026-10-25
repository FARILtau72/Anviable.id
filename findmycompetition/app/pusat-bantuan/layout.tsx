import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pusat Bantuan & Kontak : anviable.id",
  description:
    "Pusat bantuan resmi, FAQ panduan kompetisi, dan saluran kontak kurator platform anviable.id.",
};

export default function PusatBantuanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
