import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

const deleteUser = async (body) => {
    return axios.delete(`/users/${body.id}`, body.body).then((res) => res.data);
};

export function useDeleteUser(config) {
    return useMutation({
        mutationKey: ["deleteUser"],
        mutationFn: (body) => deleteUser(body),
        ...config,
    });
}