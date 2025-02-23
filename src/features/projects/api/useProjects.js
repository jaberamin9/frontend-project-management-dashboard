import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

const projects = async (url) => {
    return axios.get(url).then((res) => res.data);
};

export function useProjects(config) {
    return useMutation({
        mutationKey: ["projects"],
        mutationFn: (url) => projects(url),
        ...config,
    });
}