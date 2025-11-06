"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  useDisclosure,
  DropdownItem,
  Button,
} from "@heroui/react";
<<<<<<< HEAD:components/sna/centrality/calculate/SocialCalculateMenu.tsx
import SocialCalculateModal from "@/app/social_network/filter/modal/CalculateModal";
import { CalculateIcon } from "@/components/icon/IconGraph";
import { CalculateTabIcon } from "@/components/icon/IconAction";
=======
import SocialCalculateModal from "@/app/work/(workgroup)/social_network/filter/modal/CalculateModal";
import { CalculateIcon } from "@/components/icon/IconGraph";
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08:components/workstation/sna/centrality/calculate/SocialCalculateMenu.tsx

export default function SocialCalculateMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
<<<<<<< HEAD:components/sna/centrality/calculate/SocialCalculateMenu.tsx
            startContent={<CalculateTabIcon />}
            size="sm"
=======
            size="lg"
>>>>>>> dfc31e108e0b3fc3d1bb8908cffa7b2f22800e08:components/workstation/sna/centrality/calculate/SocialCalculateMenu.tsx
            className="text-black dark:text-white"
            color="primary"
            variant="light"
          >
            Calculate
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          color="primary"
          variant="flat"
          aria-label="Calculate graph metrics"
        >
          <DropdownItem
            onPress={onOpen}
            startContent={<CalculateIcon className="w-6" />}
            description="Compute social network metrics"
            key="calculate"
          >
            Calculate Metrics
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <SocialCalculateModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
