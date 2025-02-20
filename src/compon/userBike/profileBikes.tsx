"use client"

import Link from "next/link";
import { Bike as BikeType } from "../interfaces"
import Bike from "./Bike"
import * as DBWork from "../../app/_actions/actions"
import Carousel from "react-multi-carousel";
import "./profilePage.css";
import "../NavBar/NavStyle.css"
import "react-multi-carousel/lib/styles.css";
import { Col, Container, Row } from "react-bootstrap";

const ProfileBikes = ({
    bikes,
    isAuth
}: {
    bikes: BikeType[]
    isAuth: boolean
}) => {
    //for the carousel component
    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 1 },
        desktop: { breakpoint: { max: 1024, min: 768 }, items: 1 },
        tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    };

    const displayUserBikes = () => {

        return (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {/* <div className="bikes-wheel">
                    <div className="bike-wheel-inner" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                        {bikes.map((userBike, idx) => (
                            <div className="bike-card" key={idx}>
                                <Bike
                                    onDelete={DBWork.onDeleteBike}
                                    bike={userBike}
                                    isSignedIn={isAuth}
                                />
                            </div>
                        ))}
                    </div>
                </div> */}
                <Carousel responsive={responsive} infinite={true} className="skill-slider">
                    {bikes.map((userBike, idx) => (
                        <div className="item" key={idx}>
                            <Bike
                                onDelete={DBWork.onDeleteBike}
                                bike={userBike}
                                isSignedIn={isAuth}
                            />
                        </div>
                    ))}
                </Carousel>
            </div>
        );
    };
    return (
        <section className="skill" id="skills">
            <Container>
                <Row>
                    <Col>
                        <div className="skill-bx">
                            <h2>
                                Bikes
                            </h2>
                            {displayUserBikes()}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ alignItems: "center" }}>
                        <Link className="add-bike" key={"/add"} href={"/add"}>
                            {"Add Bike"}
                        </Link>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default ProfileBikes;