import VerticesTable from "./VerticesTable";

export default function VerticesHome() {
  return (
    <div className="max-h-screen">
      <div className="grid grid-cols-2 gap-2 mt-10">
        <div>
          <VerticesTable />
        </div>
        <div>Graph</div>
      </div>
    </div>
  );
}
