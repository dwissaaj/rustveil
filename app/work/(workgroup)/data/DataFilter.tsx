"use client";
import React, { useState } from "react";
import { Button } from "@heroui/button";
import { FileOpener } from "@/app/lib/workstation/data/GetFile";
export default function DataFilter() {


  return (
    <div className="w-full border-b border-white/80 p-2 dark:bg-[#1a1c20] shadow-md shadow-white/50">
      <Button color="secondary" variant="light" onPress={FileOpener}>Get File</Button>
    </div>
  );
}
