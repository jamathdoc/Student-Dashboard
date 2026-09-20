// Student Math Dashboard - Script

// LocalStorage Keys
const NAME_KEY = 'math_dashboard_student_name';
const STATUSES_KEY = 'math_dashboard_lesson_statuses';
const COMPLETED_KEY = 'math_dashboard_completed_lessons'; // Fallback / legacy compatibility

// State Variables
const REQUIRED_CORRECT_ANSWERS = 4;
let activeLessonId = null;
const solvedLessons = { 1: false, 2: false, 3: false };
const currentQuestionIndex = { 1: 0, 2: 0, 3: 0 };
const nextBackupQuestionIndex = { 1: 4, 2: 4, 3: 4 };

const practiceStats = {
    1: { correct: 0, attempts: 0 },
    2: { correct: 0, attempts: 0 },
    3: { correct: 0, attempts: 0 }
};

// Lesson Data Details with Question Banks
const lessonsData = {
    1: {
        title: "1. Addition & Subtraction",
        icon: "➕",
        refresher: `
            <p><strong>Quick Concept Refresher:</strong></p>
            <ul>
                <li><strong>Addition (+):</strong> Combining numbers together. (e.g., 7 + 5 = 12)</li>
                <li><strong>Subtraction (-):</strong> Taking one number away from another. (e.g., 15 - 6 = 9)</li>
            </ul>
        `,
        questions: [
            {
                question: "If you have 8 apples and pick 4 more, how many apples do you have in total?",
                correctAnswerText: "8 + 4 = 12 apples!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '12' || val === '12 apples' || val === '12 apples!' || val === 'twelve' || val === 'twelve apples' || val.includes('12');
                }
            },
            {
                question: "There are 15 birds on a tree. 6 birds fly away. How many birds are left on the tree?",
                correctAnswerText: "15 - 6 = 9 birds!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '9' || val === '9 birds' || val === 'nine' || val === 'nine birds' || val.includes('9');
                }
            },
            {
                question: "Sam has 9 marbles and buys 7 more. How many marbles does Sam have now?",
                correctAnswerText: "9 + 7 = 16 marbles!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '16' || val === '16 marbles' || val === 'sixteen' || val.includes('16');
                }
            },
            {
                question: "You have 20 candies and give away 8 to your friends. How many candies do you have left?",
                correctAnswerText: "20 - 8 = 12 candies!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '12' || val === '12 candies' || val === 'twelve' || val.includes('12');
                }
            },
            {
                question: "A library shelf has 14 books. A student returns 8 more books. How many books are on the shelf now?",
                correctAnswerText: "14 + 8 = 22 books!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '22' || val === '22 books' || val === 'twenty two' || val === 'twenty-two' || val.includes('22');
                }
            },
            {
                question: "There are 18 ducks in a pond. 7 ducks waddle away onto the grass. How many ducks are left in the pond?",
                correctAnswerText: "18 - 7 = 11 ducks!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '11' || val === '11 ducks' || val === 'eleven' || val.includes('11');
                }
            },
            {
                question: "Maya baked 13 chocolate cookies and 12 vanilla cookies. How many cookies did Maya bake altogether?",
                correctAnswerText: "13 + 12 = 25 cookies!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '25' || val === '25 cookies' || val === 'twenty five' || val === 'twenty-five' || val.includes('25');
                }
            },
            {
                question: "A toy store has 30 toy cars. They sell 14 cars during the afternoon. How many toy cars are left?",
                correctAnswerText: "30 - 14 = 16 toy cars!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '16' || val === '16 toy cars' || val === 'sixteen' || val.includes('16');
                }
            }
        ]
    },
    2: {
        title: "2. Multiplication & Division",
        icon: "✖️",
        refresher: `
            <p><strong>Quick Concept Refresher:</strong></p>
            <ul>
                <li><strong>Multiplication (&times;):</strong> Fast repeated addition of equal groups. (e.g., 4 &times; 3 = 12)</li>
                <li><strong>Division (&divide;):</strong> Splitting a quantity into equal groups. (e.g., 12 &divide; 3 = 4)</li>
            </ul>
        `,
        questions: [
            {
                question: "If 15 cookies are shared equally among 3 friends, how many cookies does each friend get?",
                correctAnswerText: "15 &divide; 3 = 5 cookies each!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '5' || val === '5 cookies' || val === '5 cookies each' || val === 'five' || val === 'five cookies' || val.includes('5');
                }
            },
            {
                question: "A box holds 4 rows of 6 pencils. How many pencils are in the box in total?",
                correctAnswerText: "4 &times; 6 = 24 pencils!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '24' || val === '24 pencils' || val === 'twenty four' || val === 'twenty-four' || val.includes('24');
                }
            },
            {
                question: "If you have 20 stickers and put 4 stickers on each page, how many pages can you fill?",
                correctAnswerText: "20 &divide; 4 = 5 pages!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '5' || val === '5 pages' || val === 'five' || val.includes('5');
                }
            },
            {
                question: "A farmer plants 3 rows of apple trees with 8 trees in each row. How many trees are planted?",
                correctAnswerText: "3 &times; 8 = 24 trees!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '24' || val === '24 trees' || val === 'twenty four' || val === 'twenty-four' || val.includes('24');
                }
            },
            {
                question: "There are 6 baskets, and each basket holds 7 oranges. How many oranges are there in total?",
                correctAnswerText: "6 &times; 7 = 42 oranges!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '42' || val === '42 oranges' || val === 'forty two' || val === 'forty-two' || val.includes('42');
                }
            },
            {
                question: "A classroom of 24 students is divided equally into 4 teams. How many students are on each team?",
                correctAnswerText: "24 &divide; 4 = 6 students!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '6' || val === '6 students' || val === 'six' || val.includes('6');
                }
            },
            {
                question: "A pack contains 8 juice boxes. If you buy 5 packs, how many juice boxes do you have?",
                correctAnswerText: "8 &times; 5 = 40 juice boxes!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '40' || val === '40 juice boxes' || val === 'forty' || val.includes('40');
                }
            },
            {
                question: "A baker has 36 cupcakes and packs 6 cupcakes per box. How many boxes does the baker need?",
                correctAnswerText: "36 &divide; 6 = 6 boxes!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '6' || val === '6 boxes' || val === 'six' || val.includes('6');
                }
            }
        ]
    },
    3: {
        title: "3. Fractions & Decimals",
        icon: "🍕",
        refresher: `
            <p><strong>Quick Concept Refresher:</strong></p>
            <ul>
                <li><strong>Fractions:</strong> Represent parts of a whole unit (e.g., 1/2 is half, 3/4 is three quarters).</li>
                <li><strong>Decimals:</strong> Numbers expressed with a decimal point (e.g., 0.5 equals 1/2).</li>
            </ul>
        `,
        questions: [
            {
                question: "If you eat 2 slices out of an 8-slice pizza, what fraction of the pizza did you eat?",
                correctAnswerText: "2/8 (which simplifies to 1/4 or 0.25)!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val.includes('2/8') || val.includes('1/4') || val.includes('0.25') || val.includes('one fourth') || val.includes('one-fourth') || val.includes('quarter') || val.includes('2 out of 8');
                }
            },
            {
                question: "What decimal is equivalent to the fraction 1/2?",
                correctAnswerText: "0.5 (or 1/2)!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '0.5' || val === '0.50' || val === '1/2' || val.includes('0.5') || val.includes('half');
                }
            },
            {
                question: "If 3 out of 4 squares are shaded blue, what fraction of the squares are shaded?",
                correctAnswerText: "3/4 (or 0.75)!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '3/4' || val === '0.75' || val.includes('3/4') || val.includes('0.75') || val.includes('three fourths') || val.includes('three quarters');
                }
            },
            {
                question: "If you have 1 whole candy bar and eat 0.5 of it, what fraction of the candy bar remains?",
                correctAnswerText: "1/2 (or 0.5)!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '1/2' || val === '0.5' || val.includes('1/2') || val.includes('0.5') || val.includes('half');
                }
            },
            {
                question: "What fraction represents 5 out of 10 equal parts of a garden?",
                correctAnswerText: "5/10 (which simplifies to 1/2 or 0.5)!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val.includes('5/10') || val.includes('1/2') || val.includes('0.5') || val.includes('half') || val.includes('five tenths');
                }
            },
            {
                question: "What decimal is equivalent to the fraction 1/4?",
                correctAnswerText: "0.25 (or 1/4)!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '0.25' || val === '0.250' || val === '1/4' || val.includes('0.25') || val.includes('one fourth') || val.includes('one quarter') || val.includes('quarter');
                }
            },
            {
                question: "If a ribbon is 0.75 meters long, what fraction of a meter is that in simplest form?",
                correctAnswerText: "3/4 (or 0.75)!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '3/4' || val === '0.75' || val.includes('3/4') || val.includes('0.75') || val.includes('three fourths') || val.includes('three quarters');
                }
            },
            {
                question: "A runner completed 4 out of 5 laps around the track. What fraction of the run is completed?",
                correctAnswerText: "4/5 (or 0.8)!",
                checkAnswer: (input) => {
                    const val = input.trim().toLowerCase();
                    return val === '4/5' || val === '0.8' || val.includes('4/5') || val.includes('0.8') || val.includes('four fifths');
                }
            }
        ]
    }
};

