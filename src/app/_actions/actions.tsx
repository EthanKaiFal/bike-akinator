"use server"

import { cookieBasedClient } from "@/utils/amplify-utils"
import {redirect} from 'next/navigation';
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
    const {data, errors} = await cookieBasedClient.models.Post.create({
        title: formData.get("title")?.toString() || ""
})
    console.log(formData.get("title"));
    console.log(errors);
    redirect("/");
}

export async function onDeletePost(idName: string) {
    const toBeDeleted = {
        id: idName
    }
    const{data: deletedPost, errors} = await cookieBasedClient.models.Post.delete(toBeDeleted);

   // console.log("data deleted", deletedPost, errors);
    revalidatePath("/");
}