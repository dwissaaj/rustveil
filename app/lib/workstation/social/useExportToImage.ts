import { BaseDirectory, exists, writeFile } from "@tauri-apps/plugin-fs";
import html2canvas from "html2canvas";
import { RefObject, useCallback } from "react";

export interface ExportImageOptions {
  targetRef: RefObject<HTMLDivElement>;
  filename: string;
}
async function getUniqueFilename(
  baseName: string,
  ext: string,
): Promise<string> {
  let counter = 0;
  let filename = `${baseName}.${ext}`;
<<<<<<< HEAD

=======
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08
  while (
    await exists(`Rust Veil/${filename}`, {
      baseDir: BaseDirectory.Home,
    })
  ) {
    counter++;
    filename = `${baseName}(${counter}).${ext}`;
  }
<<<<<<< HEAD

=======
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08
  return filename;
}
export function useExportToImage({ targetRef, filename }: ExportImageOptions) {
  const getImage = useCallback(async () => {
    try {
      if (!targetRef.current) {
        return {
          response_code: 400,
          message: "Target element not found",
        };
      }

      const canvas = await html2canvas(targetRef.current);

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );

      if (!blob) {
        return {
          response_code: 500,
          message: "Failed to create image blob",
        };
      }

      const buffer = await blob.arrayBuffer();
      const contents = new Uint8Array(buffer);
      const filepath = await getUniqueFilename(filename, "png");
<<<<<<< HEAD

      await writeFile(`Rust Veil/${filepath}`, contents, {
        baseDir: BaseDirectory.Home,
      });

=======
      await writeFile(`Rust Veil/${filepath}`, contents, {
        baseDir: BaseDirectory.Home,
      });
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08
      return {
        response_code: 200,
        message: `Saved at Rust Veil/${filepath}`,
      };
    } catch (error) {
      return {
        response_code: 500,
        message: `Error rendering to image: ${error}`,
      };
    }
  }, [targetRef, filename]);

  return getImage;
}
