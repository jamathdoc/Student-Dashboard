// Student Math Dashboard - Script

// LocalStorage Keys
const NAME_KEY = 'math_dashboard_student_name';
const STATUSES_KEY = 'math_dashboard_lesson_statuses';
const COMPLETED_KEY = 'math_dashboard_completed_lessons';

// State Variables & Constants
const TOTAL_LESSONS = 6;
const QUESTIONS_PER_SESSION = 10;
let activeLessonId = null;

const solvedLessons = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
};

const activeSessions = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null
};

const currentSessionIndex = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
};

const practiceStats = {
    1: { correct: 0, attempts: 0, answered: 0, missedSkills: [], missedQuestions: [] },
    2: { correct: 0, attempts: 0, answered: 0, missedSkills: [], missedQuestions: [] },
    3: { correct: 0, attempts: 0, answered: 0, missedSkills: [], missedQuestions: [] },
    4: { correct: 0, attempts: 0, answered: 0, missedSkills: [], missedQuestions: [] },
    5: { correct: 0, attempts: 0, answered: 0, missedSkills: [], missedQuestions: [] },
    6: { correct: 0, attempts: 0, answered: 0, missedSkills: [], missedQuestions: [] }
};


// --------------------------------------------------
// RANDOM QUESTION SELECTION
// --------------------------------------------------

function selectRandomQuestions(questionBank, count) {
    if (!Array.isArray(questionBank)) {
        return [];
    }

    const pool = [...questionBank];

    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [pool[i], pool[j]] = [
            pool[j],
            pool[i]
        ];
    }

    return pool.slice(
        0,
        Math.min(count, pool.length)
    );
}


// --------------------------------------------------
// ANSWER CHECKING
// --------------------------------------------------

function checkQuestionAnswer(input, questionObj) {
    if (!input || !questionObj) {
        return false;
    }

    const normalize = (str) => {
        if (!str) {
            return '';
        }

        return String(str)
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[\*]/g, '')
            .replace(/≤/g, '<=')
            .replace(/≥/g, '>=')
            .replace(/²/g, '^2')
            .replace(/³/g, '^3')
            .replace(/⁴/g, '^4')
            .replace(/⁵/g, '^5')
            .replace(/⁶/g, '^6')
            .replace(/⁷/g, '^7')
            .replace(/⁸/g, '^8')
            .replace(/¹²/g, '^12')
            .replace(/⁻³/g, '^-3')
            .replace(/⁻⁵/g, '^-5')
            .replace(/⁻²/g, '^-2')
            .replace(/±/g, '+-')
            .replace(/^x=/, '')
            .replace(/^y=/, '')
            .replace(/^a=/, '')
            .replace(/^w=/, '')
            .replace(/^m=/, '');
    };

    const normInput = normalize(input);

    const primaryAns =
        String(questionObj.answer || '');

    const normPrimary =
        normalize(primaryAns);


    // Direct match
    if (normInput === normPrimary) {
        return true;
    }


    // Accepted answer alternatives
    if (Array.isArray(questionObj.accepted)) {
        for (const acceptedAnswer of questionObj.accepted) {
            if (
                normInput ===
                normalize(acceptedAnswer)
            ) {
                return true;
            }
        }
    }


    // Factored polynomial expressions
    const factorInput =
        normInput.match(
            /^\(([a-z0-9+-]+)\)\(([a-z0-9+-]+)\)$/
        );

    const factorTarget =
        normPrimary.match(
            /^\(([a-z0-9+-]+)\)\(([a-z0-9+-]+)\)$/
        );


    if (factorInput && factorTarget) {
        if (
            (
                factorInput[1] === factorTarget[1] &&
                factorInput[2] === factorTarget[2]
            ) ||
            (
                factorInput[1] === factorTarget[2] &&
                factorInput[2] === factorTarget[1]
            )
        ) {
            return true;
        }
    }


    // Ordered pairs
    const cleanParen = (s) =>
        s
            .replace(/^\(/, '')
            .replace(/\)$/, '')
            .replace(/^\{/, '')
            .replace(/\}$/, '');


    if (
        cleanParen(normInput) ===
        cleanParen(normPrimary)
    ) {
        return true;
    }


    // Multiple roots in either order
    const parseRoots = (s) =>
        s
            .replace(/and/g, ',')
            .replace(/or/g, ',')
            .split(',')
            .map(r => normalize(r))
            .filter(Boolean)
            .sort()
            .join(',');


    if (
        normPrimary.includes(',') ||
        normPrimary.includes('+-')
    ) {
        if (
            parseRoots(normInput) ===
            parseRoots(normPrimary)
        ) {
            return true;
        }
    }


    // Plus/minus square roots
    if (
        normPrimary === '+-5' ||
        normPrimary === '5,-5' ||
        normPrimary === '5'
    ) {
        if (
            [
                '5',
                '-5',
                '+-5',
                '5,-5',
                '-5,5'
            ].includes(normInput)
        ) {
            return true;
        }
    }


    if (
        normPrimary === '+-4' ||
        normPrimary === '4,-4' ||
        normPrimary === '4'
    ) {
        if (
            [
                '4',
                '-4',
                '+-4',
                '4,-4',
                '-4,4'
            ].includes(normInput)
        ) {
            return true;
        }
    }


    if (
        normPrimary === '+-7' ||
        normPrimary === '7,-7' ||
        normPrimary === '7'
    ) {
        if (
            [
                '7',
                '-7',
                '+-7',
                '7,-7',
                '-7,7'
            ].includes(normInput)
        ) {
            return true;
        }
    }


    if (
        normPrimary === '+-10' ||
        normPrimary === '10,-10' ||
        normPrimary === '10'
    ) {
        if (
            [
                '10',
                '-10',
                '+-10',
                '10,-10',
                '-10,10'
            ].includes(normInput)
        ) {
            return true;
        }
    }


    return false;
}


// --------------------------------------------------
// 240-QUESTION BANK
// 40 QUESTIONS PER LESSON
// --------------------------------------------------

