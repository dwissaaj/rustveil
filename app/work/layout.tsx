import Filter from "@/components/filter";
import LeftNav from "@/components/leftnav";
import ScrollSmotherProvider from "@/components/ScrollSmotherProvider";

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (


   
  <ScrollSmotherProvider>
     <div className="grid grid-cols-12 gap-2">
      <div className="col-span-2">
        <LeftNav />
      </div>
      <div className="col-span-8">{children}</div>
      <div className="col-span-2">
        <Filter />
      </div>
    </div>

  </ScrollSmotherProvider>
  );
}
