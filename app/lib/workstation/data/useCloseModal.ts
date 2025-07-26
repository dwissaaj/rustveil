import { useAtom, useSetAtom } from "jotai";
import { filePath, sheetAvailable } from "./state";

export const useCloseModal = (onOpenChange: (open: boolean) => void) => {
  const setFileState = useSetAtom(filePath);
  const setSelectedSheet = useSetAtom(sheetAvailable);

  const closeModal = async () => {
    const newState = { isSelected: false, url: "" };
    setFileState(newState);
    setSelectedSheet([]);
    onOpenChange(false);
  };

  return {
    closeModal,
  };
};
