
import Image from "next/image";

export default function IndoModelInfo() {
  return (
    <div className="space-y-4">
      <p>
        <strong>asdasd (English)</strong> — trained on SST-2 dataset. Supports
        binary classification (Positive/Negative).
      </p>
      <Image
        src="/model/bert-base-indo.png"
        alt="English Model"
        width={300}
        height={150}
        className="rounded-lg shadow"
      />
      
    </div>
  );
}
