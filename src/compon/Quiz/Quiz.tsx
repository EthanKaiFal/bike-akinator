"use client"
import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap";

export const Quiz = () => {
    const quiz = {
        questions:
            [
                {
                    Id: 1,
                    Question: "How many bikes have you owned",
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
                        "OffRoad": ["enduro", "offroad"],
                        "Travel": ["enduro", "touring"],
                        "Street Cruise": ["cruiser", "naked"],
                        "Sport": ["naked", "sport"],
                        "Stunt": ["motard"]
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


    //setting up quiz question
    const [quizIndex, setQuizIndex] = useState(0);
    const [question, setQuizQuestion] = useState("");
    const [answers, setQuestionAnswers] = useState<string[]>([]);

    useEffect(() => {
        if (quizIndex < quiz.questions.length) {
            setQuizQuestion(quiz.questions[quizIndex].Question);
            const getAnswers: string[] = Object.keys(quiz.questions[quizIndex].Answers);
            setQuestionAnswers(getAnswers);

        }


    }, [quizIndex]);

    const handleNextQuestion = (retrievedAnswer: string) => {
        const selectedAnswers = quiz.questions[quizIndex].Answers;
        if (quiz.questions[quizIndex].Id === 1) {
            const range = selectedAnswers[retrievedAnswer as keyof typeof selectedAnswers] ?? [];
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
            const cats = selectedAnswers[retrievedAnswer as keyof typeof selectedAnswers] ?? [];
            if (Array.isArray(cats) && typeof cats[0] === 'string') {
                setCategories(cats as string[]);
            }
            else {
                setCategories([]);
            }
        }
        else if (quiz.questions[quizIndex].Id === 3) {
            const maintain = selectedAnswers[retrievedAnswer as keyof typeof selectedAnswers] ?? [];
            if (typeof maintain === 'boolean') {
                setExcludeToughMaintBikes(!(maintain as boolean));
            }
            else {
                setExcludeToughMaintBikes(false);
            }
        }
        else if (quiz.questions[quizIndex].Id === 4) {
            const newOrUsed = selectedAnswers[retrievedAnswer as keyof typeof selectedAnswers] ?? [];
            if (Array.isArray(newOrUsed) && typeof newOrUsed[0] === 'number' && typeof newOrUsed[1] === 'number') {
                setMinYear(newOrUsed[0]);
                setMaxYear(newOrUsed[1]);
            }
            else {
                console.log("problem");
            }
        }
        else if (quiz.questions[quizIndex].Id === 5) {
            const ownTime = selectedAnswers[retrievedAnswer as keyof typeof selectedAnswers] ?? [];
            if (Array.isArray(ownTime) && typeof ownTime[0] === 'number' && typeof ownTime[1] === 'number') {
                setMinYear(ownTime[0]);
                setMaxYear(ownTime[1]);
            }
            else {
                console.log("problem");
            }
        }

        else if (quiz.questions[quizIndex].Id === 6) {
            const brandNat = selectedAnswers[retrievedAnswer as keyof typeof selectedAnswers] ?? [];
            if (typeof brandNat === 'string') {
                setBrandNationality(brandNat);
            }
            else {
                console.log("problem");
            }
        }
        setQuizIndex(quizIndex + 1);
    }


    return (
        <Container>
            <Row>
                <Col>
                    <span>{question}</span>
                </Col>
            </Row>
            {answers.map((answer, idx) => (
                <Row key={idx}>
                    <Col>
                        <span>{answer}</span>
                    </Col>
                </Row>
            ))}

            <Row>
                {/* <Col><Button onClick={()=> handleNextQuestion()}></Button></Col> */}
            </Row>
        </Container>
    )






}