const lessonsData = {

    // ==================================================
    // LESSON 1
    // ==================================================

    1: {
        title: "1. Linear Equations & Inequalities",
        icon: "x",

        refresher: `
            <p><strong>Quick Concept Refresher:</strong></p>

            <ul>
                <li>
                    <strong>Linear Equations:</strong>
                    Use inverse operations to isolate the variable.
                    (e.g., 3x + 7 = 22 &rarr; 3x = 15 &rarr; x = 5)
                </li>

                <li>
                    <strong>Inequalities:</strong>
                    When multiplying or dividing both sides by a negative number,
                    flip the inequality sign.
                </li>
            </ul>
        `,

        questions: [

            {
                question: "Solve: x + 9 = 17",
                answer: "8",
                skill: "one-step-equations",
                accepted: ["8", "x=8", "eight"]
            },

            {
                question: "Solve: x - 14 = 23",
                answer: "37",
                skill: "one-step-equations",
                accepted: ["37", "x=37"]
            },

            {
                question: "Solve: 4x = 36",
                answer: "9",
                skill: "one-step-equations",
                accepted: ["9", "x=9", "nine"]
            },

            {
                question: "Solve: x / 5 = 7",
                answer: "35",
                skill: "one-step-equations",
                accepted: ["35", "x=35"]
            },

            {
                question: "Solve: 3x + 7 = 22",
                answer: "5",
                skill: "two-step-equations",
                accepted: ["5", "x=5", "five"]
            },

            {
                question: "Solve: 5x - 9 = 16",
                answer: "5",
                skill: "two-step-equations",
                accepted: ["5", "x=5", "five"]
            },

            {
                question: "Solve: 2x + 11 = 25",
                answer: "7",
                skill: "two-step-equations",
                accepted: ["7", "x=7", "seven"]
            },

            {
                question: "Solve: 6x - 4 = 20",
                answer: "4",
                skill: "two-step-equations",
                accepted: ["4", "x=4", "four"]
            },

            {
                question: "Solve: -4x + 12 = -8",
                answer: "5",
                skill: "two-step-equations",
                accepted: ["5", "x=5", "five"]
            },

            {
                question: "Solve: 8 - 3x = 29",
                answer: "-7",
                skill: "two-step-equations",
                accepted: ["-7", "x=-7", "negative 7"]
            },

            {
                question: "Solve: 4(x - 2) = 20",
                answer: "7",
                skill: "distributive-property",
                accepted: ["7", "x=7", "seven"]
            },

            {
                question: "Solve: 3(x + 2) = 18",
                answer: "4",
                skill: "distributive-property",
                accepted: ["4", "x=4", "four"]
            },

            {
                question: "Solve: 2(3x - 1) = 28",
                answer: "5",
                skill: "distributive-property",
                accepted: ["5", "x=5", "five"]
            },

            {
                question: "Solve: -5(x + 3) = -35",
                answer: "4",
                skill: "distributive-property",
                accepted: ["4", "x=4", "four"]
            },

            {
                question: "Solve: 6(2x - 3) = 42",
                answer: "5",
                skill: "distributive-property",
                accepted: ["5", "x=5", "five"]
            },

            {
                question: "Solve: 7x - 5 = 2x + 15",
                answer: "4",
                skill: "variables-on-both-sides",
                accepted: ["4", "x=4", "four"]
            },

            {
                question: "Solve: 9x + 4 = 3x + 28",
                answer: "4",
                skill: "variables-on-both-sides",
                accepted: ["4", "x=4", "four"]
            },

            {
                question: "Solve: 5x - 8 = 12 - 5x",
                answer: "2",
                skill: "variables-on-both-sides",
                accepted: ["2", "x=2", "two"]
            },

            {
                question: "Solve: 4x + 10 = 2(x + 9)",
                answer: "4",
                skill: "variables-on-both-sides",
                accepted: ["4", "x=4", "four"]
            },

            {
                question: "Solve: 3(2x + 4) = 4(x + 5)",
                answer: "4",
                skill: "variables-on-both-sides",
                accepted: ["4", "x=4", "four"]
            },

            {
                question: "Solve: 2x + 3x - 5 = 20",
                answer: "5",
                skill: "multi-step-equations",
                accepted: ["5", "x=5", "five"]
            },

            {
                question: "Solve: 8x - 3(x - 2) = 26",
                answer: "4",
                skill: "multi-step-equations",
                accepted: ["4", "x=4", "four"]
            },

            {
                question: "Solve: 10 - 2(x + 1) = 4",
                answer: "2",
                skill: "multi-step-equations",
                accepted: ["2", "x=2", "two"]
            },

            {
                question: "Solve: x/2 + x/3 = 10",
                answer: "12",
                skill: "clearing-fractions",
                accepted: ["12", "x=12", "twelve"]
            },

            {
                question: "Solve: (2x + 4)/3 = 6",
                answer: "7",
                skill: "clearing-fractions",
                accepted: ["7", "x=7", "seven"]
            },

            {
                question: "Solve: x + 6 > 11",
                answer: "x > 5",
                skill: "one-step-inequalities",
                accepted: ["x > 5", "x>5", "5 < x", "5"]
            },

            {
                question: "Solve: x - 4 ≤ 9",
                answer: "x ≤ 13",
                skill: "one-step-inequalities",
                accepted: ["x ≤ 13", "x<=13", "13 >= x", "13"]
            },

            {
                question: "Solve: 2x + 5 > 13",
                answer: "x > 4",
                skill: "two-step-inequalities",
                accepted: ["x > 4", "x>4", "4 < x", "4"]
            },

            {
                question: "Solve: 3x - 2 ≤ 10",
                answer: "x ≤ 4",
                skill: "two-step-inequalities",
                accepted: ["x ≤ 4", "x<=4", "4 >= x", "4"]
            },

            {
                question: "Solve: 4x + 7 < 31",
                answer: "x < 6",
                skill: "two-step-inequalities",
                accepted: ["x < 6", "x<6", "6 > x", "6"]
            },

            {
                question: "Solve: 5x - 3 ≥ 22",
                answer: "x ≥ 5",
                skill: "two-step-inequalities",
                accepted: ["x ≥ 5", "x>=5", "5 <= x", "5"]
            },

            {
                question: "Solve: -2x + 8 < 2",
                answer: "x > 3",
                skill: "solving-inequalities-negative-division",
                accepted: ["x > 3", "x>3", "3 < x", "3"]
            },

            {
                question: "Solve: -3x - 4 ≥ 11",
                answer: "x ≤ -5",
                skill: "solving-inequalities-negative-division",
                accepted: ["x ≤ -5", "x<=-5", "-5 >= x", "-5"]
            },

            {
                question: "Solve: 2(x - 4) > 6",
                answer: "x > 7",
                skill: "multi-step-inequalities",
                accepted: ["x > 7", "x>7", "7 < x", "7"]
            },

            {
                question: "Solve: 3(2x + 1) ≤ 27",
                answer: "x ≤ 4",
                skill: "multi-step-inequalities",
                accepted: ["x ≤ 4", "x<=4", "4 >= x", "4"]
            },

            {
                question: "Solve: 5x + 2 > 2x + 11",
                answer: "x > 3",
                skill: "variables-on-both-sides-inequalities",
                accepted: ["x > 3", "x>3", "3 < x", "3"]
            },

            {
                question: "Solve for x in terms of y: y = 2x + 6",
                answer: "(y - 6)/2",
                skill: "literal-equations",
                accepted: ["(y-6)/2", "y/2 - 3", "(y - 6) / 2"]
            },

            {
                question: "Solve for w in terms of A and l: A = l * w",
                answer: "A/l",
                skill: "literal-equations",
                accepted: ["A/l", "a/l", "A / l"]
            },

            {
                question: "Solve for x in terms of a, b, c: ax + b = c",
                answer: "(c - b)/a",
                skill: "literal-equations",
                accepted: ["(c-b)/a", "(c - b)/a", "(c-b) / a"]
            },

            {
                question: "What is the smallest integer that satisfies 2x > 9?",
                answer: "5",
                skill: "interpreting-inequalities",
                accepted: ["5", "five"]
            }
        ]
    },


    // ==================================================
    // LESSON 2
    // ==================================================

    2: {
        title: "2. Systems of Equations",
        icon: "{x,y}",

        refresher: `
            <p><strong>Quick Concept Refresher:</strong></p>

            <ul>
                <li>
                    <strong>Substitution:</strong>
                    Solve one equation for a variable and substitute it into the other.
                </li>

                <li>
                    <strong>Elimination:</strong>
                    Add or subtract equations to cancel out one variable.
                </li>
            </ul>
        `,

        questions: [

            { question: "Solve the system: y = 2x + 1 and y = 7. What is x?", answer: "3", skill: "substitution-method", accepted: ["3", "x=3", "three"] },
            { question: "Solve the system: y = 3x - 2 and y = 10. What is x?", answer: "4", skill: "substitution-method", accepted: ["4", "x=4", "four"] },
            { question: "Solve the system: y = 4x and 2x + y = 18. What is x?", answer: "3", skill: "substitution-method", accepted: ["3", "x=3", "three"] },
            { question: "Solve the system: y = x + 3 and 2x + y = 12. What is x?", answer: "3", skill: "substitution-method", accepted: ["3", "x=3", "three"] },
            { question: "Solve the system: 3x + 2y = 16 and y = 2. What is x?", answer: "4", skill: "substitution-method", accepted: ["4", "x=4", "four"] },
            { question: "Solve the system: x = 2y - 1 and 3x + y = 11. What is y?", answer: "2", skill: "substitution-method", accepted: ["2", "y=2", "two"] },
            { question: "Solve the system: y = -2x + 8 and y = x + 2. What is x?", answer: "2", skill: "substitution-method", accepted: ["2", "x=2", "two"] },

            { question: "Solve the system: x + y = 10 and x - y = 4. What is x?", answer: "7", skill: "elimination-method", accepted: ["7", "x=7", "seven"] },
            { question: "Solve the system: x + y = 10 and x - y = 4. What is y?", answer: "3", skill: "elimination-method", accepted: ["3", "y=3", "three"] },
            { question: "Solve the system: x + y = 12 and 2x + y = 17. What is x?", answer: "5", skill: "elimination-method", accepted: ["5", "x=5", "five"] },
            { question: "Solve the system: x + 2y = 8 and x - 2y = 4. What is x?", answer: "6", skill: "elimination-method", accepted: ["6", "x=6", "six"] },
            { question: "Solve the system: x + 2y = 8 and x - 2y = 4. What is y?", answer: "1", skill: "elimination-method", accepted: ["1", "y=1", "one"] },
            { question: "Solve the system: 2x + 3y = 13 and 2x + y = 7. What is y?", answer: "3", skill: "elimination-method", accepted: ["3", "y=3", "three"] },
            { question: "Solve the system: 3x + 2y = 19 and 3x - y = 10. What is y?", answer: "3", skill: "elimination-method", accepted: ["3", "y=3", "three"] },
            { question: "Solve the system: 2x + y = 9 and 3x - y = 11. What is x?", answer: "4", skill: "elimination-method", accepted: ["4", "x=4", "four"] },
            { question: "Solve the system: 4x + 3y = 25 and 4x - y = 9. What is y?", answer: "4", skill: "elimination-method", accepted: ["4", "y=4", "four"] },

            { question: "Solve the system: 2x + y = 11 and y = 3. What is (x, y)?", answer: "(4, 3)", skill: "system-coordinate-solutions", accepted: ["(4, 3)", "(4,3)", "4, 3", "4,3", "x=4, y=3"] },
            { question: "Solve the system: x + y = 7 and x - y = 1. What is (x, y)?", answer: "(4, 3)", skill: "system-coordinate-solutions", accepted: ["(4, 3)", "(4,3)", "4, 3", "4,3", "x=4, y=3"] },
            { question: "Solve the system: y = 2x and x + y = 9. What is (x, y)?", answer: "(3, 6)", skill: "system-coordinate-solutions", accepted: ["(3, 6)", "(3,6)", "3, 6", "3,6", "x=3, y=6"] },
            { question: "Solve the system: 3x + y = 10 and x = 2. What is (x, y)?", answer: "(2, 4)", skill: "system-coordinate-solutions", accepted: ["(2, 4)", "(2,4)", "2, 4", "2,4", "x=2, y=4"] },
            { question: "Solve the system: x - 2y = 0 and 2x + y = 15. What is (x, y)?", answer: "(6, 3)", skill: "system-coordinate-solutions", accepted: ["(6, 3)", "(6,3)", "6, 3", "6,3", "x=6, y=3"] },
            { question: "Solve the system: y = x + 1 and y = 2x - 3. What is (x, y)?", answer: "(4, 5)", skill: "system-coordinate-solutions", accepted: ["(4, 5)", "(4,5)", "4, 5", "4,5", "x=4, y=5"] },

            { question: "Two lines y = 3x - 1 and y = -x + 7 intersect. What is the x-coordinate of intersection?", answer: "2", skill: "graphical-intersection", accepted: ["2", "x=2", "two"] },
            { question: "Two lines y = 2x + 4 and y = -x + 10 intersect. What is the y-coordinate of intersection?", answer: "8", skill: "graphical-intersection", accepted: ["8", "y=8", "eight"] },
            { question: "Two lines y = 4x - 5 and y = x + 4 intersect. What is the x-coordinate of intersection?", answer: "3", skill: "graphical-intersection", accepted: ["3", "x=3", "three"] },

            { question: "How many solutions does the system y = 2x + 5 and y = 2x - 3 have? (0, 1, or infinite)", answer: "0", skill: "number-of-solutions", accepted: ["0", "zero", "none", "no solution", "0 solutions"] },
            { question: "How many solutions does the system y = 3x + 1 and 2y = 6x + 2 have? (0, 1, or infinite)", answer: "infinite", skill: "number-of-solutions", accepted: ["infinite", "infinitely many", "infinite solutions"] },
            { question: "How many solutions does the system y = 4x - 2 and y = -x + 8 have? (0, 1, or infinite)", answer: "1", skill: "number-of-solutions", accepted: ["1", "one", "1 solution", "one solution"] },
            { question: "If two linear lines have equal slopes and different y-intercepts, how many intersection points exist?", answer: "0", skill: "number-of-solutions", accepted: ["0", "zero", "none", "no solution"] },

            { question: "If x + 2y = 10 and x = 4, find y.", answer: "3", skill: "solving-for-variable", accepted: ["3", "y=3", "three"] },
            { question: "If 2x - y = 7 and y = 3, find x.", answer: "5", skill: "solving-for-variable", accepted: ["5", "x=5", "five"] },
            { question: "If 3x + 4y = 24 and y = 0, find x.", answer: "8", skill: "solving-for-variable", accepted: ["8", "x=8", "eight"] },
            { question: "If 5x - 2y = 20 and x = 0, find y.", answer: "-10", skill: "solving-for-variable", accepted: ["-10", "y=-10", "negative 10"] },

            { question: "The sum of two numbers is 18 and their difference is 4. What is the larger number?", answer: "11", skill: "systems-word-problems", accepted: ["11", "eleven"] },
            { question: "The sum of two numbers is 20 and their difference is 6. What is the smaller number?", answer: "7", skill: "systems-word-problems", accepted: ["7", "seven"] },
            { question: "Tickets for adults cost $8 and children cost $5. If 10 tickets total cost $62, how many adult tickets were sold?", answer: "4", skill: "systems-word-problems", accepted: ["4", "four"] },
            { question: "A store sells apples (a) for $2 and bananas (b) for $1. If 12 fruits total cost $18, how many apples were bought?", answer: "6", skill: "systems-word-problems", accepted: ["6", "six"] },

            { question: "Is the point (2, 3) a solution to x + y = 5 and 2x - y = 1? (yes or no)", answer: "yes", skill: "interpreting-systems", accepted: ["yes", "true"] },
            { question: "Is the point (1, 4) a solution to 2x + y = 6 and x - y = 2? (yes or no)", answer: "no", skill: "interpreting-systems", accepted: ["no", "false"] },

            { question: "Solve the system: 5x + 2y = 29 and 2x + 2y = 14. What is x?", answer: "5", skill: "elimination-method", accepted: ["5", "x=5", "five"] }
        ]
    },


    // ==================================================
    // LESSON 3
    // ==================================================

    3: {
        title: "3. Functions",
        icon: "f(x)",

        refresher: `
            <p><strong>Quick Concept Refresher:</strong></p>

            <ul>
                <li>
                    <strong>Function Notation:</strong>
                    f(x) represents the output value for an input x.
                    (e.g., f(4) = 2(4) + 3 = 11)
                </li>

                <li>
                    <strong>Rate of Change:</strong>
                    &Delta;y / &Delta;x
                    (change in y divided by change in x).
                </li>
            </ul>
        `,

        questions: [

            { question: "If f(x) = 2x + 3, find f(4).", answer: "11", skill: "evaluating-functions", accepted: ["11", "f(4)=11", "eleven"] },
            { question: "If f(x) = 3x - 5, find f(6).", answer: "13", skill: "evaluating-functions", accepted: ["13", "f(6)=13", "thirteen"] },
            { question: "If f(x) = -4x + 9, find f(2).", answer: "1", skill: "evaluating-functions", accepted: ["1", "f(2)=1", "one"] },
            { question: "If f(x) = 10 - 2x, find f(7).", answer: "-4", skill: "evaluating-functions", accepted: ["-4", "f(7)=-4", "negative 4"] },
            { question: "If g(x) = x² - 1, find g(3).", answer: "8", skill: "evaluating-functions", accepted: ["8", "g(3)=8", "eight"] },
            { question: "If g(x) = x² + 2, find g(4).", answer: "18", skill: "evaluating-functions", accepted: ["18", "g(4)=18", "eighteen"] },
            { question: "If g(x) = 2x² - 3, find g(3).", answer: "15", skill: "evaluating-functions", accepted: ["15", "g(3)=15", "fifteen"] },
            { question: "If h(x) = x² + 3x - 4, find h(2).", answer: "6", skill: "evaluating-functions", accepted: ["6", "h(2)=6", "six"] },
            { question: "If f(x) = 3x + 1, find f(5).", answer: "16", skill: "evaluating-functions", accepted: ["16", "f(5)=16", "sixteen"] },

            { question: "If f(x) = 5x - 2 and f(x) = 18, find x.", answer: "4", skill: "solving-function-inputs", accepted: ["4", "x=4", "four"] },
            { question: "If f(x) = 4x + 5 and f(x) = 21, find x.", answer: "4", skill: "solving-function-inputs", accepted: ["4", "x=4", "four"] },
            { question: "If f(x) = 2x - 7 and f(x) = 11, find x.", answer: "9", skill: "solving-function-inputs", accepted: ["9", "x=9", "nine"] },
            { question: "If f(x) = -3x + 12 and f(x) = 0, find x.", answer: "4", skill: "solving-function-inputs", accepted: ["4", "x=4", "four"] },
            { question: "If g(x) = 2x + 8 and g(x) = 20, find x.", answer: "6", skill: "solving-function-inputs", accepted: ["6", "x=6", "six"] },

            { question: "The table contains the points (1, 4), (2, 7), (3, 10). What is the rate of change?", answer: "3", skill: "rate-of-change", accepted: ["3", "three", "m=3"] },
            { question: "The table contains the points (0, 2), (1, 6), (2, 10). What is the rate of change?", answer: "4", skill: "rate-of-change", accepted: ["4", "four", "m=4"] },
            { question: "The table contains the points (2, 9), (4, 15), (6, 21). What is the rate of change?", answer: "3", skill: "rate-of-change", accepted: ["3", "three", "m=3"] },
            { question: "Find the slope between the points (1, 3) and (5, 11).", answer: "2", skill: "rate-of-change", accepted: ["2", "two", "m=2"] },
            { question: "Find the slope between the points (2, 10) and (6, 2).", answer: "-2", skill: "rate-of-change", accepted: ["-2", "negative 2", "m=-2"] },
            { question: "Find the slope between the points (0, 5) and (3, 14).", answer: "3", skill: "rate-of-change", accepted: ["3", "three", "m=3"] },

            { question: "What is the y-intercept of the function f(x) = -3x + 7?", answer: "7", skill: "identifying-intercepts", accepted: ["7", "y=7", "(0, 7)", "(0,7)"] },
            { question: "What is the y-intercept of the function y = 4x - 9?", answer: "-9", skill: "identifying-intercepts", accepted: ["-9", "y=-9", "(0, -9)", "(0,-9)"] },
            { question: "What is the x-intercept of the function f(x) = 2x - 8?", answer: "4", skill: "identifying-intercepts", accepted: ["4", "x=4", "(4, 0)", "(4,0)"] },
            { question: "What is the x-intercept of the function f(x) = 3x + 15?", answer: "-5", skill: "identifying-intercepts", accepted: ["-5", "x=-5", "(-5, 0)", "(-5,0)"] },

            { question: "Does the set of points {(1, 2), (2, 3), (1, 4)} represent a function? (yes or no)", answer: "no", skill: "defining-functions", accepted: ["no", "false"] },
            { question: "Does the set of points {(3, 5), (4, 5), (5, 5)} represent a function? (yes or no)", answer: "yes", skill: "defining-functions", accepted: ["yes", "true"] },
            { question: "Does a vertical line on a graph pass the vertical line test? (yes or no)", answer: "no", skill: "defining-functions", accepted: ["no", "false"] },
            { question: "Does a horizontal line on a graph represent a function? (yes or no)", answer: "yes", skill: "defining-functions", accepted: ["yes", "true"] },

            { question: "What is the domain of {(1, 4), (2, 8), (3, 12)}?", answer: "{1, 2, 3}", skill: "domain-and-range", accepted: ["{1,2,3}", "{1, 2, 3}", "1, 2, 3", "1,2,3"] },
            { question: "What is the range of {(2, 5), (3, 7), (4, 9)}?", answer: "{5, 7, 9}", skill: "domain-and-range", accepted: ["{5,7,9}", "{5, 7, 9}", "5, 7, 9", "5,7,9"] },
            { question: "For f(x) = sqrt(x - 3), what is the minimum value in the domain?", answer: "3", skill: "domain-and-range", accepted: ["3", "x=3", "three"] },
            { question: "If f(x) = x² + 1, what is the minimum value in the range?", answer: "1", skill: "domain-and-range", accepted: ["1", "y=1", "one"] },

            { question: "If f(x) = 2x, how is g(x) = 2x + 4 transformed from f(x)? (shifted up 4 or shifted right 4)", answer: "shifted up 4", skill: "function-transformations", accepted: ["shifted up 4", "up 4", "shifted up"] },
            { question: "If f(x) = x², which direction does g(x) = (x - 3)² shift f(x)? (left, right, up, or down)", answer: "right", skill: "function-transformations", accepted: ["right", "shifted right", "right 3"] },
            { question: "If f(x) = x², which direction does g(x) = x² - 5 shift f(x)? (left, right, up, or down)", answer: "down", skill: "function-transformations", accepted: ["down", "shifted down", "down 5"] },

            { question: "If f(x) = x + 2 and g(x) = 3x, find f(g(2)).", answer: "8", skill: "composite-functions", accepted: ["8", "eight"] },
            { question: "If f(x) = 2x and g(x) = x + 5, find g(f(3)).", answer: "11", skill: "composite-functions", accepted: ["11", "eleven"] },

            { question: "What is the value of f(0) for f(x) = 7x - 13?", answer: "-13", skill: "evaluating-functions", accepted: ["-13", "negative 13"] },

            { question: "If f(x) = 2^x, find f(3).", answer: "8", skill: "exponential-functions", accepted: ["8", "eight"] },
            { question: "If f(x) = 3 * 2^x, find f(2).", answer: "12", skill: "exponential-functions", accepted: ["12", "twelve"] }
        ]
    },


    // ==================================================
    // LESSON 4
    // ==================================================

    4: {
        title: "4. Exponents & Polynomials",
        icon: "xⁿ",

        refresher: `
            <p><strong>Quick Concept Refresher:</strong></p>

            <ul>
                <li>
                    <strong>Exponent Rules:</strong>
                    (xᵃ)(xᵇ) = xᵃ⁺ᵇ,
                    (xᵃ) / (xᵇ) = xᵃ⁻ᵇ,
                    (xᵃ)ᵇ = xᵃᵇ,
                    and x⁰ = 1.
                </li>

                <li>
                    <strong>Polynomials:</strong>
                    Combine like terms when adding or subtracting.
                </li>
            </ul>
        `,

        questions: [

            { question: "Simplify: (x³)(x⁴)", answer: "x⁷", skill: "product-rule-exponents", accepted: ["x^7", "x⁷", "x7"] },
            { question: "Simplify: (x⁵)(x²)", answer: "x⁷", skill: "product-rule-exponents", accepted: ["x^7", "x⁷", "x7"] },
            { question: "Simplify: (2x³)(4x²)", answer: "8x⁵", skill: "product-rule-exponents", accepted: ["8x^5", "8x⁵", "8x5"] },
            { question: "Simplify: (3x)(5x⁴)", answer: "15x⁵", skill: "product-rule-exponents", accepted: ["15x^5", "15x⁵", "15x5"] },

            { question: "Simplify: (x⁶) / (x²)", answer: "x⁴", skill: "quotient-rule-exponents", accepted: ["x^4", "x⁴", "x4"] },
            { question: "Simplify: (x⁸) / (x³)", answer: "x⁵", skill: "quotient-rule-exponents", accepted: ["x^5", "x⁵", "x5"] },
            { question: "Simplify: (12x⁵) / (3x²)", answer: "4x³", skill: "quotient-rule-exponents", accepted: ["4x^3", "4x³", "4x3"] },
            { question: "Simplify: (20x⁷) / (5x⁴)", answer: "4x³", skill: "quotient-rule-exponents", accepted: ["4x^3", "4x³", "4x3"] },

            { question: "Simplify: (2x³)²", answer: "4x⁶", skill: "power-of-a-power", accepted: ["4x^6", "4x⁶", "4x6"] },
            { question: "Simplify: (x⁴)³", answer: "x¹²", skill: "power-of-a-power", accepted: ["x^12", "x¹²", "x12"] },
            { question: "Simplify: (3x²)³", answer: "27x⁶", skill: "power-of-a-power", accepted: ["27x^6", "27x⁶", "27x6"] },
            { question: "Simplify: (5x)³", answer: "125x³", skill: "power-of-a-power", accepted: ["125x^3", "125x³", "125x3"] },

            { question: "Evaluate: 5⁰", answer: "1", skill: "zero-exponent-rule", accepted: ["1", "one"] },
            { question: "Evaluate: 128⁰", answer: "1", skill: "zero-exponent-rule", accepted: ["1", "one"] },
            { question: "Evaluate: (3x)⁰", answer: "1", skill: "zero-exponent-rule", accepted: ["1", "one"] },
            { question: "Evaluate: 4 * x⁰", answer: "4", skill: "zero-exponent-rule", accepted: ["4", "four"] },

            { question: "Rewrite with positive exponents: x⁻³", answer: "1/x³", skill: "negative-exponents", accepted: ["1/x^3", "1/x³", "1 / x^3", "1 / x³"] },
            { question: "Rewrite with positive exponents: x⁻⁵", answer: "1/x⁵", skill: "negative-exponents", accepted: ["1/x^5", "1/x⁵", "1 / x^5", "1 / x⁵"] },
            { question: "Evaluate: 2⁻³", answer: "1/8", skill: "negative-exponents", accepted: ["1/8", "0.125", "1 / 8"] },
            { question: "Evaluate: 4⁻²", answer: "1/16", skill: "negative-exponents", accepted: ["1/16", "0.0625", "1 / 16"] },

            { question: "Simplify: (3x² + 5x) + (2x² - 3x)", answer: "5x² + 2x", skill: "adding-polynomials", accepted: ["5x^2 + 2x", "5x²+2x", "5x^2+2x"] },
            { question: "Simplify: (4x² + 2x + 7) + (3x² + 5x - 2)", answer: "7x² + 7x + 5", skill: "adding-polynomials", accepted: ["7x^2 + 7x + 5", "7x²+7x+5", "7x^2+7x+5"] },
            { question: "Simplify: (6x + 8) + (2x - 3)", answer: "8x + 5", skill: "adding-polynomials", accepted: ["8x + 5", "8x+5"] },
            { question: "Simplify: (x³ + 2x) + (3x³ - 5x)", answer: "4x³ - 3x", skill: "adding-polynomials", accepted: ["4x^3 - 3x", "4x³-3x", "4x^3-3x"] },

            { question: "Simplify: (7x + 4) - (3x - 2)", answer: "4x + 6", skill: "subtracting-polynomials", accepted: ["4x + 6", "4x+6"] },
            { question: "Simplify: (5x² + 4x) - (2x² + x)", answer: "3x² + 3x", skill: "subtracting-polynomials", accepted: ["3x^2 + 3x", "3x²+3x", "3x^2+3x"] },
            { question: "Simplify: (8x² - 3x + 5) - (2x² + 4x - 1)", answer: "6x² - 7x + 6", skill: "subtracting-polynomials", accepted: ["6x^2 - 7x + 6", "6x²-7x+6", "6x^2-7x+6"] },
            { question: "Simplify: (10x + 6) - (4x + 9)", answer: "6x - 3", skill: "subtracting-polynomials", accepted: ["6x - 3", "6x-3"] },

            { question: "Multiply: 2x(3x + 4)", answer: "6x² + 8x", skill: "multiplying-monomial-polynomial", accepted: ["6x^2 + 8x", "6x²+8x", "6x^2+8x"] },
            { question: "Multiply: 3x²(2x - 5)", answer: "6x³ - 15x²", skill: "multiplying-monomial-polynomial", accepted: ["6x^3 - 15x^2", "6x³-15x²", "6x^3-15x^2"] },
            { question: "Multiply: -4x(2x² + 3)", answer: "-8x³ - 12x", skill: "multiplying-monomial-polynomial", accepted: ["-8x^3 - 12x", "-8x³-12x", "-8x^3-12x"] },
            { question: "Multiply: 5x(x² - 2x + 4)", answer: "5x³ - 10x² + 20x", skill: "multiplying-monomial-polynomial", accepted: ["5x^3 - 10x^2 + 20x", "5x³-10x²+20x"] },

            { question: "Multiply: (x + 3)(x + 2)", answer: "x² + 5x + 6", skill: "multiplying-binomials", accepted: ["x^2 + 5x + 6", "x²+5x+6", "x^2+5x+6"] },
            { question: "Multiply: (x + 4)(x + 5)", answer: "x² + 9x + 20", skill: "multiplying-binomials", accepted: ["x^2 + 9x + 20", "x²+9x+20", "x^2+9x+20"] },
            { question: "Multiply: (x - 3)(x + 2)", answer: "x² - x - 6", skill: "multiplying-binomials", accepted: ["x^2 - x - 6", "x²-x-6", "x^2-x-6"] },
            { question: "Multiply: (x - 4)(x - 2)", answer: "x² - 6x + 8", skill: "multiplying-binomials", accepted: ["x^2 - 6x + 8", "x²-6x+8", "x^2-6x+8"] },

            { question: "Multiply: (x + 5)(x - 5)", answer: "x² - 25", skill: "difference-of-squares", accepted: ["x^2 - 25", "x²-25", "x^2-25"] },

            { question: "Multiply: (2x + 1)(x + 3)", answer: "2x² + 7x + 3", skill: "multiplying-binomials", accepted: ["2x^2 + 7x + 3", "2x²+7x+3", "2x^2+7x+3"] },

            { question: "What is the degree of the polynomial 4x³ + 2x² - 7?", answer: "3", skill: "degree-of-polynomials", accepted: ["3", "three", "degree 3"] },

            { question: "What is the leading coefficient of 5x⁴ - 3x² + 2x - 1?", answer: "5", skill: "leading-coefficient", accepted: ["5", "five"] }
        ]
    },


    // ==================================================
    // LESSON 5
    // ==================================================

    5: {
        title: "5. Quadratic Functions",
        icon: "x²",

        refresher: `
            <p><strong>Quick Concept Refresher:</strong></p>

            <ul>
                <li>
                    <strong>Quadratic Equations:</strong>
                    Solve by factoring or taking square roots.
                    (e.g., x&sup2; = 25 &rarr; x = &plusmn;5)
                </li>

                <li>
                    <strong>Vertex Form:</strong>
                    y = a(x - h)&sup2; + k where (h, k) is the vertex
                    and a is the leading coefficient.
                </li>
            </ul>
        `,

        questions: [

            { question: "Solve: x² = 25", answer: "±5", skill: "solving-quadratic-square-roots", accepted: ["5", "-5", "±5", "+-5", "5, -5", "-5, 5"] },
            { question: "Solve: x² = 16", answer: "±4", skill: "solving-quadratic-square-roots", accepted: ["4", "-4", "±4", "+-4", "4, -4", "-4, 4"] },
            { question: "Solve: x² = 49", answer: "±7", skill: "solving-quadratic-square-roots", accepted: ["7", "-7", "±7", "+-7", "7, -7", "-7, 7"] },
            { question: "Solve: x² = 100", answer: "±10", skill: "solving-quadratic-square-roots", accepted: ["10", "-10", "±10", "+-10", "10, -10", "-10, 10"] },
            { question: "Solve: 2x² = 32", answer: "±4", skill: "solving-quadratic-square-roots", accepted: ["4", "-4", "±4", "+-4", "4, -4", "-4, 4"] },
            { question: "Solve: 3x² = 75", answer: "±5", skill: "solving-quadratic-square-roots", accepted: ["5", "-5", "±5", "+-5", "5, -5", "-5, 5"] },

            { question: "Factor: x² + 5x + 6", answer: "(x + 2)(x + 3)", skill: "factoring-quadratics", accepted: ["(x+2)(x+3)", "(x+3)(x+2)", "(x + 2)(x + 3)", "(x + 3)(x + 2)"] },
            { question: "Factor: x² + 7x + 12", answer: "(x + 3)(x + 4)", skill: "factoring-quadratics", accepted: ["(x+3)(x+4)", "(x+4)(x+3)", "(x + 3)(x + 4)", "(x + 4)(x + 3)"] },
            { question: "Factor: x² + 8x + 15", answer: "(x + 3)(x + 5)", skill: "factoring-quadratics", accepted: ["(x+3)(x+5)", "(x+5)(x+3)", "(x + 3)(x + 5)", "(x + 5)(x + 3)"] },
            { question: "Factor: x² + 6x + 8", answer: "(x + 2)(x + 4)", skill: "factoring-quadratics", accepted: ["(x+2)(x+4)", "(x+4)(x+2)", "(x + 2)(x + 4)", "(x + 4)(x + 2)"] },
            { question: "Factor: x² - 5x + 6", answer: "(x - 2)(x - 3)", skill: "factoring-quadratics", accepted: ["(x-2)(x-3)", "(x-3)(x-2)", "(x - 2)(x - 3)", "(x - 3)(x - 2)"] },
            { question: "Factor: x² - 7x + 10", answer: "(x - 2)(x - 5)", skill: "factoring-quadratics", accepted: ["(x-2)(x-5)", "(x-5)(x-2)", "(x - 2)(x - 5)", "(x - 5)(x - 2)"] },
            { question: "Factor: x² + 2x - 8", answer: "(x + 4)(x - 2)", skill: "factoring-quadratics", accepted: ["(x+4)(x-2)", "(x-2)(x+4)", "(x + 4)(x - 2)", "(x - 2)(x + 4)"] },
            { question: "Factor: x² - 3x - 10", answer: "(x - 5)(x + 2)", skill: "factoring-quadratics", accepted: ["(x-5)(x+2)", "(x+2)(x-5)", "(x - 5)(x + 2)", "(x + 2)(x - 5)"] },

            { question: "Factor: x² - 9", answer: "(x - 3)(x + 3)", skill: "difference-of-squares", accepted: ["(x-3)(x+3)", "(x+3)(x-3)", "(x - 3)(x + 3)", "(x + 3)(x - 3)"] },
            { question: "Factor: x² - 36", answer: "(x - 6)(x + 6)", skill: "difference-of-squares", accepted: ["(x-6)(x+6)", "(x+6)(x-6)", "(x - 6)(x + 6)", "(x + 6)(x - 6)"] },

            { question: "Factor out the GCF: 3x² + 6x", answer: "3x(x + 2)", skill: "factoring-gcf", accepted: ["3x(x+2)", "3x(x + 2)"] },
            { question: "Factor out the GCF: 4x² - 12x", answer: "4x(x - 3)", skill: "factoring-gcf", accepted: ["4x(x-3)", "4x(x - 3)"] },

            { question: "What is the vertex of y = (x - 3)² + 2?", answer: "(3, 2)", skill: "vertex-form", accepted: ["(3, 2)", "(3,2)", "3, 2", "3,2", "x=3, y=2"] },
            { question: "What is the vertex of y = (x + 2)² - 5?", answer: "(-2, -5)", skill: "vertex-form", accepted: ["(-2, -5)", "(-2,-5)", "-2, -5", "-2,-5", "x=-2, y=-5"] },
            { question: "What is the vertex of y = (x - 4)² - 7?", answer: "(4, -7)", skill: "vertex-form", accepted: ["(4, -7)", "(4,-7)", "4, -7", "4,-7", "x=4, y=-7"] },
            { question: "What is the vertex of y = (x + 1)² + 6?", answer: "(-1, 6)", skill: "vertex-form", accepted: ["(-1, 6)", "(-1,6)", "-1, 6", "-1,6", "x=-1, y=6"] },

            { question: "In y = 2(x - 4)² - 1, what is the value of a?", answer: "2", skill: "vertex-form-coefficients", accepted: ["2", "a=2", "two"] },
            { question: "In y = -3(x - 1)² + 6, what is the value of a?", answer: "-3", skill: "vertex-form-coefficients", accepted: ["-3", "a=-3", "negative 3"] },

            { question: "Does y = 2(x - 1)² + 3 open upward or downward?", answer: "upward", skill: "quadratic-direction", accepted: ["upward", "up"] },
            { question: "Does y = -4(x + 2)² - 5 open upward or downward?", answer: "downward", skill: "quadratic-direction", accepted: ["downward", "down"] },

            { question: "What is the axis of symmetry for y = (x - 5)² + 1?", answer: "x = 5", skill: "axis-of-symmetry", accepted: ["x = 5", "x=5", "5", "five"] },
            { question: "What is the axis of symmetry for y = (x + 3)² - 4?", answer: "x = -3", skill: "axis-of-symmetry", accepted: ["x = -3", "x=-3", "-3", "negative 3"] },
            { question: "What is the axis of symmetry for y = x² - 6x + 8?", answer: "x = 3", skill: "axis-of-symmetry", accepted: ["x = 3", "x=3", "3", "three"] },

            { question: "Solve: (x - 2)(x + 4) = 0. What are the roots?", answer: "2, -4", skill: "zero-product-property", accepted: ["2, -4", "2,-4", "-4, 2", "-4,2", "2 and -4"] },
            { question: "Solve: (x - 5)(x - 3) = 0. What are the roots?", answer: "5, 3", skill: "zero-product-property", accepted: ["5, 3", "5,3", "3, 5", "3,5", "5 and 3"] },
            { question: "Solve: x(x + 7) = 0. What are the roots?", answer: "0, -7", skill: "zero-product-property", accepted: ["0, -7", "0,-7", "-7, 0", "-7,0", "0 and -7"] },
            { question: "Solve: (2x - 4)(x + 3) = 0. What are the roots?", answer: "2, -3", skill: "zero-product-property", accepted: ["2, -3", "2,-3", "-3, 2", "-3,2", "2 and -3"] },
            { question: "What are the x-intercepts of y = (x - 1)(x - 6)?", answer: "1, 6", skill: "zero-product-property", accepted: ["1, 6", "1,6", "6, 1", "6,1", "1 and 6"] },

            { question: "Calculate the discriminant (b² - 4ac) for x² + 4x + 4 = 0.", answer: "0", skill: "discriminant-roots", accepted: ["0", "zero"] },
            { question: "Calculate the discriminant (b² - 4ac) for x² + 6x + 5 = 0.", answer: "16", skill: "discriminant-roots", accepted: ["16", "sixteen"] },
            { question: "If the discriminant of a quadratic equation is 0, how many real roots exist?", answer: "1", skill: "discriminant-roots", accepted: ["1", "one", "1 real root"] },
            { question: "If the discriminant is positive, how many real roots exist?", answer: "2", skill: "discriminant-roots", accepted: ["2", "two", "2 real roots"] },
            { question: "If the discriminant is negative, how many real roots exist?", answer: "0", skill: "discriminant-roots", accepted: ["0", "zero", "none", "no real roots"] },

            { question: "What is the y-intercept of y = x² + 4x - 12?", answer: "-12", skill: "identifying-intercepts", accepted: ["-12", "y=-12", "(0, -12)", "(0,-12)"] }
        ]
    },


    // ==================================================
    // LESSON 6
    // ==================================================

    6: {
        title: "6. Statistics & Data",
        icon: "📊",

        refresher: `
            <p><strong>Quick Concept Refresher:</strong></p>

            <ul>
                <li>
                    <strong>Measures of Center &amp; Spread:</strong>
                    Mean, Median, Mode, and Range.
                </li>

                <li>
                    <strong>Box Plots &amp; Regression:</strong>
                    IQR = Q3 - Q1.
                    Correlation coefficient r ranges from -1 to 1.
                </li>
            </ul>
        `,

        questions: [

            { question: "Find the mean of the dataset: 4, 8, 6, 10, 12.", answer: "8", skill: "measures-of-center-mean", accepted: ["8", "eight", "mean=8"] },
            { question: "Find the mean of the dataset: 2, 4, 6, 8.", answer: "5", skill: "measures-of-center-mean", accepted: ["5", "five", "mean=5"] },
            { question: "Find the mean of the dataset: 10, 20, 30, 40, 50.", answer: "30", skill: "measures-of-center-mean", accepted: ["30", "thirty", "mean=30"] },
            { question: "Find the mean of the dataset: 5, 15, 25.", answer: "15", skill: "measures-of-center-mean", accepted: ["15", "fifteen", "mean=15"] },

            { question: "Find the median of the dataset: 3, 5, 7, 9, 11.", answer: "7", skill: "measures-of-center-median", accepted: ["7", "seven", "median=7"] },
            { question: "Find the median of the dataset: 12, 4, 8, 16, 20.", answer: "12", skill: "measures-of-center-median", accepted: ["12", "twelve", "median=12"] },
            { question: "Find the median of the dataset: 2, 6, 8, 10.", answer: "7", skill: "measures-of-center-median", accepted: ["7", "seven", "median=7"] },
            { question: "Find the median of the dataset: 1, 3, 7, 9, 15, 21.", answer: "8", skill: "measures-of-center-median", accepted: ["8", "eight", "median=8"] },

            { question: "Find the mode of the dataset: 4, 7, 7, 9, 12.", answer: "7", skill: "measures-of-center-mode", accepted: ["7", "seven", "mode=7"] },
            { question: "Find the mode of the dataset: 2, 3, 5, 3, 8, 3, 9.", answer: "3", skill: "measures-of-center-mode", accepted: ["3", "three", "mode=3"] },

            { question: "Find the range of the dataset: 2, 5, 9, 14, 20.", answer: "18", skill: "measures-of-spread-range", accepted: ["18", "eighteen", "range=18"] },
            { question: "Find the range of the dataset: 15, 8, 23, 4, 19.", answer: "19", skill: "measures-of-spread-range", accepted: ["19", "nineteen", "range=19"] },
            { question: "Find the range of the dataset: 50, 65, 70, 95.", answer: "45", skill: "measures-of-spread-range", accepted: ["45", "forty five", "range=45"] },

            { question: "In a box plot, if Q1 = 12 and Q3 = 20, what is the interquartile range (IQR)?", answer: "8", skill: "interquartile-range", accepted: ["8", "eight", "iqr=8"] },
            { question: "In a box plot, if Q1 = 25 and Q3 = 40, what is the IQR?", answer: "15", skill: "interquartile-range", accepted: ["15", "fifteen", "iqr=15"] },
            { question: "In a box plot, if Q1 = 5 and Q3 = 18, what is the IQR?", answer: "13", skill: "interquartile-range", accepted: ["13", "thirteen", "iqr=13"] },

            { question: "In a box plot, if minimum = 4, Q1 = 10, median = 15, Q3 = 22, maximum = 30, what is the range?", answer: "26", skill: "interpreting-box-plots", accepted: ["26", "range=26"] },
            { question: "What percent of data lies between Q1 and Q3 in a box plot?", answer: "50%", skill: "interpreting-box-plots", accepted: ["50%", "50", "50 percent", "half"] },
            { question: "What percent of data lies below the median in a box plot?", answer: "50%", skill: "interpreting-box-plots", accepted: ["50%", "50", "50 percent", "half"] },
            { question: "What percent of data lies above Q3 in a box plot?", answer: "25%", skill: "interpreting-box-plots", accepted: ["25%", "25", "25 percent", "one fourth"] },

            { question: "What type of correlation is shown when y increases as x increases? (positive, negative, or none)", answer: "positive", skill: "interpreting-scatter-plots", accepted: ["positive", "positive correlation"] },
            { question: "What type of correlation is shown when y decreases as x increases? (positive, negative, or none)", answer: "negative", skill: "interpreting-scatter-plots", accepted: ["negative", "negative correlation"] },
            { question: "If there is no apparent pattern between x and y on a scatter plot, what is the correlation? (positive, negative, or none)", answer: "none", skill: "interpreting-scatter-plots", accepted: ["none", "no correlation", "zero"] },

            { question: "If a linear regression equation is y = 2.5x + 10, predict y when x = 4.", answer: "20", skill: "linear-regression-predictions", accepted: ["20", "twenty", "y=20"] },
            { question: "If a linear regression equation is y = 3x - 5, predict y when x = 6.", answer: "13", skill: "linear-regression-predictions", accepted: ["13", "thirteen", "y=13"] },
            { question: "If a linear regression equation is y = -2x + 50, predict y when x = 10.", answer: "30", skill: "linear-regression-predictions", accepted: ["30", "thirty", "y=30"] },
            { question: "If a linear regression equation is y = 1.5x + 8, predict y when x = 8.", answer: "20", skill: "linear-regression-predictions", accepted: ["20", "twenty", "y=20"] },

            { question: "A correlation coefficient r = -0.92 indicates what strength and direction? (strong negative or weak positive)", answer: "strong negative", skill: "correlation-coefficient", accepted: ["strong negative", "negative strong"] },
            { question: "A correlation coefficient r = 0.88 indicates what strength and direction? (strong positive or weak negative)", answer: "strong positive", skill: "correlation-coefficient", accepted: ["strong positive", "positive strong"] },
            { question: "Which r-value represents the strongest linear relationship: 0.35, -0.85, or 0.70?", answer: "-0.85", skill: "correlation-coefficient", accepted: ["-0.85", "-.85"] },
            { question: "Which r-value indicates a perfect positive linear relationship: 0, 0.5, or 1?", answer: "1", skill: "correlation-coefficient", accepted: ["1", "one", "1.0"] },

            { question: "Given actual value y = 10 and predicted value y = 8, what is the residual (actual - predicted)?", answer: "2", skill: "calculating-residuals", accepted: ["2", "two", "residual=2"] },
            { question: "Given actual value y = 15 and predicted value y = 19, what is the residual (actual - predicted)?", answer: "-4", skill: "calculating-residuals", accepted: ["-4", "negative 4", "residual=-4"] },
            { question: "Given actual value y = 24 and predicted value y = 20, what is the residual?", answer: "4", skill: "calculating-residuals", accepted: ["4", "four", "residual=4"] },

            { question: "If a residual plot shows a clear curved U-shape pattern, is a linear model appropriate? (yes or no)", answer: "no", skill: "residual-plots", accepted: ["no", "false"] },
            { question: "If a residual plot shows points randomly scattered around 0, is a linear model appropriate? (yes or no)", answer: "yes", skill: "residual-plots", accepted: ["yes", "true"] },

            { question: "What is a data point that is substantially different from the rest of the data called?", answer: "outlier", skill: "identifying-outliers", accepted: ["outlier", "an outlier"] },

            { question: "If a high outlier is added to a dataset, does the mean increase or decrease?", answer: "increase", skill: "outlier-effects-on-measures", accepted: ["increase", "increases"] },
            { question: "Which measure of center is most resistant to extreme outliers: mean or median?", answer: "median", skill: "outlier-effects-on-measures", accepted: ["median", "the median"] },

            { question: "In a survey of 40 students, 24 prefer math. What percentage of students prefer math?", answer: "60%", skill: "frequency-tables", accepted: ["60%", "60", "60 percent"] }
        ]
    }
};


