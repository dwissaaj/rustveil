'use client'
import React from 'react'
import {Button,Tab, Tabs, Switch, Card, CardBody } from "@heroui/react"
export default function LeftNav() {
  return (
    <div className='h-screen bg-black-900 border rounded-md p-2 shadow-md shadow-white'>

        <div className="flex flex-col px-4">
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options" isVertical={true}>
          <Tab key="photos" title="Photos">
            asd
          </Tab>
          <Tab key="music" title="Music">
            gfh
          </Tab>
          <Tab key="videos" title="Videos">
            fghfg
          </Tab>
        </Tabs>
      </div>
    </div>
    </div>
  )
}
