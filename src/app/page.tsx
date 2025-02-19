import { Container, Row, Col } from "react-bootstrap";
import Banner from "@/compon/Banner/Banner";
import "../compon/Banner/Banner.css"

const motoPng = "/moto.png"

export default async function Home() {
  try {


    return (
      <section className="banner" id="home">

        <Banner />
      </section>

    );
  }
  catch (error) {
    console.log("errorr in home" + error);
  }
}
