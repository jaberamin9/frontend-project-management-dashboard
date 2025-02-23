"use client";
import React from 'react'
import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Slash } from "lucide-react"
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';


export function Header({ user }) {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter((item) => item != '');
    const { isMobile } = useSidebar();

    return (
        <div className="h-[60px] border-b-[1px] py-2 border-[#161618] text-white flex items-center justify-between">
            {isMobile ? <SidebarTrigger /> : undefined}
            {!isMobile &&
                <Breadcrumb>
                    <BreadcrumbList>
                        {pathSegments.map((item, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <BreadcrumbItem className="text-white">
                                        <BreadcrumbLink href={pathname}>{item}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {index !== pathSegments.length - 1 && (
                                        <BreadcrumbSeparator>
                                            <Slash color="white" />
                                        </BreadcrumbSeparator>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            }
            <div className="flex items-center justify-between gap-3">
                <div className="bg-[#161618] rounded-md h-[45px] py-2 px-4 flex items-center">{user?.role.split('')[0].toUpperCase()}</div>
                <div>
                    <p className=" text-md">{user?.name}</p>
                    <p className=" text-sm">{user?.email}</p>
                </div>
            </div>
        </div>
    )
}
