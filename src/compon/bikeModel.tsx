"use client"
import {Button, Divider, Flex } from "@aws-amplify/ui-react";
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
    const router = useRouter();
    const onDetail = () => {
        router.push(`bike/${bikeModelId}`)
    }

    return(
        <div
    className="border bg-gray-100 w-full p-4 rounded flex justify-between "
    >
<Link style={{display: "flex", justifyContent: "center", paddingTop:12, paddingBottom:0}} key={`bike/${bikeModelId}`} href={`bike/${bikeModelId}`}>
{bikeBrand} {bikeModel}
</Link>
{/* <div role="button" onClick={onDetail} className="cursor-pointer">
                <div className="flex gap-2">
                    <div>{bikeBrand} {bikeModel}</div>
                </div>
            </div>
<input type="hidden" name="id" id='id' value={bikeModelId} /> */}
</div>
    )
}
export default BikeModel;