// Initialize Dashboard when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

function initDashboard() {
    // Event listener for Save Name button
    const saveBtn = document.getElementById('saveNameBtn');
    const nameInput = document.getElementById('studentNameInput');

    if (saveBtn && nameInput) {
        saveBtn.addEventListener('click', saveStudentName);
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveStudentName();
            }
        });
    }

    // Event listener for Practice Answer Input Enter keypress
    const answerInput = document.getElementById('practiceAnswerInput');
    if (answerInput) {
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkLessonAnswer();
            }
        });
    }

    // Event listener for Reset Progress button
    const resetBtn = document.getElementById('resetProgressBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetProgress);
    }

    // Load saved student name from Web Storage
    loadStudentName();

    // Load lesson statuses state from Web Storage and update UI
    renderProgressAndLessons();
}

// Save Student Name to Web Storage
function saveStudentName() {
    const nameInput = document.getElementById('studentNameInput');
    if (!nameInput) return;

    const name = nameInput.value.trim();

    // Requirement 7: Do not allow a blank name to be saved. Ask user to enter a name first.
    if (!name) {
        alert('Please enter a student name first before saving.');
        return;
    }

    localStorage.setItem(NAME_KEY, name);
    updateWelcomeMessage(name);
}

// Load Student Name from Web Storage
function loadStudentName() {
    const savedName = localStorage.getItem(NAME_KEY);
    const nameInput = document.getElementById('studentNameInput');

    // Requirement 5: Do not treat "Alice" or any sample name as a saved user
    if (savedName && savedName.trim() !== '' && savedName.toLowerCase() !== 'alice') {
        if (nameInput) {
            nameInput.value = savedName;
        }
        updateWelcomeMessage(savedName);
    } else {
        // Clear sample name if present and reset to blank input & general welcome message
        if (savedName) {
            localStorage.removeItem(NAME_KEY);
        }
        if (nameInput) {
            nameInput.value = '';
        }
        updateWelcomeMessage('');
    }
}

