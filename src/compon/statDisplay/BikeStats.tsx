"use client";
import Link from "next/link";
import "./stat.css";
import { useEffect, useState } from "react";
import { getAllBikeStatsByModel } from "@/app/_actions/statsService";

interface bikeStat {
    modelName: string;
    bikeYear: number;
    id: string;
}

const BikeLinks = ({ modelId }: { modelId: string }) => {
    const [isLoading, setLoading] = useState(true);
    const [bikeStats, setBikeStats] = useState<bikeStat[]>([]);

    console.log("id?", modelId);

    useEffect(() => {
        const fetchBikeStats = async () => {
            try {
                setLoading(true); // Start loading before fetching
                const data = await getAllBikeStatsByModel(modelId);
                setBikeStats(data);
            } catch (error) {
                console.error("Error fetching bike stats:", error);
            } finally {
                setLoading(false); // Stop loading after fetch completes
            }
        };

        if (modelId) {
            fetchBikeStats();
        }
    }, []); // Re-fetch when `modelId` changes

    return (
        <div className="link-containers">
            <div>Bike Year Links</div>
            {isLoading ? (
                <div>Loading bike years...</div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {bikeStats.map((bikeStat) => (
                        <Link
                            className="bike-links"
                            key={bikeStat.id} // Ensure `key` is unique
                            href={`/bikeStat/${bikeStat.id}`} // Correct path format
                        >
                            {bikeStat.modelName} {bikeStat.bikeYear}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BikeLinks;