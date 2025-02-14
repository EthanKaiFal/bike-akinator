"use client"
import BikeModel from "@/compon/bikeModel";
import { modelDataWID } from "@/compon/interfaces";
import * as statsService from '../../app/_actions/statsService';
import { useEffect, useState } from "react";
import { Button } from "@aws-amplify/ui-react";
// Define the types for bikeModels and other state


const Bikes = () => {
    const [wholeList, setWholeList] = useState<modelDataWID[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [smallerList, setSmallerList] = useState<modelDataWID[]>([]);


    //now we want to create a shorter list that pattern matches
    // const [searchList, setSearchList] = useState<modelDataWID[]>([]);
    const [inputBrand, setInputBrand] = useState<string>("");
    const [inputModel, setInputModel] = useState<string>("");
    //will reload whenever the input value is changed
    const handleSearch = () => {
        try {
            console.log("handle search called");
        }
        catch (error) {
            console.error("🔥 Error before log:", error);
        }
        setLoading(true);

        statsService.getAllModelStats(inputBrand).then((data) => {
            //setWholeList(data as modelDataWID[]);
            const pulledlist: modelDataWID[] = data as modelDataWID[];
            let modelList: (modelDataWID)[] = pulledlist.map((bike) => {
                console.log(inputModel);
                if ((bike.modelName ?? "").includes(inputModel)) {
                    return bike as modelDataWID;
                }
                return null;
            }).filter((bike): bike is modelDataWID => bike !== null);
            setSmallerList(modelList as modelDataWID[]);
            setLoading(false);

        }).catch((error) => {
            console.error("Error fetching stats:", error);
            setLoading(false);
        });


    }

    return (
        <div>
            <input
                type="text"
                value={inputBrand}
                onFocus={() => setInputBrand("")} // Clears input when clicked
                onChange={(e) => { setInputBrand(e.target.value); setLoading(true); }} // Updates state when typing
                placeholder="Click and type a brand"
                className="border p-2 w-full"
            />

            <input
                type="text"
                value={inputModel}
                onFocus={() => setInputModel("")} // Clears input when clicked
                onChange={(r) => { setInputModel(r.target.value); setLoading(true); }} // Updates state when typing
                placeholder="Click and type a model"
                className="border p-2 w-full"
            />
            <Button onClick={handleSearch}>Search</Button>
            <div>
                {isLoading ? (
                    <p className="text-gray-500 mt-2">Loading...</p> // Show loading message
                ) : (
                    smallerList.map((model, index) => (
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