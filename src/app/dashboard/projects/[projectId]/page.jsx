"use client";
import React, { useState } from 'react'
import { Header } from '@/features/dashboard/components/header';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useParams } from 'next/navigation';
import { useProject } from '@/features/projects/api/useProject';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useChangeStatus } from '@/features/projects/api/useChangeStatus';
import { useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSubmitProject } from '@/features/projects/api/useSubmitProject';
import { ScrollArea } from '@/components/ui/scroll-area';


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

export default function DetailsProject() {
    const { projectId } = useParams();
    const { user } = useAuth();
    const [projectUrl, setProjectUrl] = useState('');
    const query = useQueryClient();

    const { data, isLoading } = useProject({ enabled: !!user }, projectId);

    const { mutate: changeStatus, isPending } = useChangeStatus({
        onSuccess: (res) => query.invalidateQueries('project'),
        onError: (error) => {
            console.error(error.response.status);
            console.error(error.response.data.error);
        }
    });

    const { mutate: submitProject, isPending: loading } = useSubmitProject({
        onSuccess: (res) => query.invalidateQueries('project'),
        onError: (error) => {
            console.error(error.response.status);
            console.error(error.response.data.error);
        }
    });

    return (
        <main className="flex-1 px-3 sm:px-5 h-screen flex flex-col overflow-hidden">
            <Header user={user} />
            <div className='gap-6 py-4 flex-1 flex flex-col min-h-0'>
                {!data ?
                    <div className='flex justify-center items-center w-full'><Loader2 color='white' size={32} className="animate-spin" /></div> :
                    <ScrollArea className="p-2 h-full">
                        <div className='w-full'>
                            <div className='flex justify-between items-start sm:items-center flex-col sm:flex-row'>
                                <div className='mb-3 sm:mb-0'>
                                    <p className='text-white text-sm'>Created At: <span>{formattedDate(data.createdAt)}</span></p>
                                    <h1 className='text-white text-2xl sm:text-3xl font-bold pt-0 sm:pt-2'>{data.title}</h1>
                                </div>
                                <div>
                                    <p className='text-white text-sm'>Due Date: <span>{formattedDate(data.dueDate)}</span></p>
                                    {user?.role === 'admin' ?
                                        <RadioGroup
                                            onValueChange={(val) => changeStatus({ body: { status: val }, id: projectId })}
                                            defaultValue={data.status}
                                            className="flex gap-4 mt-2"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Active" id="r1" className="text-white border-white" />
                                                <Label htmlFor="r1" className="text-white">Active</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Completed" id="r2" className="text-white border-white" />
                                                <Label htmlFor="r2" className="text-white">Completed</Label>
                                            </div>
                                        </RadioGroup>
                                        : <h1 className='text-white text-end'>{data.status}</h1>
                                    }
                                </div>
                            </div>
                            <p className='py-4 text-white text-md'>{data.description}</p>
                            {data.status !== 'Active' && (
                                <div>
                                    <hr></hr>
                                    <p className='text-white pb-3 mt-2'>Project is submitted by developer</p>
                                    <a className='px-6 p-2 bg-[#083EC9] text-white rounded-sm' target='_blank' href={data.projectUrl}>View</a>
                                </div>
                            )}
                            {data.status === 'Active' && user?.role === 'user' && (
                                <div>
                                    <hr></hr>
                                    <div className="grid w-full items-center gap-1.5 mt-4">
                                        <Label htmlFor="url" className="text-white">Enter yorr submitted project url</Label>
                                        <Input value={projectUrl} onChange={(val) => setProjectUrl(val.target.value)} type="text" id="url" placeholder="URL" />
                                        <Button onClick={() => {
                                            submitProject({ body: { projectUrl: projectUrl }, id: projectId });
                                        }} className="bg-[#083EC9] mt-2" disabled={loading}>
                                            {loading ? <Loader2 color='white' className="animate-spin" /> : undefined}
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {data.assignedUsers.length != 0 && (
                                <div className='mt-6'>
                                    <hr></hr>
                                    <p className='text-white pb-3 mt-2'>Assigned Developer</p>
                                    {data.assignedUsers.map((item, index) => (
                                        <div key={item.user.email} className='flex items-center gap-4 hover:bg-[#161618] w-auto border-b-[1px]'>
                                            <p className='text-white px-3 py-2'>{index + 1}</p>
                                            <p className='text-white px-3 py-2'>{item.user.name}</p>
                                            <p className='text-white px-3 py-2 hidden sm:block'>{item.user.email}</p>
                                            <p className='text-white px-3 py-2'>{item.user.role}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                }
            </div>
        </main>
    );
}
