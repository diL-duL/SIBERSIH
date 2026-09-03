import BottomNav from "@/components/BottomNav";

export default function ExecutiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <BottomNav role="executive" />
    </>
  );
}
