"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";

import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, Logo } from "@/components/icons";
import TextUnderstandingList from "./navigation/TextUnderstandingList";
import DataList from "./navigation/DataList";
import SocialNetworkList from "./navigation/SocialNetworkList";
import EntityList from "./navigation/EntityList";
import SpeechAudioList from "./navigation/SpeechAudio";

export const NavigationApp = () => {
  const pathname = usePathname();

  return (
    <Navbar className="mt-4" maxWidth="2xl" shouldHideOnScroll>
      <NavbarBrand as="li" className="">
        <NextLink className="flex justify-start items-center gap-1" href="/">
          {/* <Logo /> */}
          <p className="font-bold text-inherit">RUSTVEIL</p>
        </NextLink>
      </NavbarBrand>
      <NavbarContent className="basis-1/5 sm:basis-full " justify="center">
        <DataList />
        <SocialNetworkList />
        <TextUnderstandingList />
        <EntityList />
        <SpeechAudioList />
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 " justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* <NavbarMenu>
        <div className="flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link color="primary" href={item.href} size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
         
        </div>
      </NavbarMenu> */}
    </Navbar>
  );
};
