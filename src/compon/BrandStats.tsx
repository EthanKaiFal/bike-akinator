"use client"
import { getBrandStats, getTotalStats } from "@/app/_actions/actions"
import { brandData, totalData } from "./interfaces"
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from "react";

const BrandStats = ({brandName}: {
    brandName: string
}

) => {
   const [totalStat, setTotalStat] = useState<totalData | null>(null);
   const [brandStat, setBrandStat] = useState<brandData | null>(null);
   const [loading, setLoading] = useState(true);

   
   useEffect(() => {
      getTotalStats().then((data) => {
         setTotalStat(data);
         setLoading(false);
       }).catch((error) => {
         console.error("Error fetching stats:", error);
         setLoading(false);
       });

       getBrandStats(brandName).then((data) => {
         setBrandStat(data);
         setLoading(false);
       }).catch((error) => {
         console.error("Error fetching stats:", error);
         setLoading(false);
       });
  
    }, []);

   //  const brandNum = brandStat.totalNumBikes;
   //  const totalNumBikes = totalStat.totalNumBikes;
   //  console.log("in here2");
   //  const numBrokenByBrand = brandStat.numBroken;
   //  const totalNumBroken = totalStat.totalNumBroken;

   //  const numSoldByBrand = brandStat.numSold;
   //  const totalNumSold = totalStat.totalNumSold;

   //  const avgSatisScoreByBrand = brandStat.avgSatisScore;
   //  const totalAvgOwnerShip = totalStat.totalAvgOwnership;

   // data groups for charts
//    const bikeData = {
//     labels: [`${brandName} Bikes`, 'All Other Bikes'],
//     datasets: [
//        {
//           data: [brandNum, totalNumBikes??0 - (brandNum??0)],
//           backgroundColor: ['#4BC0C0', '#FF6384'],
//        },
//     ],
//  };

//  const satisScoreData = {
//     labels: ['Average Satisfaction Score'],
//     datasets: [
//        {
//           label: `${brandName}`,
//           data: [avgSatisScoreByBrand],
//           backgroundColor: '#36A2EB',
//        },
//        {
//           label: 'Overall Average',
//           data: [totalAvgOwnerShip],
//           backgroundColor: '#FFCE56',
//        },

//     ],
//  };

//  const brokenBikesData = {
//     labels: [`${brandName} Broken Bikes`, 'Other Broken Bikes'],
//     datasets: [
//        {
//           data: [numBrokenByBrand, totalNumBroken??0 - (numBrokenByBrand??0)],
//           backgroundColor: ['#FF9F40', '#FF6384'],
//        },
//     ],
//  };

//  const soldBikesData = {
//     labels: [`${brandName} Broken Bikes`, 'Other Broken Bikes'],
//     datasets: [
//        {
//           data: [numSoldByBrand, totalNumSold??0 - (numSoldByBrand??0)],
//           backgroundColor: ['#FF9F40', '#FF6384'],
//        },
//     ],
//  };
 console.log("in here");
    return (
        <div className="chart-container">
        {/* <div className="chart-item">
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
        </div> */}
        inside
     </div>
    )
}
export default BrandStats;