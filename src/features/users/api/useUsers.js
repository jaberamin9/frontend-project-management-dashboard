import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export const users = async (url) => {
    return axios.get(url).then((res) => res.data);
};

export function useUsers(config, url) {
    return useQuery({
        queryKey: ["users"],
        queryFn: () => users(url),
        ...config,
    });
}