// --------------------------------------------------
// INITIALIZE DASHBOARD
// --------------------------------------------------

document.addEventListener(
    'DOMContentLoaded',
    () => {
        initDashboard();
    }
);


function initDashboard() {

    const saveBtn =
        document.getElementById(
            'saveNameBtn'
        );

    const nameInput =
        document.getElementById(
            'studentNameInput'
        );


    if (
        saveBtn &&
        nameInput
    ) {

        saveBtn.addEventListener(
            'click',
            saveStudentName
        );


        nameInput.addEventListener(
            'keypress',
            (e) => {

                if (
                    e.key ===
                    'Enter'
                ) {
                    saveStudentName();
                }
            }
        );
    }


    const answerInput =
        document.getElementById(
            'practiceAnswerInput'
        );


    if (answerInput) {

        answerInput.addEventListener(
            'keypress',
            (e) => {

                if (
                    e.key ===
                    'Enter'
                ) {
                    checkLessonAnswer();
                }
            }
        );
    }


    const resetBtn =
        document.getElementById(
            'resetProgressBtn'
        );


    if (resetBtn) {

        resetBtn.addEventListener(
            'click',
            resetProgress
        );
    }


    loadStudentName();

    renderProgressAndLessons();
}


// --------------------------------------------------
// STUDENT NAME
// --------------------------------------------------

