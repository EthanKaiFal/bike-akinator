
import { cookieBasedClient } from "@/utils/amplify-utils"
import "@aws-amplify/ui-react/styles.css";
import * as DBWork from "../_actions/actions"
import Bike from "../../compon/Bike"
import { isAuthenticated } from "@/utils/amplify-utils";
import Auth from "@aws-amplify/auth";
import { getUserName } from "@/utils/amplify-utils";
import { revalidatePath } from "next/cache";
import Link from "next/link";



export default async function Login() {
   
    DBWork.checkForProfile();
    
    //grab the bikes for the user
    const userId: string = await DBWork.fetchUserId(); 
    const { data: bikes} = await cookieBasedClient.models.Bike.list({
      filter: {userId: {eq: userId}},
      selectionSet:["bikeNumber","brand","model","year","sold","broken","ownershipMonths","score","id","userId"],
    });

  //   async function getUserEmail(): Promise<string | undefined> {
  //     const { user } = useAuthenticator((context) => [context.user]);
  //     return user.username
  // }
  
    // Helper to display user bikes
    const displayUserBikes = () => {
      return (
        <div className="w-full">
          {bikes.map(async(userBike, idx) => (
            <Bike
            onDelete={DBWork.onDeleteBike}
            bike={userBike}
            key={idx}
            isSignedIn={await isAuthenticated()}
            />
          ))}
        </div>
      );
    };
  
  
    return (
      <div className="App" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "70%", margin: "0 auto" }}>
        <h1 >My Profile</h1>
        <hr style={{ width: "100%", marginBottom: "1rem" }} /> {/* Divider replacement */}
        <div style={{ display: "grid", gridAutoFlow: "column", justifyContent: "center", gap: "2rem", alignContent: "center", margin: "3rem 0" , maxWidth:"100%"}}>
        <div key={userId} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "2rem", border: "1px solid #ccc", padding: "2rem", borderRadius: "5%" , maxWidth:"100%", width:"100%"}} className="box">
              <div className="w-full">
                <h3>{await getUserName()}</h3>
                <div>{displayUserBikes()}</div>
                <Link style={{display: "flex", justifyContent: "center", paddingTop:12, paddingBottom:0}} key={"/add"} href={"/add"}>
                            {"Add Bike"}
                        </Link>
              </div>
            </div>
        </div>
      </div>
    );
  }
  