import { cookieBasedClient } from "@/app/utils/amplify-utils";
import { isAuthenticated } from "@/app/utils/amplify-utils";

const Posts = async({params}: { params: { id: string}}) => {
    if(!params.id) return null;
    const isSignedIn = await isAuthenticated();
    const {data: post } = await cookieBasedClient.models.Post.get({
        id: params.id,
    },
{
    selectionSet: ["id", "title"],
}
);

return (
    <div className="flex flex-col items-center p-4 gap-4">
        <h1 className="text-2xl font bold"> Post Information:</h1>
        <div className="border rounded w-1/2 m-auto bg-gray-200 p-4 ">
            <h2>Title: {post?.title}</h2>
        </div>
        <h1 className="text-xl font-bold">Comments:</h1>
    </div>
    
);
};

export default Posts;