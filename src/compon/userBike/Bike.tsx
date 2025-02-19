"use client"
import React from "react";
import { Bike as BikeType } from "../interfaces"


const Bike = ({
    bike,
    onDelete,
    isSignedIn,
}: {
    bike: BikeType;
    onDelete: (id: string) => void;
    isSignedIn: boolean;
}) => {

    return (
        <div >
            <p className="bikeDisplayLine">Bike Number: {bike.bikeNumber}</p>
            <p className="bikeDisplayLine">Brand: {bike.brand}</p>
            <p className="bikeDisplayLine">Model: {bike.model}</p>
            <p className="bikeDisplayLine">Year: {bike.year}</p>
            <p className="bikeDisplayLine">Broken: {bike.broken ? "Yes" : "No"}</p>
            <p className="bikeDisplayLine">Sold: {bike.sold ? "Yes" : "No"}</p>
            <p className="bikeDisplayLine">Months Owned: {bike.ownershipMonths}</p>
            <p className="bikeDisplayLine">Bike Score: {bike.score}</p>
            {isSignedIn ? (
                <button className="text-red-500 cursor-pointer border bg-black-100" onClick={() => onDelete(bike.id)}>Remove</button>
            ) : null}
        </div>
    );
};

export default Bike;
