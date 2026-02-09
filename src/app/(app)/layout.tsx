import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pt-16 px-4 pb-8 md:pt-8 md:pl-72 md:pr-8">{children}</main>
    </div>
  );
}