function saveStudentName() {

    const nameInput =
        document.getElementById(
            'studentNameInput'
        );


    if (!nameInput) {
        return;
    }


    const name =
        nameInput.value.trim();


    if (!name) {

        alert(
            'Please enter a student name first before saving.'
        );

        return;
    }


    localStorage.setItem(
        NAME_KEY,
        name
    );


    updateWelcomeMessage(
        name
    );
}


function loadStudentName() {

    const savedName =
        localStorage.getItem(
            NAME_KEY
        );


    const nameInput =
        document.getElementById(
            'studentNameInput'
        );


    if (
        savedName &&
        savedName.trim() !== '' &&
        savedName.toLowerCase() !== 'alice'
    ) {

        if (nameInput) {

            nameInput.value =
                savedName;
        }


        updateWelcomeMessage(
            savedName
        );

    } else {

        if (savedName) {

            localStorage.removeItem(
                NAME_KEY
            );
        }


        if (nameInput) {

            nameInput.value =
                '';
        }


        updateWelcomeMessage(
            ''
        );
    }
}


function updateWelcomeMessage(name) {

    const welcomeHeading =
        document.getElementById(
            'welcomeMessage'
        );


    if (!welcomeHeading) {
        return;
    }


    if (
        name &&
        name.trim()
    ) {

        welcomeHeading.textContent =
            `Welcome back, ${name}! 👋`;

    } else {

        welcomeHeading.textContent =
            'Welcome! 👋';
    }
}


