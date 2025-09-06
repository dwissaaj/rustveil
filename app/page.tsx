import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { Code } from "@heroui/code";

import { title, subtitle } from "@/components/primitives";

export default function Home() {
  return (
    <section className="w-full h-full flex flex-col items-center justify-center gap-4 py-8 md:py-10 ">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Data Processing&nbsp;</span>
        <span className={title({ color: "violet" })}>LLM&nbsp;</span>
        <br />
        <div className={subtitle({ class: "mt-4" })}>
          Fast, accurate, easy to use NLP Task
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "ghost",
          })}
          href={"/docs"}
        >
          Documentation
        </Link>
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={"/work"}
        >
          Working
        </Link>
      </div>

      <div className="mt-8">
        <Code color="primary">Read blog & docs first</Code>
      </div>
    </section>
  );
}
