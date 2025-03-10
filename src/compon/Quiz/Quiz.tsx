"use client"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap";
import { grabQueriedBikes } from "./bikeQueryCall";
import "./Quiz.css"
import { modelDataWBikeStats } from "../interfaces";
import Link from "next/link";
import Image from "next/image";
const motoPng = "/moto.png"

export const Quiz = () => {
    const quiz = {
        questions:
            [
                {
                    Id: 1,
                    Question: "How many bikes have you owned?",
                    Answers:
                    {
                        "0": [0, 500],
                        "1": [400, 750],
                        "2": [600, 1000],
                        "3+": [600, 1000]
                    }
                },
                {
                    Id: 2,
                    Question: "What style rider are you?",
                    Answers: {
                        "OffRoad": ["nduro", "ffroad"],
                        "Travel": ["nduro", "ouring"],
                        "Street Cruise": ["ruiser", "aked"],
                        "Sport": ["aked", "port"],
                        "Stunt": ["otard"],
                        "Scooter": ["cooter"]
                    }
                },
                {
                    Id: 3,
                    Question: "How do you feel about hard to maintain bikes?",
                    Answers: {
                        "Fine with it": true,
                        "I don’t want to deal with that": false
                    },
                },
                {
                    Id: 4,
                    Question: "Looking for a used or new bike?",
                    Answers: {
                        "New": [2020, 2025],
                        "Used": [0, 2020],
                        "Either": [0, 2025]
                    },
                },
                {
                    Id: 5,
                    Question: "How long are you looking to own this bike?",
                    Answers: {
                        "Year or Less then flip": [0, 24],
                        "couple years": [24, 60],
                        "til death do you part": [48, 10000],
                    }
                },
                {
                    Id: 6,
                    Question: "Would you like a particular brand?",
                    Answers: {
                        "European": "european",
                        "American": "american",
                        "Asian": "asian",
                        "Any": ""
                    }
                }
            ]
    }

    //setting up the query variables with values to be gained form the quiz
    const [minEngineSize, setMinEngineSize] = useState(0);
    const [maxEngineSize, setMaxEngineSize] = useState(10000);
    const [categories, setCategories] = useState<string[]>([]);
    const [excludeToughMaintBikes, setExcludeToughMaintBikes] = useState(false);
    const [minYear, setMinYear] = useState(0);
    const [maxYear, setMaxYear] = useState(3000);
    const [minAvgMonths, setMinAvgMonths] = useState(0);
    const [maxAvgMonths, setMaxAvgMonths] = useState(30000);
    const [brandNationality, setBrandNationality] = useState("");

    //this is a condition that controls if we are in quiz or done with it
    const [finishedQuiz, setFinishedQuiz] = useState(false);
    const [modelsAndYears, setModelsAndYears] = useState<modelDataWBikeStats[]>([]);
    const [isLoading, setLoading] = useState(false);

    //setting up quiz question
    const [quizIndex, setQuizIndex] = useState(0);
    const [question, setQuizQuestion] = useState("");
    const [answers, setQuestionAnswers] = useState<string[]>([]);

    const [answer, setAnswer] = useState("");

    //sets the quetion details up eachtime the index is updated
    useEffect(() => {
        if (quizIndex >= quiz.questions.length) {
            handleSubmit(); // Call handleSubmit when quizIndex is updated
        }
        else if (quizIndex < quiz.questions.length) {
            setQuizQuestion(quiz.questions[quizIndex].Question);
            const getAnswers: string[] = Object.keys(quiz.questions[quizIndex].Answers);
            setQuestionAnswers(getAnswers);

        }


    }, [quizIndex, quiz.questions]);


    const handleSelectAnswer = (grabbedAnswer: string) => {
        setAnswer(grabbedAnswer);
    }

    const handleSubmit = () => {
        setLoading(true);
        setFinishedQuiz(true);
        //backend call to query
        console.log("final" + brandNationality);
        grabQueriedBikes(minEngineSize, maxEngineSize, categories, excludeToughMaintBikes, minYear, maxYear, minAvgMonths, maxAvgMonths, brandNationality).then((data) => {
            setModelsAndYears(data);
            setLoading(false);
            localStorage.setItem('quizResults', JSON.stringify(data));

        });

        console.log("pull;ed" + modelsAndYears);
    }

    const handleGoBack = () => {
        setQuizIndex(quizIndex - 1);
        setAnswer("");
    }

    const handleNextQuestion = () => {
        const selectedAnswers = quiz.questions[quizIndex].Answers;
        //reset just in case
        setAnswer("");

        if (quiz.questions[quizIndex].Id === 1) {
            const range = selectedAnswers[answer as keyof typeof selectedAnswers] ?? [];
            if (Array.isArray(range) && typeof range[0] === 'number' && typeof range[1] === 'number') {
                // Now we know 'range' is a number array
                setMinEngineSize(range[0]);
                setMaxEngineSize(range[1]);
            } else {
                // Handle the case where the answer is not a valid number array (optional)
                setMinEngineSize(0);
                setMaxEngineSize(0);
            }
        }
        else if (quiz.questions[quizIndex].Id === 2) {
            const cats = selectedAnswers[answer as keyof typeof selectedAnswers] ?? [];
            if (Array.isArray(cats) && typeof cats[0] === 'string') {
                console.log("rigth");
                setCategories(cats as string[]);
            }
            else {
                console.log("wrong");
                setCategories([]);
            }
        }
        else if (quiz.questions[quizIndex].Id === 3) {
            const maintain = selectedAnswers[answer as keyof typeof selectedAnswers] ?? [];
            if (typeof maintain === 'boolean') {
                setExcludeToughMaintBikes(!(maintain as boolean));
            }
            else {
                setExcludeToughMaintBikes(false);
            }
        }
        else if (quiz.questions[quizIndex].Id === 4) {
            const newOrUsed = selectedAnswers[answer as keyof typeof selectedAnswers] ?? [];
            if (Array.isArray(newOrUsed) && typeof newOrUsed[0] === 'number' && typeof newOrUsed[1] === 'number') {
                setMinYear(newOrUsed[0]);
                setMaxYear(newOrUsed[1]);
            }
            else {
                console.log("problem");
            }
        }
        else if (quiz.questions[quizIndex].Id === 5) {
            const ownTime = selectedAnswers[answer as keyof typeof selectedAnswers] ?? [];
            if (Array.isArray(ownTime) && typeof ownTime[0] === 'number' && typeof ownTime[1] === 'number') {
                setMinAvgMonths(ownTime[0]);
                setMaxAvgMonths(ownTime[1]);
            }
            else {
                console.log("problem");
            }
        }

        else if (quiz.questions[quizIndex].Id === 6) {
            const brandNat = selectedAnswers[answer as keyof typeof selectedAnswers] ?? [];
            if (typeof brandNat === 'string') {
                console.log("settign this" + brandNat);
                setBrandNationality(brandNat);
            }
            else {
                console.log("problem");
            }
        }
        setQuizIndex(quizIndex + 1);

    }

    if (isLoading) {
        return (
            <div className="loading">
                Loading Result Please watch this Motorcycle in the meantime it usually moves
                <Image className="img-fluid" src={motoPng} height={500} width={500} alt="Header Img" />
            </div>
        )
    }

    return (
        <Container className="quiz-container">
            {finishedQuiz ? <div>
                <Link href="./quizResult"> The results are in, click this to see the bikes</Link>
            </div> : <div>
                <Row>
                    <Col className="question" xs={2} md={6} xl={5}>
                        <h2>{question}</h2>
                    </Col>
                </Row>
                <div className="answersContainer">
                    {answers.map((curAnswer, idx) => (
                        <Row key={idx}>
                            <Col className={answer === curAnswer ? "active-answers" : "answers"} onClick={() => handleSelectAnswer(curAnswer)} xs={2} md={6} xl={5}>
                                <Button >{curAnswer}</Button>
                            </Col>
                        </Row>
                    ))}
                </div>

                <Row className="quizButtonsContainer">
                    {quizIndex === 0 ? <div></div> : <Col className="quizButtons" onClick={() => handleGoBack()}> <Button >Go Back</Button></Col>}
                    {(answer !== "" && quizIndex < quiz.questions.length - 1) ? <Col className="quizButtons" onClick={() => handleNextQuestion()}><Button>Next Question</Button></Col> : <div></div>}
                    {quizIndex >= (quiz.questions.length - 1) ? <Col className="quizButtons" onClick={() => {
                        handleNextQuestion();
                    }}><Button>Submit Quiz</Button></Col> : <div></div>}
                </Row>
            </div>
            }

        </Container>
    )






}