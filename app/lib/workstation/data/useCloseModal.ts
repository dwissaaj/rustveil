import { useAtom, useSetAtom } from "jotai";

import { filePath, sheetAvailable } from "../../data/state";

export const useCloseModal = (
  onOpenChange: (open: boolean) => void,
  addToast: any,
) => {
  const [fileState, setFileState] = useAtom(filePath);
  const setSelectedSheet = useSetAtom(sheetAvailable);

  const closeModal = async () => {
    if (fileState.isSelected === false && fileState.url === "") {
      addToast({
        title: "Oops! File Missing",
        description: "Looks like you haven't selected a file yet.",
        variant: "flat",
        color: "warning",
      });
    }

    const newState = { isSelected: false, url: "" };

    setFileState(newState);
    setSelectedSheet([]);
    onOpenChange(false);
  };

  return {
    closeModal,
  };
};
