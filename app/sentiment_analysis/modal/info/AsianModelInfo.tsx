
import Image from "next/image";

export default function AsianModelInfo() {
  return (
    <div className="space-y-4">
      <Image
        src="/model/distillbert-asia.png"
        alt="English Model"
        width={300}
        height={150}
        className="rounded-lg shadow"
      />
      <p>
        <strong>DistilBERT (English)</strong> — trained on SST-2 dataset. Supports
        binary classification (Positive/Negative).
      </p>
    </div>
  );
}
