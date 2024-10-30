import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Button,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { cookieBasedClient } from "@/utils/amplify-utils"
import "@aws-amplify/ui-react/styles.css";
import "./profile.css";
import { DataStore } from "@aws-amplify/datastore";
import * as DBWork from "../_actions/actions"
import { Amplify } from "aws-amplify";
import {UserProfile, Bike as BikeType} from '../../compon/interfaces'
import Bike from "../../compon/Bike"
import { isAuthenticated } from "@/utils/amplify-utils";
import { getUser } from "@/utils/amplify-utils";

export default async function Login() {
    const user  = getUser();
    // State declarations with types
    const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
    const [localUserProfiles, setLocalUserProfiles] = useState<UserProfile[]>([]);
    const [userBikes, setUserBikes] = useState<BikeType[]>([]);
    const { signOut } = useAuthenticator((context) => [context.user]);
  
    // Profile info inputs
   
    const [bikeNumber, setBikeNumber] = useState<number>(-1);
    const [bikeBrand, setBikeBrand] = useState<string>("");
    const [bikeModel, setBikeModel] = useState<string>("");
    const [bikeYear, setBikeYear] = useState<number>(0);
    const [bikeSold, setBikeSold] = useState<boolean>(false);
    const [bikeScore, setBikeScore] = useState<number>(0.0);
    const [bikeBroken, setBikeBroken] = useState<boolean>(false);
    const [monthsOwned, setMonthsOwned] = useState<number>(0);
  
    // Frontend status variables
    const [addingNewBike, setAddingPage] = useState<boolean>(false);
    const [update, setUpdatePage] = useState<boolean>(false);
  
    // Input change handlers with typed events
   
    
    const handleBikeNumber = (event: ChangeEvent<HTMLInputElement>) => {
      setBikeNumber(parseInt(event.target.value, 10));
    };
  
    const handleBikeBrand = (event: ChangeEvent<HTMLInputElement>) => {
      setBikeBrand(event.target.value);
    };
  
    const handleBikeModel = (event: ChangeEvent<HTMLInputElement>) => {
      setBikeModel(event.target.value);
    };
  
    const handleBikeYear = (event: ChangeEvent<HTMLInputElement>) => {
      setBikeYear(parseInt(event.target.value, 10));
    };
  
    const handleBikeSold = (event: ChangeEvent<HTMLSelectElement>) => {
      setBikeSold(event.target.value === "Yes");
    };
  
    const handleBikeScore = (event: ChangeEvent<HTMLInputElement>) => {
      setBikeScore(parseFloat(event.target.value));
    };
  
    const handleBikeBroken = (event: ChangeEvent<HTMLSelectElement>) => {
      setBikeBroken(event.target.value === "Yes");
    };
  
    const handleMonthsOwned = (event: ChangeEvent<HTMLInputElement>) => {
      setMonthsOwned(parseInt(event.target.value, 10));
    };
  
    // Handler to set the page to "add a new bike" mode
    const handleAddBike = () => {
      setAddingPage(true);
    };
  
    // Handler to remove a bike
    const handleRemove = async (bike: BikeType) => {
      await DataStore.delete(bike);
      setUpdatePage(!update);
    };
  
    // Save button handler after a bike is added
    const handleSaveBike = async (event: FormEvent) => {
      event.preventDefault();
      const myProfile: UserProfile = localUserProfiles[0];
      console.log("localProf" + JSON.stringify(myProfile));
  
      const bikeData: BikeType = {
        bikeNumber,
        brand: bikeBrand,
        model: bikeModel,
        year: bikeYear,
        sold: bikeSold,
        broken: bikeBroken,
        ownershipMonths: monthsOwned,
        score: bikeScore,
        userId: myProfile.id || '',
      };
  
      // Push to backend
      const success = await DBWork.createNewBike(bikeData);
      if (success) {
        restoreBikeSettingDefaults();
        DBWork.updateAllBikeStats(bikeData);
      }
    };
  
    // Reset form after saving
    const restoreBikeSettingDefaults = () => {
      setBikeBrand("");
      setBikeBroken(false);
      setBikeModel("");
      setBikeNumber(-1);
      setBikeScore(0.0);
      setBikeSold(false);
      setBikeYear(0);
      setMonthsOwned(0);
      setAddingPage(false);
      setUpdatePage(!update);
    };
    DBWork.checkForProfile();
    
    //grab the bikes for the user
    const userId: string = await DBWork.fetchUserId(); 
    const { data: bikes} = await cookieBasedClient.models.Bike.list({
      filter: {userId: {eq: userId}},
      selectionSet:["bikeNumber","brand","model","year","sold","broken","ownershipMonths","score","id","userId"],
    });

  
  
    // Helper to display user bikes
    const displayUserBikes = () => {
      return (
        <View>
          {bikes.map(async(userBike, idx) => (
            <Bike
            onDelete={DBWork.onDeleteBike}
            bike={userBike}
            key={idx}
            isSignedIn={await isAuthenticated()}
            />
          ))}
        </View>
      );
    };
  
    // Helper to display input form for adding a new bike
    const displayNewBikeInputForm = () => {
      return (
        <View>
          {/* Form fields */}
          
          <Button onClick={handleSaveBike}>Save Bike</Button>
        </View>
      );
    };
  
    return (
      <Flex className="App" justifyContent="center" alignItems="center" direction="column" width="70%" margin="0 auto">
        <Heading level={1}>My Profile</Heading>
        <Divider />
        <Grid margin="3rem 0" autoFlow="column" justifyContent="center" gap="2rem" alignContent="center">
          {userProfiles.map((userProfile) => (
            <Flex key={userProfile.id} direction="column" justifyContent="center" alignItems="center" gap="2rem" border="1px solid #ccc" padding="2rem" borderRadius="5%" className="box">
              <View>
                <Heading level={3}>{userProfile.id}</Heading>
                <View>{displayUserBikes()}</View>
                <View>{addingNewBike ? displayNewBikeInputForm() : <Button onClick={handleAddBike}>Add Bike</Button>}</View>
              </View>
            </Flex>
          ))}
        </Grid>
        <Button onClick={signOut}>Sign Out</Button>
      </Flex>
    );
  }
  