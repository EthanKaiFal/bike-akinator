"use client"
import Link from "next/link";
import { useRouter } from "next/navigation"

const BikeModel = ({
    bikeModelId,
    bikeModel,
    bikeBrand,
}: {
    bikeModelId: string;
    bikeModel: string;
    bikeBrand: string;
}) => {

    return (
        <div
            className="border bg-gray-100 w-full p-4 rounded flex justify-between "
        >
            <Link style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 0 }} key={`bike/${bikeModelId}`} href={`bike/${bikeModelId}`}>
                {bikeBrand} {bikeModel}
            </Link>
        </div>
    )
}
export default BikeModel;