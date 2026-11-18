import { Code } from "@heroui/code";
import React from "react";

/**
 * Displays a warning message when no Excel data is available
 *
 * @component
 * @example
 * // Basic usage:
 * <NoData />
 *
 * @description
 * Shows a centered warning message prompting users to upload an Excel file.
 * Uses Hero UI's Code component for consistent styling.
 *
 * @ui
 * - Centered horizontally and vertically
 * - Warning color scheme
 * - Top margin of 5rem (mt-20)
 * - Flex layout for centering
 */
export default function NoData() {
  return (
    <div className="mt-20 flex flex-row items-center justify-center">
      <Code color="warning">No Data - try to upload a file</Code>
    </div>
  );
}
