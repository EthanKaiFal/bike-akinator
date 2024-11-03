
import { cookieBasedClient } from "@/utils/amplify-utils";
import BikeModel from "@/compon/bikeModel";
// Define the types for bikeModels and other state


export default async function Bikes() {
    const {data: models, errors} = await cookieBasedClient.models.ModelStats.list();



  return (
    <div>
        {models.map((model, index) => (
            <BikeModel
            bikeModelId={model.id}
            bikeModel={model.modelName??""}
            bikeBrand={model.brandName??""}
            />
        ))}
        </div>
  );
}
