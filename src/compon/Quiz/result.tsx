"use client"

import Link from "next/link";
import { modelDataWBikeStats } from "../interfaces";
import "./Quiz.css"

export const Result = () => {
    const savedResults = localStorage.getItem('quizResults');
    let models: modelDataWBikeStats[];
    if (savedResults == null) {
        models = [];
    }
    else {
        models = JSON.parse(savedResults);
    }

    return (
        <div className="background">{models.length === 0 ? <span>sorry we got nothing for you</span> : <div>{models.map((model) => {
            let show: boolean = false;
            return (
                <div className="post-container" key={model.id}>
                    {model.bikeStats && model.bikeStats.map((bikeStat, index) => {
                        // Define your year and engine size range

                        // Check if bikeStat's year and engine size are within the range
                        if (
                            // ((bikeStat.bikeYear ?? -1) >= minYear && (bikeStat.bikeYear ?? -1) <= maxYear) &&
                            // ((bikeStat.engineSize ?? -1) >= minEngineSize && (bikeStat.engineSize ?? -1) <= maxEngineSize)
                            true
                        ) {
                            show = true;
                            return (
                                <div key={index}>
                                    {/* Display bike stat details here */}
                                    <Link key={`../bikeStat/${bikeStat.id}`} href={`../bikeStat/${bikeStat.id}`}>{bikeStat.bikeYear} {bikeStat.modelName}</Link>
                                    {/* Add any other properties you want to display */}
                                </div>
                            );
                        }
                        return null; // If the bikeStat doesn't meet the condition, return nothing
                    })}
                    {show ? <Link style={{ display: "flex", justifyContent: "flex-start", paddingTop: 12, paddingBottom: 0 }} key={`bike/${model.id}`} href={`bike/${model.id}`}>
                        {model.brandName} {model.modelName} SatisfactionScore:{model.avgSatisScore}
                    </Link> : <div></div>}
                </div>
            )
        })}</div>}</div>
    )
}