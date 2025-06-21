import Filter from "@/components/filter";
import LeftNav from "@/components/leftnav";

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
     <div className="grid grid-cols-12 gap-2"> {/* Change to grid-cols-4 */}
      {/* Left Column: Takes 1 of 4 columns */}
      <div className="col-span-2">
        <LeftNav />
      </div>

      {/* Middle Column: Takes 2 of 4 columns (the largest) */}
      <div className="col-span-8">
        {children}
      </div>

      {/* Right Column: Takes 1 of 4 columns */}
      <div className="col-span-2">
        <Filter />
      </div>
    </div>
 
  );
}
