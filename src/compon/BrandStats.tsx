"use client"
import { getBrandStats, getTotalStats } from "@/app/_actions/actions"
import { brandData, totalData } from "./interfaces"
import { Pie, Bar, Doughnut } from 'react-chartjs-2';

const BrandStats = async ({brandName}: {
    brandName: string
}

) => {
    const brandStat: Promise<brandData> = getBrandStats(brandName);
    const totalStat: Promise<totalData> = getTotalStats();

    const brandNum = (await brandStat).totalNumBikes;
    const totalNumBikes = (await totalStat).totalNumBikes;
    console.log("in here");
    const numBrokenByBrand = (await brandStat).numBroken;
    const totalNumBroken = (await totalStat).totalNumBroken;

    const numSoldByBrand = (await brandStat).numSold;
    const totalNumSold = (await totalStat).totalNumSold;

    const avgSatisScoreByBrand = (await brandStat).avgSatisScore;
    const totalAvgOwnerShip = (await totalStat).totalAvgOwnership;

   // data groups for charts
   const bikeData = {
    labels: [`${brandName} Bikes`, 'All Other Bikes'],
    datasets: [
       {
          data: [brandNum, totalNumBikes??0 - (brandNum??0)],
          backgroundColor: ['#4BC0C0', '#FF6384'],
       },
    ],
 };

 const satisScoreData = {
    labels: ['Average Satisfaction Score'],
    datasets: [
       {
          label: `${brandName}`,
          data: [avgSatisScoreByBrand],
          backgroundColor: '#36A2EB',
       },
       {
          label: 'Overall Average',
          data: [totalAvgOwnerShip],
          backgroundColor: '#FFCE56',
       },

    ],
 };

 const brokenBikesData = {
    labels: [`${brandName} Broken Bikes`, 'Other Broken Bikes'],
    datasets: [
       {
          data: [numBrokenByBrand, totalNumBroken??0 - (numBrokenByBrand??0)],
          backgroundColor: ['#FF9F40', '#FF6384'],
       },
    ],
 };

 const soldBikesData = {
    labels: [`${brandName} Broken Bikes`, 'Other Broken Bikes'],
    datasets: [
       {
          data: [numSoldByBrand, totalNumSold??0 - (numSoldByBrand??0)],
          backgroundColor: ['#FF9F40', '#FF6384'],
       },
    ],
 };
 console.log("in here");
    return (
        <div className="chart-container">
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
            <Doughnut data={soldBikesData}/>
        </div>
     </div>
    )
}
export default BrandStats;