import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export const getStats = async (user) => {
    const url = user?.role === 'user' ? `/stats/${user.id}` : '/stats';
    return axios.get(url).then((res) => res.data);
};

export function useStats(config, user) {
    return useQuery({
        queryKey: ["stats"],
        queryFn: () => getStats(user),
        ...config,
    });
}