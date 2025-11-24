"use client";

// React
import React from "react";

// Components
import { NavMain } from "@/app/(main)/_components/sidebar/nav-main";
import { NavHeader } from "@/app/(main)/_components/sidebar/nav-header";

// UI Components
import { FactoryIcon, LayoutDashboardIcon, PackageIcon, TreeDeciduousIcon, TruckIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader} from "../../../../components/ui/sidebar";
import ThemeSwitcher from "./_components/theme-switcher";

// Dados estáticos para popular o sidebar
const data = {
    NavMain: [
        {
            title: "Home",
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

            <SidebarFooter>
                <ThemeSwitcher />
            </SidebarFooter>
        </Sidebar>
    )
}