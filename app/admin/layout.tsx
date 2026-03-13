import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin dashboard for managing users and subscriptions",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
