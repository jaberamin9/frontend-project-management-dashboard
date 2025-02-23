import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

const submitProject = async (body) => {
    return axios.patch(`/projects/submit-project/${body.id}`, body.body).then((res) => res.data);
};

export function useSubmitProject(config) {
    return useMutation({
        mutationKey: ["submitProject"],
        mutationFn: (body) => submitProject(body),
        ...config,
    });
}