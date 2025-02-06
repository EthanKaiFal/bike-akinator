import { cookieBasedClient } from "@/utils/amplify-utils";
import Link from "next/link";

const bikeStat = async ({ params }: { params: { id: string } }) => {
    // if (!params.id) return null;
    const { data: bikeStats } = await cookieBasedClient.models.BikeStats.get({ id: params.id });



    return (
        <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                Model:{bikeStats?.modelName}
            </div>
            <div>
                Year:{bikeStats?.bikeYear}
            </div>
            <div>
                Engine CC:{bikeStats?.engineSize}
            </div>
            <div>
                HorsePower:{bikeStats?.horsePower}
            </div>
            <div>
                Torque:{bikeStats?.torque === -2 ? "N/A" : bikeStats?.torque}
            </div>
            <div>
                Engine Type:{bikeStats?.engineConfig}
            </div>
            <div>
                Number of Owners on the Site: {bikeStats?.bikeNum}
            </div>

        </div>
    );
    return (<div>
        Hello
    </div>)
};

export default bikeStat;