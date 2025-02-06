"use client"

import { useState, useEffect, useTransition, } from 'react';
import Link from "next/link";
import { Button, Divider, Flex } from "@aws-amplify/ui-react";
import { signOut, } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Hub } from "aws-amplify/utils";
import { revalidatePath } from 'next/cache';


export default function NavBar({ isSignedIn }: { isSignedIn: boolean }) {
    const [authCheck, setAuthCheck] = useState(isSignedIn);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        const hubListenerCancel = Hub.listen("auth", (data) => {
            switch (data.payload.event) {
                case "signedIn":
                    setAuthCheck(true);
                    startTransition(() => router.push("/"));
                    startTransition(() => router.refresh());
                    revalidatePath("/profile");
                    router.push("/");
                    break;
                case "signedOut":
                    console.log("here");
                    setAuthCheck(false);
                    startTransition(() => router.push("/"));
                    startTransition(() => router.refresh());
                    revalidatePath("/profile");
                    router.push("/");
                    break;
            }
        });
        return () => hubListenerCancel();

    }, [router]);
    const signOutSignIn = async () => {
        if (authCheck) {
            await signOut();
        }
        else {
            router.push("/signIn");
        }
    }
    const defaultRoutes = [
        {
            href: "/",
            label: "Home"
        },
        {
            href: "/profile",
            label: "Profile",
            loggedIn: true, //makes it so this route only works when logged in

        },
        {
            href: "/bikes",
            label: "Bikes",
        }

    ];

    const routes = defaultRoutes.filter(
        (route) => route.loggedIn === authCheck || route.loggedIn === undefined);
    console.log("here 6" + isSignedIn);
    return (
        <>
            <Flex
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                padding={"1rem"}
            >

                <Flex as="nav" alignItems="center" gap="3rem" margin="0 2rem">
                    {routes.map((route) => (
                        <Link key={route.href} href={route.href}>
                            {route.label}
                        </Link>
                    ))}
                </Flex>
                <Button
                    variation="primary"
                    borderRadius="2rem"
                    className="mr-4"
                    onClick={signOutSignIn}>
                    {authCheck ? "Sign Out" : "Sign In"}
                </Button>
            </Flex>
            <Divider size="small"></Divider>
        </>
    )
}