// --------------------------------------------------
// LESSON STATUS STORAGE
// --------------------------------------------------

function getLessonStatuses() {

    const data =
        localStorage.getItem(
            STATUSES_KEY
        );


    if (data) {

        try {

            const parsed =
                JSON.parse(data);


            const statuses =
                {};


            for (
                let id = 1;
                id <= TOTAL_LESSONS;
                id++
            ) {

                statuses[id] =
                    parsed[id] ||
                    'Not Started';
            }


            return statuses;

        } catch (e) {

            // Fall through to legacy data.
        }
    }


    const legacyData =
        localStorage.getItem(
            COMPLETED_KEY
        );


    const legacyCompletedArray =
        legacyData
            ? JSON.parse(
                legacyData
            )
            : [];


    const statuses =
        {};


    for (
        let id = 1;
        id <= TOTAL_LESSONS;
        id++
    ) {

        statuses[id] =
            legacyCompletedArray.includes(
                id
            )
                ? 'Completed'
                : 'Not Started';
    }


    return statuses;
}


function setLessonStatuses(
    statusesMap
) {

    localStorage.setItem(
        STATUSES_KEY,
        JSON.stringify(
            statusesMap
        )
    );


    const completedArray =
        Object.keys(
            statusesMap
        )
            .filter(
                id =>
                    statusesMap[id] ===
                    'Completed'
            )
            .map(
                Number
            );


    localStorage.setItem(
        COMPLETED_KEY,
        JSON.stringify(
            completedArray
        )
    );
}


