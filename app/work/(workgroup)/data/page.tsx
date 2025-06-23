'use client'
import React from "react";
import DataFilter from "./DataFilter";
import { invoke } from '@tauri-apps/api/core'; // Import the invoke function
import { Button } from "@heroui/button";
export default function Data() {
  const callRustCommand = async () => {
    try {
      // Call the command by its function name as a string
      await invoke('load_data');
      console.log('Rust command executed successfully!');
    } catch (error) {
      console.error('Error calling Rust command:', error);
    }
  };

  return (
    <div>
      <section>
    
      <DataFilter />

      </section>
      <section>
        this is data page
        <Button onPress={callRustCommand}>Click</Button>
      </section>
    </div>
  )
}
