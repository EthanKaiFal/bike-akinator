
//import "../../compon/Quiz/Quiz.css"
import { Quiz } from "../../compon/Quiz/Quiz"


export default async function Home() {
    try {


        return (
            <section className="quiz" id="quiz">

                <Quiz />
            </section>

        );
    }
    catch (error) {
        console.log("errorr in home" + error);
    }
}