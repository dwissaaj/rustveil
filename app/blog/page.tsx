'use client'
import { title , subtitle} from "@/components/primitives";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from  "@heroui/react"
export default function BlogPage() {
  return (
    <div>
      <h1 className={title()}>Blog</h1>
      <div className={subtitle()}>
            Read before use
          </div>
          <div>
            <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <Image
          alt="heroui logo"
          height={40}
          radius="sm"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">What is NLP</p>
          <p className="text-small text-default-500">heroui.com</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>Deep what is llm or nlp task</p>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link isExternal showAnchorIcon href="https://github.com/heroui-inc/heroui">
          Visit source code on GitHub.
        </Link>
      </CardFooter>
    </Card>
          </div>
    </div>
  );
}