// --------------------------------------------------
// PRACTICE PROGRESS DISPLAY
// --------------------------------------------------

function updatePracticeStats(
    lessonId
) {

    const stats =
        practiceStats[
        lessonId
        ] || {

            correct: 0,
            attempts: 0,
            answered: 0,
            missedSkills: [],
            missedQuestions: []
        };


    const questionCounter =
        document.getElementById(
            'questionCounter'
        );


    const practiceScore =
        document.getElementById(
            'practiceScore'
        );


    const questionNum =
        Math.min(
            (
                currentSessionIndex[
                lessonId
                ] || 0
            ) + 1,
            QUESTIONS_PER_SESSION
        );


    if (questionCounter) {

        questionCounter.textContent =
            `Question ${questionNum} of ${QUESTIONS_PER_SESSION}`;
    }


    if (practiceScore) {

        practiceScore.textContent =
            `Correct: ${stats.correct} of ${QUESTIONS_PER_SESSION}`;
    }
}


// --------------------------------------------------
// START LESSON
// --------------------------------------------------

function startLesson(
    lessonId
) {

    const lesson =
        lessonsData[
        lessonId
        ];


    if (!lesson) {
        return;
    }


    activeLessonId =
        lessonId;


    const statuses =
        getLessonStatuses();


    if (
        statuses[
        lessonId
        ] ===
        'Not Started'
    ) {

        statuses[
            lessonId
        ] =
            'In Progress';


        setLessonStatuses(
            statuses
        );
    }


    /*
        If a completed lesson is opened again,
        begin a fresh random practice session.

        Otherwise, preserve an active session.
    */

    if (
        statuses[
        lessonId
        ] ===
        'Completed'
    ) {

        activeSessions[
            lessonId
        ] =
            selectRandomQuestions(
                lesson.questions,
                QUESTIONS_PER_SESSION
            );


        currentSessionIndex[
            lessonId
        ] =
            0;


        practiceStats[
            lessonId
        ] = {

            correct: 0,
            attempts: 0,
            answered: 0,
            missedSkills: [],
            missedQuestions: []
        };

    } else if (
        !activeSessions[
        lessonId
        ] ||
        activeSessions[
            lessonId
        ].length ===
        0
    ) {

        activeSessions[
            lessonId
        ] =
            selectRandomQuestions(
                lesson.questions,
                QUESTIONS_PER_SESSION
            );


        currentSessionIndex[
            lessonId
        ] =
            0;


        practiceStats[
            lessonId
        ] = {

            correct: 0,
            attempts: 0,
            answered: 0,
            missedSkills: [],
            missedQuestions: []
        };
    }


    const modal =
        document.getElementById(
            'lessonModal'
        );


    const modalTitle =
        document.getElementById(
            'modalTitle'
        );


    const modalIcon =
        document.getElementById(
            'modalIcon'
        );


    const modalRefresher =
        document.getElementById(
            'modalRefresher'
        );


    const modalQuestion =
        document.getElementById(
            'modalQuestion'
        );


    const answerInput =
        document.getElementById(
            'practiceAnswerInput'
        );


    const feedbackEl =
        document.getElementById(
            'practiceFeedback'
        );


    const checkAnswerBtn =
        document.getElementById(
            'checkAnswerBtn'
        );


    const nextQuestionBtn =
        document.getElementById(
            'nextQuestionBtn'
        );


    if (modalTitle) {

        modalTitle.textContent =
            lesson.title;
    }


    if (modalIcon) {

        modalIcon.textContent =
            lesson.icon;
    }


    if (modalRefresher) {

        modalRefresher.innerHTML =
            lesson.refresher;
    }


    const sessionIndex =
        currentSessionIndex[
        lessonId
        ] || 0;


    const currentQuestion =
        activeSessions[
        lessonId
        ][
        sessionIndex
        ];


    if (
        modalQuestion &&
        currentQuestion
    ) {

        modalQuestion.textContent =
            currentQuestion.question;
    }


    updatePracticeStats(
        lessonId
    );


    if (answerInput) {

        answerInput.value =
            '';

        answerInput.disabled =
            false;
    }


    if (checkAnswerBtn) {

        checkAnswerBtn.disabled =
            false;
    }


    if (feedbackEl) {

        feedbackEl.innerHTML =
            '';

        feedbackEl.className =
            'practice-feedback hidden';
    }


    if (nextQuestionBtn) {

        nextQuestionBtn.classList.add(
            'hidden'
        );
    }


    updateModalCompleteButton();

    renderProgressAndLessons();


    if (modal) {

        modal.classList.remove(
            'modal-hidden'
        );
    }
}


