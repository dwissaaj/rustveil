import { Button, Tooltip } from "@heroui/react";
import React from "react";

export default function NoDataChartComponent() {
  return (
    <div className="w-full h-full flex justify-center items-center text-black/80">
      <Tooltip
        content="No Data can be processed calculate a new one"
        color="secondary"
      >
        <Button className="capitalize" color="warning" variant="flat">
          No Data for Render Chart
        </Button>
      </Tooltip>
    </div>
  );
}
