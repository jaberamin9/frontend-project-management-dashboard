import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export const project = async (id) => {
    return axios.get(`/projects/${id}`).then((res) => res.data);
};

export function useProject(config, id) {
    return useQuery({
        queryKey: ["project"],
        queryFn: () => project(id),
        ...config,
    });
}