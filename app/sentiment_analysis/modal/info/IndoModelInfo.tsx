
import Image from "next/image";

export default function IndoModelInfo() {
  return (
    <div className="space-y-4">
      <Image
        src="/models/english.png"
        alt="English Model"
        width={300}
        height={150}
        className="rounded-lg shadow"
      />
      <p>
        <strong>asdasd (English)</strong> — trained on SST-2 dataset. Supports
        binary classification (Positive/Negative).
      </p>
    </div>
  );
}
