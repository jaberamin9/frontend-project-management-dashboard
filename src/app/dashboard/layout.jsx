import React from 'react'
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";

export default function dashboardLayout({ children }) {

    return (
        <SidebarProvider className="bg-[#1B1B1F]">
            <AppSidebar />
            {children}
        </SidebarProvider>
    )
}