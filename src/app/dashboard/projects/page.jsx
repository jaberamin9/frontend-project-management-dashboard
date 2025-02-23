"use client";
import React, { useEffect, useState } from 'react'
import { useAuth } from "@/features/auth/context/AuthContext";
import { Header } from '@/features/dashboard/components/header';
import SimpleTable from '@/features/dashboard/components/simpleTable';
import { useProjects } from '@/features/projects/api/useProjects';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useProjectByUser } from '@/features/projects/api/useProjectByUser';
import { TableHeader } from '@/features/dashboard/components/tableHeader';
import { TableFooter } from '@/features/dashboard/components/tableFooter';

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

export default function Projects() {
    const { user } = useAuth();
    const [data, setData] = useState({});
    const router = useRouter();
    const query = useQueryClient();
    const [filters, setFilters] = useState({
        search: '',
        sortBy: 'id',
        order: 'asc',
        status: ' ',
        page: '1',
        limit: '10'
    })


    const { mutate: getProjects, isPending } = useProjects({
        onSuccess: (res) => {
            setData(res);
        },
        onError: (error) => {
            console.error(error.response.status);
            console.error(error.response.data.error);
        }
    });
    const { mutate: getProjectByUser, isPending: pending } = useProjectByUser({
        onSuccess: (res) => {
            setData(res);
        },
        onError: (error) => {
            console.error(error.response.status);
            console.error(error.response.data.error);
        }
    });

    useEffect(() => {
        if (!user?.id) return;
        if (user && user.role === 'user') {
            getProjectByUser(`/projects/user/${user.id}?search=${filters.search}&limit=${filters.limit}&page=${filters.page}&sortBy=${filters.sortBy}&order=${filters.order}&status=${filters.status}`)
        } else {
            getProjects(`/projects?search=${filters.search}&limit=${filters.limit}&page=${filters.page}&sortBy=${filters.sortBy}&order=${filters.order}&status=${filters.status}`);
        }
    }, [filters]);

    const projectViewColumns = [
        { label: "SI", key: "si", className: "w-[100px] font-medium text-white", render: (_, idx) => Number(filters.limit) * (data?.currentPage - 1 || 0) + idx + 1 },
        { label: "Title", key: "title", className: "text-white" },
        { label: "Status", key: "status", className: "font-medium text-white" },
        { label: "Due Date", key: "dueDate", className: "text-white", render: (item) => formattedDate(item.dueDate) },
        { label: "Created At", key: "createdAt", className: "text-white", render: (item) => formattedDate(item.createdAt) },
        { label: "", key: "action", className: "text-right text-white", action: true }
    ];

    return (
        <main className="flex-1 px-3 sm:px-5 h-screen flex flex-col overflow-hidden">
            <Header user={user} />
            <div className="py-4 flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-2 sm:mb-0">
                    <p className="text-white font-semibold text-2xl sm:text-3xl mb-4">{user?.role === 'admin' ? 'View All Projects' : 'Assigned Projects'}</p>
                    {user?.role === 'admin' && <Button onClick={() => {
                        query.clear('project');
                        router.push('/dashboard/projects/create-project');
                    }} className="bg-[#083EC9]">
                        Add Project
                    </Button>}
                </div>

                <TableHeader
                    filters={filters}
                    setFilters={setFilters}
                />

                <div className="mt-4 flex flex-1 overflow-hidden">
                    <SimpleTable
                        columns={projectViewColumns}
                        data={data?.projects || []}
                        isLoading={isPending || pending}
                        user={user}
                        isProject={true}
                        rePetch={getProjects}
                    />
                </div>

                <TableFooter
                    filters={filters}
                    setFilters={setFilters}
                    data={data}
                />
            </div>
        </main>
    );
}