// Update Welcome Message text content
function updateWelcomeMessage(name) {
    const welcomeHeading = document.getElementById('welcomeMessage');
    if (welcomeHeading) {
        if (name && name.trim()) {
            welcomeHeading.textContent = `Welcome back, ${name}! 👋`;
        } else {
            welcomeHeading.textContent = 'Welcome! 👋';
        }
    }
}

// Retrieve status map of all lessons from Web Storage
function getLessonStatuses() {
    const data = localStorage.getItem(STATUSES_KEY);
    if (data) {
        try {
            const parsed = JSON.parse(data);
            return {
                1: parsed[1] || 'Not Started',
                2: parsed[2] || 'Not Started',
                3: parsed[3] || 'Not Started'
            };
        } catch (e) {
            // fallback to default
        }
    }

    // Check for legacy array in Web Storage if STATUSES_KEY is not yet set
    const legacyData = localStorage.getItem(COMPLETED_KEY);
    const legacyCompletedArray = legacyData ? JSON.parse(legacyData) : [];

    return {
        1: legacyCompletedArray.includes(1) ? 'Completed' : 'Not Started',
        2: legacyCompletedArray.includes(2) ? 'Completed' : 'Not Started',
        3: legacyCompletedArray.includes(3) ? 'Completed' : 'Not Started'
    };
}

// Save status map of all lessons to Web Storage
function setLessonStatuses(statusesMap) {
    localStorage.setItem(STATUSES_KEY, JSON.stringify(statusesMap));

    // Keep legacy COMPLETED_KEY synced for backward compatibility
    const completedArray = Object.keys(statusesMap)
        .filter(id => statusesMap[id] === 'Completed')
        .map(Number);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedArray));
}

