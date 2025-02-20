"use client"

import { useState, useEffect, useTransition, } from 'react';
import Link from "next/link";
import { Button, Divider, Flex } from "@aws-amplify/ui-react";
import { signOut, } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Hub } from "aws-amplify/utils";
import { revalidatePath } from 'next/cache';
import Image from "next/image"
import "./NavStyle.css"
const logoImg = "/logo.svg";

export default function NavBar({ isSignedIn }: { isSignedIn: boolean }) {
    const [authCheck, setAuthCheck] = useState(isSignedIn);
    const [, startTransition] = useTransition();
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();
    const [activeLink, setActive] = useState("Home");

    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            }
            else {
                setScrolled(false);
            }
        }

        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll);
    }, [])
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
                    //console.log("here");
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

    //signout/sign in handler
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

    const onUpdateActive = (value: string) => {
        setActive(value);
    }

    //filters routes by what is allowed to be accessed
    const routes = defaultRoutes.filter(
        (route) => route.loggedIn === authCheck || route.loggedIn === undefined);
    //console.log("here 6" + isSignedIn);
    return (
        <div className={scrolled ? "scrolled" : ""}>
            <div className="navbar"
            >

                <Flex className={scrolled ? "scrolled" : ""} as="nav">
                    <Link className="navbar-brand" href="/">
                        <Image
                            src={logoImg}
                            width="100"
                            height="200"
                            className=""
                            alt="Logo" />
                        <span className="fw-bolder fs-4">Bike Akinator</span>
                    </Link>
                    {routes.map((route) => (
                        <Link className={(activeLink === route.label) ? "active-navbar-link" : "navbar-link"} key={route.href} href={route.href} onClick={() => onUpdateActive(route.label)}>
                            {route.label}
                        </Link>
                    ))}
                    <Button
                        variation="primary"
                        margin-left="auto"
                        borderRadius="2rem"
                        className="navbar-button"
                        onClick={signOutSignIn}>
                        {authCheck ? "Sign Out" : "Sign In"}
                    </Button>
                </Flex>
            </div>
            <Divider size="small"></Divider>
        </div>
    )
}

