"use client";
import { createContext, useContext, useEffect, useState } from "react";

import { useActiveUser } from "../api/useActiveUser";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from 'lucide-react';


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);

    const { data, isError, refetch: refetchUser, isFetching } = useActiveUser({
        staleTime: Infinity,
        retry: 1,
    });

    useEffect(() => {
        if (data) {
            setUser(data);
        }
    }, [isFetching]);

    useEffect(() => {
        if (!user || !user.role) return;
        if (user?.role !== "admin" && (pathname.startsWith("/dashboard/users") || pathname.startsWith("/dashboard/projects/create-project"))) {
            router.replace("/dashboard/over-view");
        }
        if (pathname.endsWith("/") || pathname.endsWith("/dashboard") || pathname.endsWith("/auth/sign-in") || pathname.endsWith("/auth/sign-up")) {
            router.replace("/dashboard/over-view");
        }

    }, [user, pathname]);

    useEffect(() => {
        if (!isError) return;
        const excludedPaths = ["/auth/sign-up"];
        if (!excludedPaths.includes(pathname)) {
            router.push("/auth/sign-in");
        }
    }, [isError, pathname]);

    function refetch() {
        refetchUser();
    }


    function logout() {
        localStorage.removeItem("token");
        setUser(null);
        router.replace("/auth/sign-in");
    }

    if (isFetching) {
        return (
            <div className="h-screen flex justify-center items-center bg-[#1B1B1F]">
                <Loader2 color="white" className="animate-spin" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, logout, refetch }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    return context;
}
