
import Banner from "@/compon/Banner/Banner";
import "../compon/Banner/Banner.css"


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
