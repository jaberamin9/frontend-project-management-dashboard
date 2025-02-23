import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

const deleteProject = async (body) => {
    return axios.delete(`/projects/${body.id}`, body.body).then((res) => res.data);
};

export function useDeleteProject(config) {
    return useMutation({
        mutationKey: ["deleteProject"],
        mutationFn: (body) => deleteProject(body),
        ...config,
    });
}