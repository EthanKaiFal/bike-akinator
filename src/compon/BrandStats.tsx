"use client"
import { getBrandStats, getTotalStats } from "@/app/_actions/actions"
import { brandData, totalData } from "./interfaces"
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BrandStats = ({ brandName }: {
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

   if (loading) return <div>Loading...</div>;

   const brandNum = brandStat?.totalNumBikes;
   const totalNumBikes = totalStat?.totalNumBikes;
   console.log("Total Stats" + JSON.stringify(totalStat));
   const numBrokenByBrand = brandStat?.numBroken;
   const totalNumBroken = totalStat?.totalNumBroken;

   const numSoldByBrand = brandStat?.numSold;
   const totalNumSold = totalStat?.totalNumSold;

   const avgSatisScoreByBrand = brandStat?.avgSatisScore;
   const totalAvgSatisScore = totalStat?.totalAvgSatisScore;
   const totalAvgOwnerShip = totalStat?.totalAvgOwnership;

   // data groups for charts
   const bikeData = {
      labels: [`${brandName} Bikes`, 'All Other Bikes'],
      datasets: [
         {
            data: [brandNum, (totalNumBikes ?? 0) - (brandNum ?? 0)],
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
            data: [totalAvgSatisScore],
            backgroundColor: '#FFCE56',
         },

      ],
   };

   const brokenBikesData = {
      labels: [`${brandName} Broken Bikes`, 'Other Broken Bikes'],
      datasets: [
         {
            data: [numBrokenByBrand, (totalNumBroken ?? 0) - (numBrokenByBrand ?? 0)],
            backgroundColor: ['#FF9F40', '#FF6384'],
         },
      ],
   };

   const soldBikesData = {
      labels: [`${brandName} Sold Bikes`, 'Other Sold Bikes'],
      datasets: [
         {
            data: [numSoldByBrand, (totalNumSold ?? 0) - (numSoldByBrand ?? 0)],
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
            <Doughnut data={soldBikesData} />
         </div>
      </div>
   )
}
export default BrandStats;