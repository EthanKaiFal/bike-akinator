
import { cookieBasedClient, isAuthenticated } from "@/utils/amplify-utils"
import "@aws-amplify/ui-react/styles.css";
import * as DBWork from "../_actions/actions"
import { Bike as BikeType } from "../../compon/interfaces"
import "../../compon/userBike/profilePage.css"
import { getUserName } from "@/utils/amplify-utils";
import ProfileBikes from "@/compon/userBike/profileBikes";




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

  const bikesList: BikeType[] = bikes as BikeType[];





  return (
    <div className="background">
      <h1 className="profile-title">{`${await getUserName()}'s Bikes`}</h1>
      {/* <hr style={{ width: "100%", marginBottom: "1rem" }} /> Divider replacement */}
      <div className="profile-container">
        <div key={userId}  >
          <ProfileBikes
            bikes={bikesList}
            isAuth={await isAuthenticated()}></ProfileBikes>
        </div>
      </div>
    </div>
  );
}
