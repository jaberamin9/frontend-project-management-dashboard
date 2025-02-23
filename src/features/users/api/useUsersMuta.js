import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

const usersMuta = async (url) => {
    return axios.get(url).then((res) => res.data);
};

export function useUsersMuta(config) {
    return useMutation({
        mutationKey: ["usersMuta"],
        mutationFn: (url) => usersMuta(url),
        ...config,
    });
}