import SocialFilterListWrapper from "@/components/workstation/sna/SocialFilterListWrapper";
import React from "react";
import Vertices from "./filter/vertices/Vertices";

export default function SocialNetwork() {
  return (
    <div>
      <div>
        <SocialFilterListWrapper />
      </div>
      <div>
        <Vertices />
      </div>
  </div>
  )
}
