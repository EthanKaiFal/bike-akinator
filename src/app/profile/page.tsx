
import { cookieBasedClient } from "@/utils/amplify-utils"
import "@aws-amplify/ui-react/styles.css";
import * as DBWork from "../_actions/actions"
import Bike from "../../compon/userBike/Bike"
import "../../compon/userBike/profilePage.css"
import { isAuthenticated } from "@/utils/amplify-utils";
import { getUserName } from "@/utils/amplify-utils";
import Link from "next/link";




export default async function Login() {
  // console.log("before");
  DBWork.checkForProfile();
  //console.log("yoooooooooo");
  //grab the bikes for the user
  const userId: string = await DBWork.fetchUserId();
  // console.log("supppp");
  const { data: bikes } = await cookieBasedClient.models.Bike.list({
    filter: { userId: { eq: userId } },
    selectionSet: ["bikeNumber", "brand", "model", "year", "sold", "broken", "ownershipMonths", "score", "id", "userId"],
  });

  //console.log("bike info grabbed" + JSON.stringify(bikes));

  //   async function getUserEmail(): Promise<string | undefined> {
  //     const { user } = useAuthenticator((context) => [context.user]);
  //     return user.username
  // }

  // Helper to display user bikes
  const displayUserBikes = () => {
    return (
      <div className="bikes-container">
        {bikes.map(async (userBike, idx) => (
          <div className="profile-card">
            <Bike
              onDelete={DBWork.onDeleteBike}
              bike={userBike}
              key={idx}
              isSignedIn={await isAuthenticated()}
            />
          </div>
        ))}
      </div>
    );
  };


  return (
    <div className="background">
      <h1 className="profile-title">{await getUserName()}'s Bikes</h1>
      {/* <hr style={{ width: "100%", marginBottom: "1rem" }} /> Divider replacement */}
      <div className="profile-container">
        <div key={userId}  >
          <div className="w-full">
            <div style={{ justifyContent: "center" }}>{displayUserBikes()}</div>
            <Link className="add-bike" key={"/add"} href={"/add"}>
              {"Add Bike"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
