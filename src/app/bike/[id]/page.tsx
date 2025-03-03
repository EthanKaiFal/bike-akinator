
import { cookieBasedClient } from "@/utils/amplify-utils";
import BrandStats from "@/compon/statDisplay/BrandStats";
import ModelStats from "@/compon/statDisplay/ModelStats";
import BikeLinks from "@/compon/statDisplay/BikeStats";
import "../../../compon/statDisplay/stat.css"

const Bike = async ({ params }: { params: { id: string } }) => {
    // if (!params.id) return null;


    try {
        const { data: bikeInfo } = await cookieBasedClient.models.ModelStats.get({
            id: params.id,
        });

        if (bikeInfo) {

            return (
                <div className="stat-container">
                    <h1>Welcome to  the {bikeInfo.brandName} {bikeInfo.modelName} Stat Page!</h1>
                    <BrandStats brandName={bikeInfo?.brandName ?? ""} />
                    <ModelStats modelName={bikeInfo?.modelName ?? ""} brandName={bikeInfo?.brandName ?? ""} />
                    <BikeLinks modelId={bikeInfo.id}></BikeLinks>

                </div>
            );
        }
        else {
            return (<div>Not FOund</div>);
        }
    } catch (error) {
        console.error("Error fetching bike data:", error);
        return <div>Error loading bike data</div>;
    }
    return (<div>
        Hello
    </div>)
};

export default Bike;

