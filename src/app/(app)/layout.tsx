import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d0d14]">
      <Sidebar />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
