import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

const signUp = async (body) => {
    return axios.post("/auth/sign-up", body).then((res) => res.data);
};

export function useSignUp(config) {
    return useMutation({
        mutationKey: ["signUp"],
        mutationFn: (body) => signUp(body),
        ...config,
    });
}