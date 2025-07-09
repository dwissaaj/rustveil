import { useGraphData } from '@/app/lib/workstation/social/useGraphData'
import { VerticesTableViewer } from '@/components/workstation/sna/VerticesTableViewer'
import React, { use } from 'react'

export default function VerticesTable() {
  const {nodeMapValue, centralityValue} = useGraphData()
  console.log("node va", nodeMapValue)
  console.log("cen va", centralityValue)
  return (
    <div>
      <VerticesTableViewer />
    </div>
  )
}
