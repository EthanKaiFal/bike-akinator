"use server"
import Bikes from "../../compon/showingAllBikes/bikes"
import "../../compon/showingAllBikes/bikes.css"
// Define the types for bikeModels and other state


export default async function BikesPage() {


  return (
    <div className="background">
      <Bikes></Bikes>
    </div>
  );
}
