"use client";
import React, { useEffect, useState } from "react";
import { Header } from "@/features/dashboard/components/header";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateProject } from "@/features/create-project/api/useCreateProject";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import MultipleSelector from '@/components/ui/multiple-selector';
import { useUsers } from "@/features/users/api/useUsers";
import { useProject } from "@/features/projects/api/useProject";
import { useUpdateProject } from "@/features/create-project/api/useUpdateProject";
import { ScrollArea } from "@/components/ui/scroll-area";


const projectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    dueDate: z.date({ required_error: "Due Date is required" }),
    assignedUsers: z.array(z.string().uuid("Invalid user ID")).min(1, "At least one user must be assigned"),
});

const url = '/users?sortBy=createdAt&order=desc';

export default function CreateProject() {
    const { user } = useAuth();
    const query = useQueryClient();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const router = useRouter();
    const [option, setOption] = useState([]);

    const { data } = useUsers({ enabled: !!user && user?.role === "admin" }, url);
    useEffect(() => {
        if (data) {
            setOption(data.users.map((item) => ({ label: item.email, value: item.id })));
        }
    }, [data]);

    const { data: project } = useProject({ enabled: !!id }, id);
    useEffect(() => {
        if (project) {
            reset({
                title: project.title,
                description: project.description,
                dueDate: project.dueDate,
                assignedUsers: project.assignedUsers.map(item => (item.userId)),
            });
        }
    }, [project]);

    const { mutate: createProject, isPending } = useCreateProject({
        onSuccess: () => {
            query.invalidateQueries("projects");
            router.replace("/dashboard/projects");
        },
        onError: (error) => {
            console.error(error.response?.status);
            console.error(error.response?.data?.error);
        },
    });

    const { mutate: updateProject, isPending: pending } = useUpdateProject({
        onSuccess: () => {
            query.invalidateQueries("projects");
            router.replace("/dashboard/projects");
        },
        onError: (error) => {
            console.error(error.response?.status);
            console.error(error.response?.data?.error);
        },
    });

    const { register, handleSubmit, formState: { errors }, setValue, watch, control, reset } = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: "",
            description: "",
            dueDate: null,
            assignedUsers: [],
        }
    });

    const dueDate = watch("dueDate");

    const handleDateSelect = (date) => {
        setValue("dueDate", date);
    };

    const onSubmit = (data) => {
        if (id) {
            updateProject({ body: { ...data, dueDate: data.dueDate.toISOString() }, id });
        } else {
            createProject({ ...data, dueDate: data.dueDate.toISOString() });
        }
    };

    return (
        <main className="flex-1 px-3 sm:px-5 h-screen flex flex-col overflow-hidden">
            <Header user={user} />
            <div className=" text-white py-4 flex-1 flex flex-col min-h-0">
                <p className=" text-white font-semibold text-2xl sm:text-3xl mb-4">{id == null ? 'Create a New Project' : 'Update Existing Project'}</p>
                <ScrollArea className="p-2 h-full">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="block text-sm mb-1">Title</label>
                                <Input
                                    placeholder="Enter Title"
                                    {...register("title")}
                                    className="w-full px-3 py-2 rounded border-white bg-[#161618] h-[48px] text-white"
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm mb-1">Due Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal border-white bg-[#161618] h-[48px] text-white",
                                                !dueDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2" />
                                            {dueDate ? format(dueDate, "P") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={dueDate} onSelect={handleDateSelect} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Description</label>
                            <Textarea
                                placeholder="Enter Description"
                                {...register("description")}
                                className="w-full px-3 py-2 min-h-[250px] rounded border-white bg-[#161618] text-white"
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Assign Developer</label>
                            <Controller
                                name="assignedUsers"
                                control={control}
                                render={({ field }) => (
                                    <MultipleSelector
                                        {...field}
                                        options={option}
                                        hideClearAllButton
                                        placeholder="Select developer you like..."
                                        emptyIndicator={
                                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                                No developer found.
                                            </p>
                                        }
                                        className="h-[48px] bg-[#161618] text-white overflow-hidden"
                                        onChange={(val) => field.onChange(val.map((item) => item.value))}
                                        value={option.filter((o) => field.value?.includes(o.value))}
                                    />
                                )}
                            />
                            {errors.assignedUsers && <p className="text-red-500 text-sm mt-1">{errors.assignedUsers.message}</p>}
                        </div>

                        <Button type="submit" className="w-full bg-[#083EC9]" disabled={isPending}>
                            {isPending || pending ? <Loader2 color='white' className="animate-spin" /> : undefined}
                            {id == null ? 'Create Project' : 'Update Project'}
                        </Button>
                    </form>
                </ScrollArea>
            </div>
        </main>
    );
}
