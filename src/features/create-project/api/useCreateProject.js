import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

const createProject = async (body) => {
    return axios.post('/projects', body).then((res) => res.data);
};

export function useCreateProject(config) {
    return useMutation({
        mutationKey: ["createProject"],
        mutationFn: (body) => createProject(body),
        ...config,
    });
}