"use client"
import { getBrandStats, getTotalStats } from "@/app/_actions/actions"
import { brandData, totalData } from "../interfaces"
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import "./stat.css"
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

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

   }, [brandName]);

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
   //const totalAvgOwnerShip = totalStat?.totalAvgOwnership;

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
      labels: [`${brandName} Broken Bikes`, `All ${brandName} Bikes`],
      datasets: [
         {
            data: [numBrokenByBrand, brandNum],
            backgroundColor: ['#FF9F40', '#FF6384'],
         },
      ],
   };

   const soldBikesData = {
      labels: [`${brandName} Sold Bikes`, `All ${brandName} Bikes`],
      datasets: [
         {
            data: [numSoldByBrand, brandNum],
            backgroundColor: ['#FF9F40', '#FF6384'],
         },
      ],
   };

   const options = {
      plugins: {
         datalabels: {
            display: true,
         },
      },
   };
   //console.log("in here");
   return (
      <div className="chart-container">
         <h2> {brandName} Brand Stats</h2>
         <div className="item-container">
            <div className="box">
               <h3>Bikes Distribution</h3>
               <div className="distribution-container">
                  <div className="explanation-container">
                     {((brandNum ?? 0) / (totalNumBikes ?? 1)) > 0.1 ? <p>{brandName} is currently sitting at over 10% of of motorcycle brands registered on this website making it a popular option</p> : <p>{brandName} is currently sitting at under 10% of the motorcycle market making it a more niche option. </p>}
                  </div>
                  <div className="chart-item">
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
                     {((avgSatisScoreByBrand ?? 0) < (totalAvgSatisScore ?? 0)) ? <p>{brandName} is currently sitting below the overall average for bike satisfaction scores making it one that isn't usually worth its price. </p> : <p> {brandName} is currently sitting above the overall average values for bikes on this website making these bikes usually worth the cost.</p>}
                  </div>
               </div>
            </div>
            <div className="sold-broken-container">
               <div className="chart-item">
                  <h3>Broken Bikes</h3>
                  <Doughnut data={brokenBikesData} options={options} />
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
export default BrandStats;