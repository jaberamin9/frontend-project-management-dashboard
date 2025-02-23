"use client";
import React, { use, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Eye, FilePenLine, Loader2, ShieldCheck, Trash, User } from 'lucide-react';
import { useUpdateRole } from "@/features/users/api/useUpdateRole";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteUser } from "@/features/users/api/useDeleteUser";
import { useDeleteProject } from "@/features/projects/api/useDeleteProject";
import { useRouter } from "next/navigation";

export default function SimpleTable({ title, columns, data, isLoading, user, isProject = false, rePetch }) {
    const query = useQueryClient();
    const router = useRouter();
    const [loadingRole, setLoadingRole] = useState(null);
    const [loadingDeleteUser, setLoadingDeleteUser] = useState(null);

    const { mutate: updateRole } = useUpdateRole({
        onSuccess: () => {
            rePetch('/users');
            setLoadingRole(null);
        },
        onError: (error) => {
            setLoadingRole(null);
            console.error(error.response.status);
            console.error(error.response.data.error);
        }
    });
    const { mutate: deleteUser } = useDeleteUser({
        onSuccess: () => {
            rePetch('/users');
            setLoadingDeleteUser(null);
        },
        onError: (error) => {
            setLoadingDeleteUser(null);
            console.error(error.response.status);
            console.error(error.response.data.error);
        },
    });

    const { mutate: deleteProject } = useDeleteProject({
        onSuccess: (res) => {
            rePetch('/projects');
            setLoadingDeleteUser(null);
        },
        onError: (error) => {
            setLoadingDeleteUser(null);
            console.error(error.response.status);
            console.error(error.response.data.error);
        },
    });


    const handleRoleChange = (id, role) => {
        setLoadingRole(id);
        const newRole = role === 'admin' ? 'user' : 'admin';
        updateRole({ body: { "role": newRole }, id });
    };


    return (
        <div className="bg-[#161618] rounded-lg flex-1 h-full overflow-hidden">
            <p className="w-full text-center p-2 text-white text-md">{title}</p>
            <ScrollArea className="p-2 h-full">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-[#1B1B1F]">
                            {columns.map((col, idx) => (
                                <TableHead key={idx} className={col.className || ""}>{col.label}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isLoading && data?.length > 0 ? (
                            data.map((item, idx) => (
                                <TableRow key={item.id || idx} className="hover:bg-[#1B1B1F]">
                                    {columns.map((col, colIdx) => (
                                        <TableCell key={colIdx} className={col.className || ""}>
                                            {col.render
                                                ? col.render(item, idx)
                                                : col.action ? (
                                                    user?.id !== item.id ?
                                                        isProject ? <div className="flex gap-2 justify-end">
                                                            <Button onClick={() => router.push(`/dashboard/projects/${item.id}`)} variant="outline" size="icon" className="bg-[#161618] hover:bg-[#000000]">
                                                                <Eye color="white" />
                                                            </Button>
                                                            {user?.role === 'admin' && <>
                                                                <Button onClick={() => router.push(`/dashboard/projects/create-project?id=${item.id}`)} variant="outline" size="icon" className="bg-[#161618] hover:bg-[#000000]">
                                                                    <FilePenLine color="white" />
                                                                </Button>
                                                                <Button disabled={loadingDeleteUser === item.id} onClick={() => { setLoadingDeleteUser(item.id); deleteProject({ id: item.id }) }} variant="outline" size="icon" className="bg-[#161618] hover:bg-[#000000]">
                                                                    {loadingDeleteUser === item.id ? <Loader2 className="animate-spin" /> : <Trash color="white" />}
                                                                </Button>
                                                            </>}
                                                        </div> :
                                                            <div className="flex gap-2 justify-end">
                                                                <Button disabled={loadingRole === item.id} onClick={() => handleRoleChange(item.id, item.role)} variant="outline" size="icon" className="bg-[#161618] hover:bg-[#000000]">
                                                                    {loadingRole === item.id ? <Loader2 className="animate-spin" color="white" /> : item.role === 'admin' ? <ShieldCheck color="white" /> : <User color="white" />}
                                                                </Button>
                                                                <Button disabled={loadingDeleteUser === item.id} onClick={() => { setLoadingDeleteUser(item.id); deleteUser({ id: item.id }) }} variant="outline" size="icon" className="bg-[#161618] hover:bg-[#000000]">
                                                                    {loadingDeleteUser === item.id ? <Loader2 className="animate-spin" /> : <Trash color="white" />}
                                                                </Button>
                                                            </div>
                                                        : (
                                                            <span className="text-gray-500">it's you</span>
                                                        )
                                                ) : (
                                                    item[col.key]
                                                )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center text-white hover:bg-[#1B1B1F]">
                                    {isLoading ? "Loading..." : "No data available"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
