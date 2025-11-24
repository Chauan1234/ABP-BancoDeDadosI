"use client";

// React e Next
import React from "react";
import Link from "next/link";
import Package from '../../../../package.json';

// UI Components
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import clsx from "clsx";
import { FactoryIcon } from "lucide-react";

export function NavHeader() {
    const { state } = useSidebar();

    return (
        // Logo e nome da aplicação
        <SidebarMenu className={clsx("flex items-center", state === "collapsed" ? "flex-col" : "flex-row")}>
            <SidebarMenuButton asChild className="transition-all duration-200">
                <Link href="/" className="h-auto w-auto">
                    {state === "collapsed" ? (
                        <FactoryIcon className="size-10 text-primary" />
                    ) : (
                        <div className="flex flex-row items-center gap-2">
                            <FactoryIcon className="size-10 text-primary" />
                            <div className="flex flex-col justify-between">
                                <span className="text-base">
                                    Fabricação
                                </span>
                                <span className="text-xs text-muted-foreground">v{Package.version}</span>
                            </div>
                        </div>
                    )}
                </Link>
            </SidebarMenuButton>
            <SidebarTrigger className="cursor-pointer hover:bg-secondary/20 hover:text-primary" />
        </SidebarMenu>
    );
}