// --------------------------------------------------
// CHECK ANSWER
// --------------------------------------------------

function checkLessonAnswer() {

    if (
        !activeLessonId ||
        !activeSessions[
        activeLessonId
        ]
    ) {
        return;
    }


    const inputEl =
        document.getElementById(
            'practiceAnswerInput'
        );


    const feedbackEl =
        document.getElementById(
            'practiceFeedback'
        );


    const nextQuestionBtn =
        document.getElementById(
            'nextQuestionBtn'
        );


    const checkAnswerBtn =
        document.getElementById(
            'checkAnswerBtn'
        );


    if (
        !inputEl ||
        !feedbackEl
    ) {
        return;
    }


    /*
        Prevent a student from clicking
        Check Answer repeatedly on one question.
    */

    if (
        inputEl.disabled
    ) {
        return;
    }


    const userInputValue =
        inputEl.value.trim();


    if (!userInputValue) {

        feedbackEl.innerHTML =
            '<span class="feedback-icon">⚠️</span> Please enter an answer before checking.';


        feedbackEl.className =
            'practice-feedback feedback-warning';


        return;
    }


    const session =
        activeSessions[
        activeLessonId
        ];


    const sessionIndex =
        currentSessionIndex[
        activeLessonId
        ] || 0;


    const currentQuestion =
        session[
        sessionIndex
        ];


    if (!currentQuestion) {
        return;
    }


    const isCorrect =
        checkQuestionAnswer(
            userInputValue,
            currentQuestion
        );


    practiceStats[
        activeLessonId
    ].attempts++;


    practiceStats[
        activeLessonId
    ].answered++;


    /*
        Lock the current response after submission.
    */

    inputEl.disabled =
        true;


    if (checkAnswerBtn) {

        checkAnswerBtn.disabled =
            true;
    }


    if (isCorrect) {

        practiceStats[
            activeLessonId
        ].correct++;

    } else {

        /*
            Store the missed skill for
            future review recommendations.
        */

        if (
            currentQuestion.skill &&
            !practiceStats[
                activeLessonId
            ].missedSkills.includes(
                currentQuestion.skill
            )
        ) {

            practiceStats[
                activeLessonId
            ].missedSkills.push(
                currentQuestion.skill
            );
        }


        practiceStats[
            activeLessonId
        ].missedQuestions.push({

            question:
                currentQuestion.question,

            answer:
                currentQuestion.answer,

            skill:
                currentQuestion.skill,

            userAnswer:
                userInputValue
        });
    }


    const correctCount =
        practiceStats[
            activeLessonId
        ].correct;


    const isLastQuestion =
        sessionIndex + 1 >=
        QUESTIONS_PER_SESSION;


    /*
        QUESTION 10

        Automatically complete the lesson.
        The student does not click Mark Complete.
    */

    if (isLastQuestion) {

        solvedLessons[
            activeLessonId
        ] =
            true;


        const statuses =
            getLessonStatuses();


        statuses[
            activeLessonId
        ] =
            'Completed';


        setLessonStatuses(
            statuses
        );


        if (isCorrect) {

            feedbackEl.innerHTML = `
                <span class="feedback-icon">
                    🎉
                </span>

                <div>
                    <strong>
                        Lesson complete!
                    </strong>

                    <br>

                    You answered
                    ${correctCount}
                    of
                    ${QUESTIONS_PER_SESSION}
                    questions correctly.
                </div>
            `;

        } else {

            const displayAnswer =
                currentQuestion.answer ||
                (
                    currentQuestion.accepted
                        ? currentQuestion.accepted[0]
                        : ''
                );


            feedbackEl.innerHTML = `
                <span class="feedback-icon">
                    🎉
                </span>

                <div>
                    <strong>
                        Lesson complete!
                    </strong>

                    <br>

                    The correct answer was:

                    <strong>
                        ${displayAnswer}
                    </strong>

                    <br>

                    You answered
                    ${correctCount}
                    of
                    ${QUESTIONS_PER_SESSION}
                    questions correctly.
                </div>
            `;
        }


        feedbackEl.className =
            'practice-feedback feedback-success';


        if (nextQuestionBtn) {

            nextQuestionBtn.classList.add(
                'hidden'
            );
        }


        updatePracticeStats(
            activeLessonId
        );


        renderProgressAndLessons();


        return;
    }


    /*
        QUESTIONS 1 THROUGH 9
    */

    if (isCorrect) {

        feedbackEl.innerHTML = `
            <span class="feedback-icon">
                ✅
            </span>

            <div>
                <strong>
                    Correct!
                </strong>

                You have
                ${correctCount}
                of
                ${QUESTIONS_PER_SESSION}
                correct so far.
            </div>
        `;


        feedbackEl.className =
            'practice-feedback feedback-success';

    } else {

        const displayAnswer =
            currentQuestion.answer ||
            (
                currentQuestion.accepted
                    ? currentQuestion.accepted[0]
                    : ''
            );


        feedbackEl.innerHTML = `
            <span class="feedback-icon">
                ❌
            </span>

            <div>
                That response is not correct.

                The correct answer was:

                <strong>
                    ${displayAnswer}
                </strong>
            </div>
        `;


        feedbackEl.className =
            'practice-feedback feedback-error';
    }


    if (nextQuestionBtn) {

        nextQuestionBtn.classList.remove(
            'hidden'
        );
    }


    updatePracticeStats(
        activeLessonId
    );


    renderProgressAndLessons();
}


