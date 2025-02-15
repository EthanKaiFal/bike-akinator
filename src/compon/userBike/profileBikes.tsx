"use client"

import Link from "next/link";
import { Bike as BikeType } from "../interfaces"
import Bike from "./Bike"
import * as DBWork from "../../app/_actions/actions"
import { useState } from "react";

const ProfileBikes = ({
    bikes,
    isAuth
}: {
    bikes: BikeType[]
    isAuth: boolean
}) => {

    const displayUserBikes = () => {
        return (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div className="bikes-wheel">
                    <div className="bike-wheel-inner" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                        {bikes.map((userBike, idx) => (
                            <div className="bike-card" key={idx}>
                                <Bike
                                    onDelete={DBWork.onDeleteBike}
                                    bike={userBike}
                                    isSignedIn={isAuth}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={scrollToNext} className="scroll-button">Next Bike</button>
            </div>
        );
    };
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollToNext = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % bikes.length);
    };

    return (
        <div>
            <div style={{ justifyContent: "center" }}>{displayUserBikes()}</div>
            <Link className="add-bike" key={"/add"} href={"/add"}>
                {"Add Bike"}
            </Link>
        </div>
    )
}

export default ProfileBikes;