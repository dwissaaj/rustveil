import { subtitle, title } from "@/components/primitives";

export default function DocsPage() {
  return (
    <div>
      <div>
      <h1 className={title()}>Docs</h1>
    </div>
    <div className={subtitle()}>
      How to use this app
    </div>
    </div>
  );
}
