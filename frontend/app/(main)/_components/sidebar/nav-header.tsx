"use client";

// React e Next
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Package from '../../../../package.json';

// Assets
import LogoLabtec from "@/public/logo-labtec-sem-texto.png";

// UI Components
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";

export function NavHeader() {
    const { state } = useSidebar();

    return (
        // Logo e nome da aplicação
        <SidebarMenu>
            <SidebarMenuButton asChild className="transition-all duration-200">
                <Link href="/" className="h-auto w-auto">
                    {state === "collapsed" ? (
                        <Image src={LogoLabtec.src} alt="Logo Labtec" width={40} height={40} />
                    ) : (
                        <div className="flex flex-row items-center gap-2">
                            <Image src={LogoLabtec.src} alt="Logo Labtec" width={40} height={40} />
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
        </SidebarMenu>
    );
}