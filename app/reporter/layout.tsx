import BottomNav from "@/components/BottomNav";

export default function ReporterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <BottomNav role="reporter" />
    </>
  );
}
