"use client"
import BikeModel from "@/compon/bikeModel";
import { modelDataWID } from "@/compon/interfaces";
import * as statsService from '../../app/_actions/statsService';
import { useEffect, useState } from "react";
// Define the types for bikeModels and other state


const Bikes = () => {
    const [wholeList, setWholeList] = useState<modelDataWID[]>([]);
    const [isLoading, setLoading] = useState(true);

    //grab the whole list just once
    useEffect(() => {
        statsService.getAllModelStats().then((data) => {
            setWholeList(data ?? []);
        }).catch((error) => {
            console.error("Error fetching stats:", error);
        });

    },);

    //now we want to create a shorter list that pattern matches
    const [searchList, setSearchList] = useState<modelDataWID[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    const filterStrings = (list: modelDataWID[], pattern: string): modelDataWID[] => {
        return list.filter((model) => `${model.brandName} ${model.modelName}`
            .toLowerCase()
            .includes(pattern.toLowerCase()));
    };
    //will reload whenever the input value is changed
    useEffect(() => {
        console.log("Input value changed:", inputValue);
        setSearchList(filterStrings(wholeList, inputValue));
        setLoading(false);
    }, [inputValue, wholeList]);

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onFocus={() => setInputValue("")} // Clears input when clicked
                onChange={(e) => { setInputValue(e.target.value); setLoading(true); }} // Updates state when typing
                placeholder="Click and type..."
                className="border p-2 w-full"
            />
            <div>
                {isLoading ? (
                    <p className="text-gray-500 mt-2">Loading...</p> // Show loading message
                ) : (
                    searchList.map((model, index) => (
                        <BikeModel key={index}
                            bikeModelId={model.id}
                            bikeModel={model.modelName ?? ""}
                            bikeBrand={model.brandName ?? ""}
                        />
                    ))
                )}
            </div>

        </div>
    );
}

export default Bikes;