import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export const latestUser = async () => {
    return axios.get('/users?sortBy=createdAt&page=1&limit=5&order=desc').then((res) => res.data);
};

export function useLatestUser(config) {
    return useQuery({
        queryKey: ["latestUser"],
        queryFn: () => latestUser(),
        ...config,
    });
}