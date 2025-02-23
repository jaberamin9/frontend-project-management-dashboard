import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export const getActiveUser = async () => {
    return axios.get("/auth/me").then((res) => res.data);
};

export function useActiveUser(config) {
    return useQuery({
        queryKey: ["activeUser"],
        queryFn: () => getActiveUser(),
        ...config,
    });
}