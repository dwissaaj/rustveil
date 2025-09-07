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
import { ReportIcon } from "@/components/icon/IconFilter";


export default function SocialInfoMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="light">Info</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Info about social network analysis">
          <DropdownItem
            onPress={onOpen}
            description="Information about social network data"
            startContent={<ReportIcon />}
            key="info"
          >
            Info
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      
    </>
  );
}
