"use client"
import React from "react";
import { Bike as BikeType } from "../interfaces"
import { Check, X } from "lucide-react";
import { Bar } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Button } from "react-bootstrap";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Bike = ({
    bike,
    onDelete,
    isSignedIn,
}: {
    bike: BikeType;
    onDelete: (id: string) => void;
    isSignedIn: boolean;
}) => {

    function ordinal(n: number): string {
        if (n % 100 >= 11 && n % 100 <= 13) {
            return `${n}th`;
        }

        const suffixes: { [key: number]: string } = { 1: "st", 2: "nd", 3: "rd" };
        return `${n}${suffixes[n % 10] || "th"}`;
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                ticks: {
                    stepSize: 1,
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Satisfaction Score',
            },
        },
    };

    const labels = ['Satisfaction Score'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Score',
                data: [bike.score],
                backgroundColor: 'rgba(83, 14, 161, 0.5)',
            },
        ],
    };

    return (
        <div className="user-bike-container">
            <p className="bikeDisplayLine">This is your {ordinal(bike.bikeNumber ?? -1)} bike</p>
            <div className="basic-info">
                <p className="bikeDisplayLine">Brand: {bike.brand}</p>
                <p className="bikeDisplayLine">Model: {bike.model}</p>
                <p className="bikeDisplayLine">Year: {bike.year}</p>
            </div>
            <div className="bools">
                <p className="bikeDisplayLine" style={{}}>Engine Issues: {bike.broken ? <Check color="green" size={24} /> : <X color="red" size={24} />}</p>
                <p className="bikeDisplayLine">Sold: {bike.sold ? <Check color="green" size={24} /> : <X color="red" size={24} />}</p>
            </div>
            <p className="bikeDisplayLine">Months Owned: {bike.ownershipMonths} Months</p>
            <div className="profile-Satis-Bar">
                <Bar className="bar" options={options} data={data} />
            </div>
            {isSignedIn ? (
                <Button className="remove-bike" onClick={() => onDelete(bike.id)}>Remove</Button>
            ) : null}
        </div>
    );
};

export default Bike;
