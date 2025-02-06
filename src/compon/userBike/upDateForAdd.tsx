"use client"
import { useState } from "react";
import BikeInputForm from "./BikeInputForm";



export default function UpdateForAdd() {
  const [addingNewBike, setAddingNewBike] = useState(false);

  const handleAddBike = () => {
    setAddingNewBike(true);
  };

  return (
    <div>{addingNewBike ? <BikeInputForm /> : <button onClick={handleAddBike}>Add Bike</button>}</div>
  )
}