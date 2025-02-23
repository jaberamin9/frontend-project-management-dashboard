"use client";
import React, { useEffect, useState } from 'react'
import { useAuth } from "@/features/auth/context/AuthContext";
import { Header } from '@/features/dashboard/components/header';
import SimpleTable from '@/features/dashboard/components/simpleTable';
import { TableHeader } from '@/features/dashboard/components/tableHeader';
import { TableFooter } from '@/features/dashboard/components/tableFooter';
import { useUsersMuta } from '@/features/users/api/useUsersMuta';


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

export default function Users() {
    const { user } = useAuth();
    const [data, setData] = useState({});
    const [filters, setFilters] = useState({
        search: '',
        sortBy: 'id',
        order: 'asc',
        role: ' ',
        page: '1',
        limit: '10'
    })

    const { mutate: getUsers, isPending } = useUsersMuta({
        onSuccess: (res) => {
            setData(res);
        },
        onError: (error) => {
            console.error(error.response.status);
            console.error(error.response.data.error);
        },
        enabled: !!user && user?.role === "admin"
    });

    const adminUserViewColumns = [
        { label: "SI", key: "si", className: "w-[100px] font-medium text-white", render: (_, idx) => Number(filters.limit) * (data?.currentPage - 1 || 0) + idx + 1 },
        { label: "Name", key: "name", className: "text-white" },
        { label: "Role", key: "role", className: "font-medium text-white" },
        { label: "Email", key: "email", className: "text-white" },
        { label: "Created At", key: "createdAt", className: "text-right text-white", render: (item) => formattedDate(item.createdAt) },
        { label: "", key: "action", className: "text-right text-white", action: true }
    ];

    useEffect(() => {
        getUsers(`/users?search=${filters.search}&limit=${filters.limit}&page=${filters.page}&sortBy=${filters.sortBy}&order=${filters.order}&role=${filters.role}`);
    }, [filters]);


    return (
        <main className="flex-1 px-3 sm:px-5 h-screen flex flex-col overflow-hidden">
            <Header user={user} />
            <div className="py-4 flex-1 flex flex-col min-h-0">
                <p className=" text-white font-semibold text-2xl sm:text-3xl mb-4">View All Users</p>

                <TableHeader
                    filters={filters}
                    setFilters={setFilters}
                    name="users"
                />
                <div className='mt-4 flex gap-6 flex-1 overflow-hidden'>
                    <SimpleTable
                        columns={adminUserViewColumns}
                        data={data?.users || []}
                        isLoading={isPending}
                        user={user}
                        rePetch={getUsers}
                    />
                </div>

                <TableFooter
                    filters={filters}
                    setFilters={setFilters}
                    data={data}
                    name="users"
                />

            </div>
        </main>
    );
}
