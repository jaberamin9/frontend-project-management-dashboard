"use client";
import { SquareChartGantt, SquareKanban, Users, LayoutDashboard, LogOut } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/features/auth/context/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";


const items = [
    {
        title: "Over View",
        url: "/dashboard/over-view",
        icon: SquareKanban,
        only: ["admin", "user"],
    },
    {
        title: "Projects",
        url: "/dashboard/projects",
        icon: SquareChartGantt,
        only: ["admin", "user"],
    },
    {
        title: "View Users",
        url: "/dashboard/users",
        icon: Users,
        only: ["admin"],
    }
];


export function AppSidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    return (
        <Sidebar style={{ "--sidebar-background": '240 4% 9%', '--border': '240 4% 9%', '--sidebar-accent': '240, 7%, 11%' }}>
            <SidebarHeader>
                <div className="flex items-center gap-2 mt-2 px-2">
                    <LayoutDashboard color="#fff" />
                    <p className="font-bold text-lg text-white">Project Management</p>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items
                                .filter(item => item.only.includes(user?.role))
                                .map((item) => (
                                    <SidebarMenuItem key={item.title} >
                                        <SidebarMenuButton asChild style={pathname == item.url ? { backgroundColor: 'black' } : { color: '#1B1B1F' }}>
                                            <Link href={item.url} style={{ color: 'white' }}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="px-2">
                <SidebarMenuButton asChild onClick={() => logout()}
                    className="my-2 cursor-pointer">
                    <div className="text-white hover:text-white">
                        <LogOut strokeWidth={3} />
                        <span>Sign Out</span>
                    </div>
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar >
    )
}