function updatePracticeStats(lessonId) {
    const stats = practiceStats[lessonId] || { correct: 0, attempts: 0 };

    const questionCounter = document.getElementById('questionCounter');
    const practiceScore = document.getElementById('practiceScore');

    const questionNumber = Math.min(stats.correct + 1, REQUIRED_CORRECT_ANSWERS);

    if (questionCounter) {
        questionCounter.textContent = `Question ${questionNumber} of ${REQUIRED_CORRECT_ANSWERS}`;
    }

    if (practiceScore) {
        practiceScore.textContent = `Correct: ${stats.correct} | Attempts: ${stats.attempts}`;
    }
}

// Start Lesson - Opens lesson modal and sets lesson status to "In Progress" (if currently Not Started)
function startLesson(lessonId) {
    const lesson = lessonsData[lessonId];
    if (!lesson) return;

    activeLessonId = lessonId;

    const statuses = getLessonStatuses();
    // Update status to "In Progress" ONLY if it is currently "Not Started"
    if (statuses[lessonId] === 'Not Started') {
        statuses[lessonId] = 'In Progress';
        setLessonStatuses(statuses);
    }

    const modal = document.getElementById('lessonModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalIcon = document.getElementById('modalIcon');
    const modalRefresher = document.getElementById('modalRefresher');
    const modalQuestion = document.getElementById('modalQuestion');
    const answerInput = document.getElementById('practiceAnswerInput');
    const feedbackEl = document.getElementById('practiceFeedback');

    if (modalTitle) modalTitle.textContent = lesson.title;
    if (modalIcon) modalIcon.textContent = lesson.icon;
    if (modalRefresher) modalRefresher.innerHTML = lesson.refresher;

    // Load active question from lesson question bank
    const qIndex = currentQuestionIndex[lessonId] || 0;
    const currentQ = lesson.questions[qIndex];
    if (modalQuestion) modalQuestion.textContent = currentQ.question;

    updatePracticeStats(lessonId);

    // Requirement 9: Clear answer input and feedback state when opening a lesson
    if (answerInput) answerInput.value = '';
    if (feedbackEl) {
        feedbackEl.innerHTML = '';
        feedbackEl.className = 'practice-feedback hidden';
    }

    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    if (nextQuestionBtn) {
        nextQuestionBtn.classList.add('hidden');
    }

    updateModalCompleteButton(statuses[lessonId] === 'Completed');
    renderProgressAndLessons();

    if (modal) {
        modal.classList.remove('modal-hidden');
    }
}

// Check Student Answer for Active Lesson Practice Question
function checkLessonAnswer() {
    if (!activeLessonId || !lessonsData[activeLessonId]) return;

    const inputEl = document.getElementById('practiceAnswerInput');
    const feedbackEl = document.getElementById('practiceFeedback');
    const modalQuestion = document.getElementById('modalQuestion');
    if (!inputEl || !feedbackEl) return;

    const userInputValue = inputEl.value.trim();

    // Requirement 8: Do not allow an empty answer to count as an attempt
    if (!userInputValue) {
        feedbackEl.innerHTML = '<span class="feedback-icon">⚠️</span> Please enter an answer first before checking.';
        feedbackEl.className = 'practice-feedback feedback-warning';
        return;
    }

    const lesson = lessonsData[activeLessonId];
    const qIndex = currentQuestionIndex[activeLessonId] || 0;
    const currentQ = lesson.questions[qIndex];
    const isCorrect = currentQ.checkAnswer(userInputValue);
    practiceStats[activeLessonId].attempts++;

    if (isCorrect) {
        practiceStats[activeLessonId].correct++;
        const correctCount = practiceStats[activeLessonId].correct;
        const nextQuestionBtn = document.getElementById('nextQuestionBtn');

        if (correctCount >= REQUIRED_CORRECT_ANSWERS) {
            // Requirement 10: 4 correct answers unlocks lesson completion
            solvedLessons[activeLessonId] = true;
            feedbackEl.innerHTML = `<span class="feedback-icon">🎉</span> <div><strong>Practice complete!</strong> You have ${REQUIRED_CORRECT_ANSWERS} correct answers and can now mark this lesson as complete.</div>`;
            feedbackEl.className = 'practice-feedback feedback-success';

            if (nextQuestionBtn) {
                nextQuestionBtn.classList.add('hidden');
            }
        } else {
            feedbackEl.innerHTML = `<span class="feedback-icon">🎉</span> <div><strong>Correct!</strong> You have ${correctCount} of ${REQUIRED_CORRECT_ANSWERS} correct answers. Continue practicing.</div>`;
            feedbackEl.className = 'practice-feedback feedback-success';

            if (nextQuestionBtn) {
                nextQuestionBtn.classList.remove('hidden');
            }
        }
    } else {
        // Requirement 6, 8, 9: Incorrect answer displays explanation, serves an unused backup question, and keeps visible question counter
        feedbackEl.innerHTML = `<span class="feedback-icon">❌</span> <div>That response is not correct. The correct answer was: <strong>${currentQ.correctAnswerText}</strong><br><span style="font-size: 0.88rem; opacity: 0.9; margin-top: 0.25rem; display: inline-block;"><strong>New Question Loaded:</strong> Try the new question above!</span></div>`;
        feedbackEl.className = 'practice-feedback feedback-error';

        // Select next backup question in order (indices 4..7)
        let backupIndex = nextBackupQuestionIndex[activeLessonId];
        if (backupIndex === undefined || backupIndex < 4 || backupIndex > 7) {
            backupIndex = 4;
        }
        currentQuestionIndex[activeLessonId] = backupIndex;
        nextBackupQuestionIndex[activeLessonId] = 4 + ((backupIndex - 4 + 1) % 4);

        const newQ = lesson.questions[backupIndex];
        if (modalQuestion && newQ) {
            modalQuestion.textContent = newQ.question;
        }

        // Clear input field for the new question
        inputEl.value = '';
    }

    updatePracticeStats(activeLessonId);
    const statuses = getLessonStatuses();
    updateModalCompleteButton(statuses[activeLessonId] === 'Completed');
    renderProgressAndLessons();
}

// Show Next Question in Lesson Practice
function showNextQuestion() {
    if (!activeLessonId || !lessonsData[activeLessonId]) return;

    const lesson = lessonsData[activeLessonId];
    const correctCount = practiceStats[activeLessonId]?.correct || 0;

    // Move to next required primary question (indices 0..3)
    const nextIndex = Math.min(correctCount, REQUIRED_CORRECT_ANSWERS - 1);
    currentQuestionIndex[activeLessonId] = nextIndex;

    const newQ = lesson.questions[nextIndex];
    const modalQuestion = document.getElementById('modalQuestion');
    const answerInput = document.getElementById('practiceAnswerInput');
    const feedbackEl = document.getElementById('practiceFeedback');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');

    if (modalQuestion && newQ) {
        modalQuestion.textContent = newQ.question;
    }

    if (answerInput) {
        answerInput.value = '';
    }

    if (feedbackEl) {
        feedbackEl.innerHTML = '';
        feedbackEl.className = 'practice-feedback hidden';
    }

    if (nextQuestionBtn) {
        nextQuestionBtn.classList.add('hidden');
    }

    updatePracticeStats(activeLessonId);
}

// Toggle or Mark Lesson as Complete
function toggleComplete(lessonId) {
    const statuses = getLessonStatuses();
    const currentStatus = statuses[lessonId] || 'Not Started';

    // Requirement 2: Must answer 4 practice questions correctly before marking lesson complete
    if (currentStatus !== 'Completed' && !solvedLessons[lessonId]) {
        if (activeLessonId === lessonId) {
            const feedbackEl = document.getElementById('practiceFeedback');
            if (feedbackEl) {
                feedbackEl.innerHTML = `<span class="feedback-icon">⚠️</span> You need ${REQUIRED_CORRECT_ANSWERS} correct answers before you can mark this lesson as complete.`;
                feedbackEl.className = 'practice-feedback feedback-warning';
            }
        } else {
            startLesson(lessonId);
            const feedbackEl = document.getElementById('practiceFeedback');
            if (feedbackEl) {
                feedbackEl.innerHTML = `<span class="feedback-icon">⚠️</span> You need ${REQUIRED_CORRECT_ANSWERS} correct answers before you can mark this lesson as complete.`;
                feedbackEl.className = 'practice-feedback feedback-warning';
            }
        }
        return;
    }

    if (currentStatus === 'Completed') {
        statuses[lessonId] = 'In Progress';
    } else {
        statuses[lessonId] = 'Completed';
    }

    setLessonStatuses(statuses);
    renderProgressAndLessons();

    if (activeLessonId === lessonId) {
        updateModalCompleteButton(statuses[lessonId] === 'Completed');
    }
}

// Render overall progress bar and lesson card states
function renderProgressAndLessons() {
    const statuses = getLessonStatuses();
    const totalLessons = 3;

    let completedCount = 0;
    for (let id = 1; id <= totalLessons; id++) {
        if (statuses[id] === 'Completed') {
            completedCount++;
            solvedLessons[id] = true;
        }
    }

    // Update Progress Text
    const progressText = document.getElementById('progressText');
    if (progressText) {
        progressText.textContent = `${completedCount} of ${totalLessons} Lessons Completed`;
    }

    // Update Progress Bar class
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        let fillClass = 'progress-fill-0';
        if (completedCount === 1) fillClass = 'progress-fill-33';
        if (completedCount === 2) fillClass = 'progress-fill-66';
        if (completedCount === 3) fillClass = 'progress-fill-100';

        progressBar.className = `progress-fill ${fillClass}`;
    }

    // Update individual lesson cards (1, 2, 3)
    for (let id = 1; id <= totalLessons; id++) {
        const status = statuses[id] || 'Not Started';
        const card = document.getElementById(`card-${id}`);
        const badge = document.getElementById(`badge-${id}`);
        const completeBtn = document.getElementById(`completeBtn-${id}`);

        if (card) {
            card.classList.remove('card-completed', 'card-in-progress');
            if (status === 'Completed') {
                card.classList.add('card-completed');
            } else if (status === 'In Progress') {
                card.classList.add('card-in-progress');
            }
        }

        if (badge) {
            if (status === 'Completed') {
                badge.textContent = 'Completed ✓';
                badge.className = 'badge badge-complete';
            } else if (status === 'In Progress') {
                badge.textContent = 'In Progress';
                badge.className = 'badge badge-in-progress';
            } else {
                badge.textContent = 'Not Started';
                badge.className = 'badge badge-incomplete';
            }
        }

        if (completeBtn) {
            if (status === 'Completed') {
                completeBtn.textContent = 'Completed ✓';
                completeBtn.className = 'btn btn-completed-state';
            } else if (!solvedLessons[id]) {
                completeBtn.textContent = 'Mark Complete';
                completeBtn.className = 'btn btn-complete btn-disabled-attempt';
            } else {
                completeBtn.textContent = 'Mark Complete';
                completeBtn.className = 'btn btn-complete';
            }
        }
    }
}

