
import { cookieBasedClient, isAuthenticated } from "@/utils/amplify-utils";


export default async function Home() {
  try {


    return (
      <main className="flex flex-col items-center justify-between p-24">
        <h1 className="text-2xl pb-10">Welcome to Bike Akinator!!!!</h1>
      </main>

    );
  }
  catch (error) {
    console.log("errorr in home" + error);
  }
}
