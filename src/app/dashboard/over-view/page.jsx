"use client";
import React from 'react'
import { useAuth } from "@/features/auth/context/AuthContext";
import { useLatestUser } from '@/features/over-view/api/useLatestUser';
import { Header } from '@/features/dashboard/components/header';
import { useAssignedProject } from '@/features/over-view/api/useAssignedProject';
import SimpleTable from '@/features/dashboard/components/simpleTable';
import { useStats } from '@/features/over-view/api/useStats';
import PieChartComponent from '@/features/over-view/components/pieChartComponent';

const formattedDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}


export default function overView() {
    const { user } = useAuth();

    const { data, isLoading } = useStats({ enabled: !!user }, user);
    const { data: latestUser, isLoading: loadingLatestUser } = useLatestUser({ enabled: !!user && user?.role === "admin" });
    const { data: assignedProject, isLoading: loadingAssignedProject } = useAssignedProject({ enabled: !!user && user?.role === "user" }, user);

    const adminUserViewColumns = [
        { label: "SI", key: "si", className: "w-[100px] font-medium text-white", render: (_, idx) => idx + 1 },
        { label: "Name", key: "name", className: "text-white" },
        { label: "Role", key: "role", className: "font-medium text-white" },
        { label: "Email", key: "email", className: "text-white" },
        { label: "Created At", key: "createdAt", className: "text-right text-white", render: (item) => formattedDate(item.createdAt) }
    ];

    const asignedProjectViewColumns = [
        { label: "SI", key: "si", className: "w-[100px] font-medium text-white", render: (_, idx) => idx + 1 },
        { label: "Title", key: "title", className: "text-white" },
        { label: "Status", key: "status", className: "font-medium text-white" },
        { label: "Due Date", key: "dueDate", className: "text-white", render: (item) => formattedDate(item.dueDate) },
        { label: "Created At", key: "createdAt", className: "text-right text-white", render: (item) => formattedDate(item.createdAt) }
    ];

    return (
        <main className="flex-1 px-3 sm:px-5 h-screen flex flex-col overflow-hidden">
            <Header user={user} />
            <div className='overflow-auto'>
                <div className="py-4 flex-1 flex flex-col min-h-0">
                    <p className=" text-white font-semibold text-2xl sm:text-3xl mb-4">Hi, Welcome back 👋</p>
                    <div className="flex justify-between h-[600px] sm:h-full items-center gap-4 lg:gap-6 flex-col sm:flex-row">
                        <div className="p-3 w-full flex-1 h-[200px] bg-[#161618] rounded-lg flex flex-col justify-between items-center text-white text-2xl">
                            <p className="flex-1 flex items-center justify-center">{isLoading || !data ? "..." : data?.total}</p>
                            <p className="text-center text-sm font-normal">{user?.role == 'admin' ? 'Total Project' : 'Total Assigned Project'}</p>
                        </div>
                        <div className="p-3 flex-1 w-full h-[200px] bg-[#161618] rounded-lg flex flex-col justify-between items-center text-white text-2xl">
                            <p className="flex-1 flex items-center justify-center">{isLoading || !data ? "..." : data?.active}</p>
                            <p className="text-center text-sm font-normal">Active Project</p>
                        </div>
                        <div className="p-3 flex-1 w-full h-[200px] bg-[#161618] rounded-lg flex flex-col justify-between items-center text-white text-2xl">
                            <p className="flex-1 flex items-center justify-center">{isLoading || !data ? "..." : data?.review}</p>
                            <p className="text-center text-sm font-normal">{user?.role == 'admin' ? 'Need to Review' : 'Pandding for Review'}</p>
                        </div>
                        <div className="p-3 flex-1 w-full h-[200px] bg-[#161618] rounded-lg flex flex-col justify-between items-center text-white text-2xl">
                            <p className="flex-1 flex items-center justify-center">{isLoading || !data ? "..." : data?.completed}</p>
                            <p className="text-center text-sm font-normal">Completed Project</p>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 xl:gap-6">
                        <div className="w-full md:w-full lg:w-[40%] overflow-hidden">
                            <PieChartComponent data={data} />
                        </div>
                        <div className="flex flex-1 overflow-hidden">
                            <SimpleTable
                                title={user?.role == "admin" ? "List of Recent Users" : "List of Assigned Project"}
                                columns={user?.role == "admin" ? adminUserViewColumns : asignedProjectViewColumns}
                                data={user?.role == "admin" ? latestUser?.users || [] : assignedProject?.projects || []}
                                isLoading={user?.role == "admin" ? loadingLatestUser : loadingAssignedProject}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
