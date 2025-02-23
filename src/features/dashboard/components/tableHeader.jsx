
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function TableHeader({ filters, setFilters, name }) {

    return (
        <div className='flex flex-col sm:flex-row items-center gap-3'>
            <div>
                <Input
                    placeholder="search"
                    value={filters.search}
                    onChange={(val) => setFilters((prev) => ({ ...prev, search: val.target.value }))}
                    className="w-full px-3 py-2 rounded-md border-white bg-[#161618] h-[36px] text-white"
                />
            </div>
            <div className='flex items-center gap-3'>
                <Select value={filters.sortBy} onValueChange={(val) => setFilters((pre) => ({ ...pre, sortBy: val }))} >
                    <SelectTrigger className="w-auto h-[36px] bg-[#1B1B1F] text-white">
                        <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="id">Default</SelectItem>
                            <SelectItem value={name == "users" ? "name" : "title"}>{name == "users" ? "Name" : "Title"}</SelectItem>
                            <SelectItem value="createdAt">Created At</SelectItem>
                            <SelectItem value={name == "users" ? "email" : "dueDate"}>{name == "users" ? "Email" : "Due Date"}</SelectItem>
                            <SelectItem value={name == "users" ? "role" : "status"}>{name == "users" ? "Role" : "Status"}</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select value={filters.order} onValueChange={(val) => setFilters((pre) => ({ ...pre, order: val }))} >
                    <SelectTrigger className="w-auto h-[36px] bg-[#1B1B1F] text-white">
                        <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="asc">ASC</SelectItem>
                            <SelectItem value="desc">DESC</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select value={filters.status} onValueChange={(val) => setFilters((pre) => ({ ...pre, [name == "users" ? "role" : "status"]: val }))} >
                    <SelectTrigger className="w-auto h-[36px] bg-[#1B1B1F] text-white">
                        <SelectValue placeholder={name == "users" ? "All Role" : "All Status"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value=" ">{name == "users" ? "All Role" : "All Status"}</SelectItem>
                            <SelectItem value={name == "users" ? "admin" : "Active"}>{name == "users" ? "Admin" : "Active"}</SelectItem>
                            <SelectItem value={name == "users" ? "user" : "Review"}>{name == "users" ? "User" : "Review"}</SelectItem>
                            {name != "users" && <SelectItem value="Completed">Completed</SelectItem>}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
