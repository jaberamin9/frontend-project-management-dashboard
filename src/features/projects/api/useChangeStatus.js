import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

const changeStatus = async (body) => {
    return axios.patch(`/projects/change-project-status/${body.id}`, body.body).then((res) => res.data);
};

export function useChangeStatus(config) {
    return useMutation({
        mutationKey: ["changeStatus"],
        mutationFn: (body) => changeStatus(body),
        ...config,
    });
}