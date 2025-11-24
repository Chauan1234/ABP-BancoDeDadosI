"use client";

import { useTheme } from "@/contexts/ToggleTheme";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeSwitcher() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            onClick={toggleTheme}
            size={"icon"}
            className="w-full"
        >
            {theme === "light" ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
        </Button>
    )
}