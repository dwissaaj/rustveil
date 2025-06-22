import { subtitle, title } from "@/components/primitives";

export default function AboutPage() {
  return (
    <div className="w-full items-center">
      <h1 className={title()}>About</h1>
      <div className={subtitle({ class: "mt-4" })}>
        Ready to use Natural Language Processing Task with LLM
      </div>
    </div>
  );
}
