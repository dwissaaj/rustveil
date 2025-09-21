import { Button, Tooltip } from '@heroui/react'
import React from 'react'

export default function AllZeroComponent() {
  return (
    <div className='w-full h-full flex justify-center items-center text-black/80'>
        <Tooltip content="Check Your Table All Data is 0"  color="secondary">
          <Button className="capitalize" color="warning" variant="flat">
            All Data is Zero Or Null
          </Button>
          </Tooltip>
    </div>
  )
}
