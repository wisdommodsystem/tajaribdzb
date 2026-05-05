import { WisdomSidebar } from "@/components/wisdom/WisdomSidebar";

export default function WisdomLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
      <WisdomSidebar />
      <section className="flex-1 p-6">{children}</section>
    </div>
  );
}
