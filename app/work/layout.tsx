import TabWorkstation from "@/components/TabWorkstation";
import ScrollSmotherProvider from "@/components/ScrollSmotherProvider";

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollSmotherProvider>
      <TabWorkstation />
      <div>{children}</div>
    </ScrollSmotherProvider>
  );
}
