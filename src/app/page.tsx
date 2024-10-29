import Post from "@/compon/Post";
import { cookieBasedClient, isAuthenticated } from "@/utils/amplify-utils";
import { onDeletePost } from "./_actions/actions";


export default async function Home() {
  const {data: posts} = await cookieBasedClient.models.Post.list({
    selectionSet:["title","id"],

    
  })
  //console.log("post",posts);
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-2xl pb-10">List Of ALL Titles</h1>
      {posts?.map(async (post, idx)=> (
        <Post
        onDelete={onDeletePost}
        post={post}
        key={idx}
        isSignedIn={await isAuthenticated()}
        />

        
      ))}
    </main>
   
  );
}
