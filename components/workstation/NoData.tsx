import { Code } from '@heroui/code'
import React from 'react'

export default function NoData() {
  return (
    <div className='mt-20 flex flex-row items-center justify-center'>
        <Code color="warning">No Data tried to upload a .xlsx file</Code>
    </div>
  )
}
