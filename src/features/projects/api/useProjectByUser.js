import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

const projectByUser = async (url) => {
    return axios.get(url).then((res) => res.data);
};

export function useProjectByUser(config) {
    return useMutation({
        mutationKey: ["projectByUser"],
        mutationFn: (url) => projectByUser(url),
        ...config,
    });
}