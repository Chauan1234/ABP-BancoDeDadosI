import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/contexts/ToggleTheme";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
        </SidebarProvider>
    )
}