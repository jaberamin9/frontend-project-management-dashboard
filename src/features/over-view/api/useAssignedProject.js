import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export const assignedProject = async (user) => {
    return axios.get(`/projects/user/${user.id}?sortBy=dueDate&page=1&limit=3&order=desc&status=Active`).then((res) => res.data);
};

export function useAssignedProject(config, user) {
    return useQuery({
        queryKey: ["assignedProject"],
        queryFn: () => assignedProject(user),
        ...config,
    });
}