"use client"
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Banner.css";

const motoPng = "/moto.png"

const Banner = ({ }: {
}) => {
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const toRotate = ["Yamaha", "Kawasaki", "KTM", "Aprilia", "Husqvarna"];
    const [text, setText] = useState('');
    const [delta, setDelta] = useState(300 - Math.random() * 100);
    const period = 2000;

    useEffect(() => {
        let ticker = setInterval(() => {
            tick();
        }, delta)
        return () => { clearInterval(ticker) };
    }, [text])

    const tick = () => {
        //gets desired index with overflow beign ok
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

        setText(updatedText);
        //accelerate the deltign process i believe
        if (isDeleting) {
            setDelta(prevDelta => prevDelta / 2);
        }

        //done typing this index
        if (!isDeleting && updatedText === fullText) {
            setIsDeleting(true);
            //normal pace
            setDelta(period);
        }
        else if (isDeleting && updatedText === '') {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setDelta(500);
        }
    }
    return (
        <Container>
            <Row className="align-items-center">
                <Col xs={2} md={2} xl={2} style={{ width: "55%" }}>
                    <span className="welcome">Welcome to Bike Akinator!!!!</span>
                    <h1><span className="intro">This is a website designed to help YOU find your next motorcycle whether it is a </span>{text}</h1>
                    <p>About the app right here</p>
                </Col>
                <Col xs={12} md={6} xl={6}>
                    <img className="img-fluid" src={motoPng} height={500} width={500} alt="Headder Img"></img>

                </Col>
            </Row>
        </Container>
    )

}

export default Banner;
