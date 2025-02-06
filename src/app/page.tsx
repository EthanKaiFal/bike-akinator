
import { cookieBasedClient, isAuthenticated } from "@/utils/amplify-utils";


export default async function Home() {
  var posts: any[] = [];
  try {
    if (await isAuthenticated()) {
      const { data: post, errors } = await cookieBasedClient.models.Post.list({
        selectionSet: ["title", "id"],


      })
      posts = post;
      if (errors) {
        console.log("home has errors");
      }
    }
    else {
    }
    console.log("here 8");

    return (
      <main className="flex flex-col items-center justify-between p-24">
        <h1 className="text-2xl pb-10">List Of ALL Titles</h1>
      </main>

    );
  }
  catch (error) {
    console.log("errorr in home" + error);
  }
}
