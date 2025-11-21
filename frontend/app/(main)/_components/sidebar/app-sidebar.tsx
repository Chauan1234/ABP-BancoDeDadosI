"use client";

// React
import React from "react";
import { useEffect } from "react";

// Components
import { NavMain } from "@/app/(main)/_components/sidebar/nav-main";
import { NavHeader } from "@/app/(main)/_components/sidebar/nav-header";

// UI Components
import { FactoryIcon, LayoutDashboardIcon, PackageIcon, TreeDeciduousIcon, TruckIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader} from "../../../../components/ui/sidebar";

// Dados estáticos para popular o sidebar
const data = {
    NavMain: [
        {
            title: "Dashboard",
            url: "/",
            icon: LayoutDashboardIcon,
        },
        {
            title: "Fornecedores",
            url: "/fornecedores",
            icon: TruckIcon,
        },
        {
            title: "Matérias-primas",
            url: "/materias-primas",
            icon: TreeDeciduousIcon,
        },
        {
            title: "Fabricações",
            url: "/fabricacoes",
            icon: FactoryIcon,
        },
        {
            title: "Produtos",
            url: "/produtos",
            icon: PackageIcon,
        }
    ],
};

export default function AppSidebar() {

    return (
        <Sidebar variant="inset" collapsible="icon">
            {/* Header */}
            <SidebarHeader>
                <NavHeader />
            </SidebarHeader>
            
            {/* Content */}
            <SidebarContent>
                <NavMain items={data.NavMain} />
            </SidebarContent>
        </Sidebar>
    )
}