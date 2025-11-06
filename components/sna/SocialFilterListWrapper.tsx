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
<<<<<<< HEAD:components/sna/SocialFilterListWrapper.tsx
=======
      <div></div>
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08:components/workstation/sna/SocialFilterListWrapper.tsx
    </div>
  );
}
