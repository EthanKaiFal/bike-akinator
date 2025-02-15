"use client"
import { getModelStats, getTotalStats } from "@/app/_actions/actions"
import { modelDataWID, totalDataWID } from "../interfaces"
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ModelStats = ({ modelName, brandName }: {
    modelName: string,
    brandName: string
}

) => {
    const [totalStat, setTotalStat] = useState<totalDataWID | null>(null);
    const [modelStat, setModelStat] = useState<modelDataWID | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        getTotalStats().then((data) => {
            setTotalStat(data);
            setLoading(false);
        }).catch((error) => {
            console.error("Error fetching stats:", error);
            setLoading(false);
        });

        getModelStats(modelName, brandName).then((data) => {
            setModelStat(data);
            setLoading(false);
        }).catch((error) => {
            console.error("Error fetching stats:", error);
            setLoading(false);
        });

    }, []);

    if (loading) return <div>Loading...</div>;

    const modelNum = modelStat?.totalNumBikes;
    const totalNumBikes = totalStat?.totalNumBikes;
    console.log("Total Stats" + JSON.stringify(totalStat));
    const numBrokenByModel = modelStat?.numBroken;
    const totalNumBroken = totalStat?.totalNumBroken;

    const numSoldByModel = modelStat?.numSold;
    const totalNumSold = totalStat?.totalNumSold;

    const avgSatisScoreBymodel = modelStat?.avgSatisScore;
    const totalAvgSatisScore = totalStat?.totalAvgSatisScore;
    //const totalAvgOwnerShip = totalStat?.totalAvgOwnership;

    // data groups for charts
    const bikeData = {
        labels: [`${modelName} Bikes`, 'All Other Bikes'],
        datasets: [
            {
                data: [modelNum, (totalNumBikes ?? 0) - (modelNum ?? 0)],
                backgroundColor: ['#4BC0C0', '#FF6384'],
            },
        ],
    };

    const satisScoreData = {
        labels: ['Average Satisfaction Score'],
        datasets: [
            {
                label: `${modelName}`,
                data: [avgSatisScoreBymodel],
                backgroundColor: '#36A2EB',
            },
            {
                label: 'Overall Average',
                data: [totalAvgSatisScore],
                backgroundColor: '#FFCE56',
            },

        ],
    };

    const brokenBikesData = {
        labels: [`${modelName} Broken Bikes`, 'Other Broken Bikes'],
        datasets: [
            {
                data: [numBrokenByModel, (totalNumBroken ?? 0) - (numBrokenByModel ?? 0)],
                backgroundColor: ['#FF9F40', '#FF6384'],
            },
        ],
    };

    const soldBikesData = {
        labels: [`${modelName} Sold Bikes`, 'Other Sold Bikes'],
        datasets: [
            {
                data: [numSoldByModel, (totalNumSold ?? 0) - (numSoldByModel ?? 0)],
                backgroundColor: ['#FF9F40', '#FF6384'],
            },
        ],
    };
    console.log("in here");
    return (
        <div className="chart-container">
            <div>Category:{modelStat?.category}</div>
            <h2> Model</h2>
            <div className="chart-item">
                <h3>Bikes Distribution</h3>
                <Pie data={bikeData} />
            </div>
            <div className="chart-item">
                <h3>Satisfaction Scores</h3>
                <Bar data={satisScoreData} />
            </div>
            <div className="chart-item">
                <h3>Broken Bikes</h3>
                <Doughnut data={brokenBikesData} />
            </div>
            <div className="chart-item">
                <h3> Sold Bikes</h3>
                <Doughnut data={soldBikesData} />
            </div>
        </div>
    )
}
export default ModelStats;