"use client"
import { getModelStats, getTotalStats } from "@/app/_actions/actions"
import { modelDataWID, totalDataWID } from "../interfaces"
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import "./stat.css"
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ModelStats = ({ modelName, brandName }: {
    modelName: string,
    brandName: string,

}

) => {
    const [totalStat, setTotalStat] = useState<totalDataWID | null>(null);
    const [modelStat, setModelStat] = useState<modelDataWID | null>(null);
    //const [brandStat, setBrandStat] = useState<brandDataWID | null>(null);
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

        // getBrandStats(brandName).then((data) => {
        //     setBrandStat(data);
        //     setLoading(false);
        // }).catch((error) => {
        //     console.error("Error fetching stats:", error);
        //     setLoading(false);
        // });

    }, [brandName, modelName]);

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
            <h2>{brandName} {modelName} Model Stats</h2>

            <div>Category:{modelStat?.category}</div>
            <div className="item-container">
                <div className="box">
                    <h3>Bikes Distribution</h3>
                    <div className="distribution-container">
                        <div className="explanation-container">
                            {((modelNum ?? 0) / (totalNumBikes ?? 1)) > 0.1 ? <p>{modelName} is currently sitting at over 10% of of motorcycle brands registered on this website making it a popular option</p> : <p>{brandName} is currently sitting at under 10% of the motorcycle market making it a more niche option. </p>}
                        </div>
                        <div className="chart-item">
                            <h3>Bikes Distribution</h3>
                            <Pie data={bikeData} />
                        </div>
                    </div>
                </div>

                <div className="box">
                    <h3>Bikes Distribution</h3>
                    <div className="distribution-container">
                        <div className="chart-item">
                            <h3>Satisfaction Scores</h3>
                            <Bar data={satisScoreData} />
                        </div>
                        <div className="explanation-container">
                            {((avgSatisScoreBymodel ?? 0) < (totalAvgSatisScore ?? 0))
                                ? <p>{modelName} is currently sitting below the overall average for bike satisfaction scores making it one that isn&apos;t usually worth its price. </p>
                                : <p> {modelName} is currently sitting above the overall average values for bikes on this website making these bikes usually worth the cost.</p>}
                        </div>
                    </div>
                </div>
                <div className="sold-broken-container">
                    <div className="chart-item">
                        <h3>Broken Bikes</h3>
                        <Doughnut data={brokenBikesData} />
                    </div>
                    <div className="chart-item">
                        <h3> Sold Bikes</h3>
                        <Doughnut data={soldBikesData} />
                    </div>
                </div>
            </div>
        </div>

    )
}
export default ModelStats;