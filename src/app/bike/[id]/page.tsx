
import { cookieBasedClient } from "@/utils/amplify-utils";
import BrandStats from "@/compon/statDisplay/BrandStats";
import ModelStats from "@/compon/statDisplay/ModelStats";
import Link from "next/link";
import "../../../compon/statDisplay/stat.css"

const Bike = async ({ params }: { params: { id: string } }) => {
    // if (!params.id) return null;


    try {
        const { data: bikeInfo } = await cookieBasedClient.models.ModelStats.get({
            id: params.id,
        });

        if (!bikeInfo) {
            return <div>Bike not found</div>;
        }
        else {
        }
        const { data: bikeStats } = await cookieBasedClient.models.BikeStats.list({
            filter: { modelStatId: { eq: bikeInfo.id } },
            selectionSet: ["modelName", "bikeYear", "id"],
        });
        console.log(bikeStats.length);

        return (
            <div className="stat-container">
                <h1>Welcome to  the {bikeInfo.brandName} {bikeInfo.modelName} Stat Page!</h1>
                <BrandStats brandName={bikeInfo?.brandName ?? ""} />
                <ModelStats modelName={bikeInfo?.modelName ?? ""} brandName={bikeInfo?.brandName ?? ""} />
                <div className="link-containers">
                    <div>Bike Year Links</div>
                    {bikeStats.map(async (bikeStat) => (
                        <Link className="bike-links" key={`../bikeStat/${bikeStat.id}`} href={`../bikeStat/${bikeStat.id}`}> {bikeStat.modelName}  {bikeStat.bikeYear}</Link>
                    ))}
                </div>

            </div>
        );
    } catch (error) {
        console.error("Error fetching bike data:", error);
        return <div>Error loading bike data</div>;
    }
    return (<div>
        Hello
    </div>)
};

export default Bike;

