"use client";

import {
  BadgeCheck,
  Bell,
  Bolt,
  ChevronsUpDown,
  CreditCard,
  Loader2,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthState } from "@/modules/auth/providers/auth-context";
import SignOut from "@/modules/auth/views/ui/sign-out";
import TextSkeleton from "@/components/text-skeleton";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data } = useAuthState();

  const trpc = useTRPC();
  const { data: activeSubscription, isLoading } = useQuery(
    trpc.premium.getActiveSubscription.queryOptions(),
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={data?.user.image} />
                <AvatarFallback className="rounded-lg bg-indigo-700 text-white">
                  {data?.user.name ? (
                    data.user.name.charAt(0).toUpperCase() +
                    data.user.name.split(" ")[1].charAt(0).toUpperCase()
                  ) : (
                    <Loader2 className="h-2 w-2 animate-spin text-white" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <TextSkeleton
                  className="truncate font-medium"
                  text={data?.user.name}
                />
                <TextSkeleton
                  className="truncate text-xs"
                  text={data?.user.email}
                />
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={data?.user.image} />
                  <AvatarFallback className="rounded-lg bg-indigo-700 text-white">
                    {data?.user.name ? (
                      data.user.name.charAt(0).toUpperCase() +
                      data.user.name.split(" ")[1].charAt(0).toUpperCase()
                    ) : (
                      <Loader2 className="h-2 w-2 animate-spin text-white" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {data?.user.name}
                  </span>
                  <span className="truncate text-xs">{data?.user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {!isLoading && !activeSubscription && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/pro">
                      <Sparkles />
                      Upgrade to Pro
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/account">
                  <Bolt />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => authClient.customer.portal()}>
                <CreditCard />
                Billing
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              <SignOut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
