import { tableData } from '@/app/lib/workstation/data/state';
import { useColumnShow } from '@/app/lib/workstation/social/GetColumn';
import { useAtomValue } from 'jotai';
import React from 'react'

export default function VerticesTable() {
    const { vertex1, vertex2 } = useColumnShow();
  const data = useAtomValue(tableData);


  const vertex1Data = vertex1 && data ? data.rows.map(row => row[vertex1]) : [];
  const vertex2Data = vertex2 && data ? data.rows.map(row => row[vertex2]) : [];

  return (
    <div>VerticesTable</div>
  )
}
