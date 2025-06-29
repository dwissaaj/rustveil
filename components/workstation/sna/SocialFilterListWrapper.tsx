"use client";

import SocialCalculateMenu from "./SocialCalculateMenu";
import SocialPickMenu from "./SocialPickMenu";

export default function SocialFilterListWrapper() {
  return (
    <div className="flex flex-row gap-4 border-b py-2 items-center">
      <div>
        <SocialPickMenu />
      </div>
      <div>
        <SocialCalculateMenu />
      </div>
    </div>
  );
}
