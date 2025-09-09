"use client";

import SocialCalculateMenu from "./centrality/calculate/SocialCalculateMenu";
import SocialNodesMenu from "./SocialEditMenu";

export default function SocialFilterListWrapper() {
  return (
    <div className="flex flex-row gap-4 border-b py-2 items-center">
      <div>
        <SocialNodesMenu />
      </div>
      <div>
        <SocialCalculateMenu />
      </div>
      <div></div>
    </div>
  );
}