// --------------------------------------------------
// NEXT QUESTION
// --------------------------------------------------

function showNextQuestion() {

    if (
        !activeLessonId ||
        !activeSessions[
        activeLessonId
        ]
    ) {
        return;
    }


    const session =
        activeSessions[
        activeLessonId
        ];


    currentSessionIndex[
        activeLessonId
    ] =
        (
            currentSessionIndex[
            activeLessonId
            ] || 0
        ) + 1;


    const nextIndex =
        currentSessionIndex[
        activeLessonId
        ];


    if (
        nextIndex >=
        session.length
    ) {
        return;
    }


    const newQuestion =
        session[
        nextIndex
        ];


    const modalQuestion =
        document.getElementById(
            'modalQuestion'
        );


    const answerInput =
        document.getElementById(
            'practiceAnswerInput'
        );


    const feedbackEl =
        document.getElementById(
            'practiceFeedback'
        );


    const nextQuestionBtn =
        document.getElementById(
            'nextQuestionBtn'
        );


    const checkAnswerBtn =
        document.getElementById(
            'checkAnswerBtn'
        );


    if (
        modalQuestion &&
        newQuestion
    ) {

        modalQuestion.textContent =
            newQuestion.question;
    }


    if (answerInput) {

        answerInput.value =
            '';

        answerInput.disabled =
            false;

        answerInput.focus();
    }


    if (checkAnswerBtn) {

        checkAnswerBtn.disabled =
            false;
    }


    if (feedbackEl) {

        feedbackEl.innerHTML =
            '';

        feedbackEl.className =
            'practice-feedback hidden';
    }


    if (nextQuestionBtn) {

        nextQuestionBtn.classList.add(
            'hidden'
        );
    }


    updatePracticeStats(
        activeLessonId
    );
}


// --------------------------------------------------
// MANUAL COMPLETION DISABLED
// --------------------------------------------------

function toggleComplete(
    lessonId
) {

    /*
        This function remains so older HTML
        cannot generate an error.

        Students cannot manually mark
        lessons complete.
    */

    return;
}


// --------------------------------------------------
// DASHBOARD PROGRESS
// --------------------------------------------------

function renderProgressAndLessons() {

    const statuses =
        getLessonStatuses();


    let completedCount =
        0;


    for (
        let id = 1;
        id <= TOTAL_LESSONS;
        id++
    ) {

        if (
            statuses[id] ===
            'Completed'
        ) {

            completedCount++;

            solvedLessons[id] =
                true;
        }
    }


    const progressText =
        document.getElementById(
            'progressText'
        );


    if (progressText) {

        progressText.textContent =
            `${completedCount} of ${TOTAL_LESSONS} Lessons Completed`;
    }


    const progressBar =
        document.getElementById(
            'progressBar'
        );


    if (progressBar) {

        const percentage =
            Math.round(
                (
                    completedCount /
                    TOTAL_LESSONS
                ) * 100
            );


        progressBar.style.width =
            `${percentage}%`;
    }


    for (
        let id = 1;
        id <= TOTAL_LESSONS;
        id++
    ) {

        const status =
            statuses[id] ||
            'Not Started';


        const card =
            document.getElementById(
                `card-${id}`
            );


        const badge =
            document.getElementById(
                `badge-${id}`
            );


        const completeBtn =
            document.getElementById(
                `completeBtn-${id}`
            );


        if (card) {

            card.classList.remove(
                'card-completed',
                'card-in-progress'
            );


            if (
                status ===
                'Completed'
            ) {

                card.classList.add(
                    'card-completed'
                );

            } else if (
                status ===
                'In Progress'
            ) {

                card.classList.add(
                    'card-in-progress'
                );
            }
        }


        if (badge) {

            if (
                status ===
                'Completed'
            ) {

                badge.textContent =
                    'Completed ✓';


                badge.className =
                    'badge badge-complete';

            } else if (
                status ===
                'In Progress'
            ) {

                badge.textContent =
                    'In Progress';


                badge.className =
                    'badge badge-in-progress';

            } else {

                badge.textContent =
                    'Not Started';


                badge.className =
                    'badge badge-incomplete';
            }
        }


        /*
            Hide the old Mark Complete button
            even if the HTML still contains it.
        */

        if (completeBtn) {

            completeBtn.hidden =
                true;


            completeBtn.style.display =
                'none';
        }
    }
}


// --------------------------------------------------
// CLOSE LESSON
// --------------------------------------------------

function closeLessonModal() {

    const modal =
        document.getElementById(
            'lessonModal'
        );


    if (modal) {

        modal.classList.add(
            'modal-hidden'
        );
    }


    activeLessonId =
        null;
}


// --------------------------------------------------
// HIDE OLD MODAL COMPLETE BUTTON
// --------------------------------------------------

function updateModalCompleteButton() {

    const modalCompleteBtn =
        document.getElementById(
            'modalCompleteBtn'
        );


    if (modalCompleteBtn) {

        modalCompleteBtn.hidden =
            true;


        modalCompleteBtn.style.display =
            'none';
    }
}


// --------------------------------------------------
// OLD MODAL COMPLETION FUNCTION DISABLED
// --------------------------------------------------

function completeFromModal() {

    return;
}


// --------------------------------------------------
// RESET PROGRESS
// --------------------------------------------------

function resetProgress() {

    const confirmed =
        confirm(
            'Are you sure you want to reset your lesson progress?'
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        STATUSES_KEY
    );


    localStorage.removeItem(
        COMPLETED_KEY
    );


    for (
        let id = 1;
        id <= TOTAL_LESSONS;
        id++
    ) {

        solvedLessons[id] =
            false;


        activeSessions[id] =
            null;


        currentSessionIndex[id] =
            0;


        practiceStats[id] = {

            correct: 0,

            attempts: 0,

            answered: 0,

            missedSkills: [],

            missedQuestions: []
        };
    }


    renderProgressAndLessons();
}