import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

const updateProject = async (body) => {
    return axios.put(`/projects/${body.id}`, body.body).then((res) => res.data);
};

export function useUpdateProject(config) {
    return useMutation({
        mutationKey: ["updateProject"],
        mutationFn: (body) => updateProject(body),
        ...config,
    });
}