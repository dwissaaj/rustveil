/**
 * Dropdown menu for social network analysis vertex selection
 *
 * @component
 * @example
 * // Basic usage:
 * <SocialPickMenu />
 *
 * @description
 * Provides a dropdown interface that:
 * - Shows "Nodes" as trigger button
 * - Contains action to open vertex selection modal
 * - Manages modal state internally
 *
 * @features
 * - Uses Hero UI's Dropdown components
 * - Integrates with VerticesModal
 * - Custom vertex selection icon
 *
 * @ui
 * - Bordered trigger button
 * - Full-width dropdown items
 * - Custom VerticesIcon as end content
 * - Accessible ARIA labels
 *
 * @behavior
 * - Clicking "Locate Vertices" opens the modal
 * - Modal state managed via useDisclosure
 * - Pure presentational component (state lifted to VerticesModal)
 *
 * @dependencies
 * - @hero-ui/react (Dropdown components)
 * - VerticesModal (vertex selection modal)
 * - VerticesIcon (custom icon component)
 */

"use client";
import VerticesModal from "@/app/work/(workgroup)/social_network/filter/modal/EdgesModal";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  useDisclosure,
  DropdownItem,
  Button,
} from "@heroui/react";
import { VerticesIcon } from "@/components/icon/IconFilter";
import { CalculateIcon } from "@/components/icon/IconGraph";

export default function SocialNodesMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button className="text-black dark:text-white" color="primary" variant="light">Edit</Button>
        </DropdownTrigger>
        <DropdownMenu color="primary" variant="flat" aria-label="locate vertices">
          <DropdownItem
            key="vertices"
            description="Select vertices for analysis"
            startContent={<VerticesIcon className="w-6" />}
            onPress={onOpen}
          >
            Locate Vertices
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <VerticesModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
