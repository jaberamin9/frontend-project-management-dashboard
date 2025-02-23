"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSignIn } from "@/features/auth/api/useSignIn";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const signInSchema = z.object({
    email: z.string().trim().email("enter valide email"),
    password: z.string().trim().min(6, "password at least 6 digit"),
});

export default function LoginPage() {
    const { refetch } = useAuth();
    const router = useRouter();
    const [error, setError] = useState("");


    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(signInSchema),
    });

    function handleSigninSuccess({ token }) {
        localStorage.setItem("token", token);
        refetch();
        router.push("/dashboard/over-view");
    }

    const { mutate: signIn, isPending: loading } = useSignIn({
        onSuccess: handleSigninSuccess,
        onError: (error) => {
            setError(error.response.data.error);
            console.error(error.response.status);
            console.error(error.response.data.error);
        },
    });

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#161618]">
            <div className="w-full max-w-md bg-[#1B1B1F] p-6 rounded-lg shadow-md m-2">
                <h2 className="text-2xl font-bold text-center mb-4 text-white">Sign In</h2>
                <form onSubmit={handleSubmit((data) => signIn(data))} className="space-y-4">
                    <div>
                        <Input type="email" {...register("email")} placeholder="Email" required className="bg-[#161618] text-white" />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <Input type="password" {...register("password")} placeholder="Password" required className="bg-[#161618] text-white" />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full bg-[#083EC9]" disabled={loading}>
                        {loading ? <Loader2 color="white" className="animate-spin" /> : undefined}
                        Sign In
                    </Button>
                </form>
                <div className="flex items-center justify-center mt-4">
                    <Link href={'/auth/sign-up'} className="text-sm text-white">Go To Sign Up Page</Link>
                </div>
            </div>
        </div>
    );
}
