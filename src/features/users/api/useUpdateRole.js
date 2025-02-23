import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

const updateRole = async (body) => {
    return axios.patch(`/users/${body.id}/role`, body.body).then((res) => res.data);
};

export function useUpdateRole(config) {
    return useMutation({
        mutationKey: ["updateRole"],
        mutationFn: (body) => updateRole(body),
        ...config,
    });
}