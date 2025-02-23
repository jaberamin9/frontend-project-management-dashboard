import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

const signIn = async (body) => {
    return axios.post("/auth/sign-in", body).then((res) => res.data);
};

export function useSignIn(config) {
    return useMutation({
        mutationKey: ["signIn"],
        mutationFn: (body) => signIn(body),
        ...config,
    });
}