// Close Lesson Modal
function closeLessonModal() {
    const modal = document.getElementById('lessonModal');
    if (modal) {
        modal.classList.add('modal-hidden');
    }
    activeLessonId = null;
}

// Update complete button inside modal
function updateModalCompleteButton(isCompleted) {
    const modalCompleteBtn = document.getElementById('modalCompleteBtn');
    if (modalCompleteBtn) {
        if (isCompleted) {
            modalCompleteBtn.textContent = 'Completed ✓';
            modalCompleteBtn.className = 'btn btn-completed-state';
        } else if (activeLessonId && !solvedLessons[activeLessonId]) {
            modalCompleteBtn.textContent = 'Mark Complete';
            modalCompleteBtn.className = 'btn btn-complete btn-disabled-attempt';
        } else {
            modalCompleteBtn.textContent = 'Mark Complete';
            modalCompleteBtn.className = 'btn btn-complete';
        }
    }
}

// Complete active lesson from within the modal
function completeFromModal() {
    if (activeLessonId !== null) {
        toggleComplete(activeLessonId);
    }
}

// Reset all lesson progress after student confirmation
function resetProgress() {
    const confirmed = confirm('Are you sure you want to reset your lesson progress?');
    if (!confirmed) return;

    localStorage.removeItem(STATUSES_KEY);
    localStorage.removeItem(COMPLETED_KEY);

    for (let id = 1; id <= 3; id++) {
        solvedLessons[id] = false;
        currentQuestionIndex[id] = 0;
        nextBackupQuestionIndex[id] = 4;
        practiceStats[id] = { correct: 0, attempts: 0 };
    }

    renderProgressAndLessons();
}
