"use client";
import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';

export function TableFooter({ filters, setFilters, data, name }) {

    return (
        <div className='flex justify-between items-center mt-3 flex-col sm:flex-row'>
            <div className='flex flex-1 justify-between items-center gap-3'>
                <p className='text-white text-sm sm:text-md'>{"Total " + (name === "users" ? data?.totalUsers : data?.totalProjects) + " entries"}</p>
                <div className='flex gap-2 justify-between items-center'>
                    <p className='text-white text-sm sm:text-md'>Rows per page</p>
                    <Select value={filters.limit} onValueChange={(val) => setFilters((pre) => ({ ...pre, limit: val }))} >
                        <SelectTrigger className="w-auto h-8 bg-[#1B1B1F] text-white">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="30">30</SelectItem>
                                <SelectItem value="40">40</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='flex flex-1 gap-2 items-center justify-end mt-3 sm:mt-0'>
                <Button
                    onClick={() => setFilters((pre) => ({
                        ...pre, page: Math.max(Number(pre.page) - 1, 1) + ""
                    }))}
                    disabled={Number(filters.page) === 1}
                    className="h-9 hover:bg-white hover:text-black">Previous</Button>
                <p className='px-3 py-1 text-white'>{filters.page}</p>
                <Button
                    onClick={() => setFilters((pre) => ({
                        ...pre,
                        page: Math.min(Number(pre.page) + 1, data?.totalPages) + ""
                    }))}
                    disabled={filters.page >= data?.totalPages}
                    className="h-9 hover:bg-white hover:text-black">Next</Button>
            </div>
        </div>
    )
}
