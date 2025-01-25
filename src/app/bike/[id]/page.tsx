
import { cookieBasedClient } from "@/utils/amplify-utils";
import BrandStats from "@/compon/BrandStats";

const Bike = async ({ params }: { params: { id: string } }) => {
    // if (!params.id) return null;

    // try {
        const { data: bikeInfo } = await cookieBasedClient.models.ModelStats.get({
            id: params.id,
        });
    //     if (!bikeInfo) {
    //         return <div>Bike not found</div>;
    //     }
    //     else{
    //         console.log("print"+JSON.stringify(bikeInfo));
    //     }

        return (
            <div>
                Hello
                <BrandStats brandName={bikeInfo?.brandName ?? ""} />
            </div>
        );
    // } catch (error) {
    //     console.error("Error fetching bike data:", error);
    //     return <div>Error loading bike data</div>;
    // }
    return (<div>
        Hello
    </div>)
};

export default Bike;

