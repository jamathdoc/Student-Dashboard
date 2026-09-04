// Student Math Dashboard - Script

// LocalStorage Keys
const NAME_KEY = 'math_dashboard_student_name';
const STATUSES_KEY = 'math_dashboard_lesson_statuses';
const COMPLETED_KEY = 'math_dashboard_completed_lessons'; // Fallback / legacy compatibility

// State Variables
let activeLessonId = null;
const attemptedLessons = { 1: false, 2: false, 3: false };

// Lesson Data Details
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
        question: "If you have 8 apples and pick 4 more, how many apples do you have in total?",
        correctAnswerText: "8 + 4 = 12 apples!",
        checkAnswer: (input) => {
            const val = input.trim().toLowerCase();
            return val === '12' || val === '12 apples' || val === '12 apples!' || val === 'twelve' || val === 'twelve apples' || val.includes('12');
        }
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
        question: "If 15 cookies are shared equally among 3 friends, how many cookies does each friend get?",
        correctAnswerText: "15 &divide; 3 = 5 cookies each!",
        checkAnswer: (input) => {
            const val = input.trim().toLowerCase();
            return val === '5' || val === '5 cookies' || val === '5 cookies each' || val === 'five' || val === 'five cookies' || val.includes('5');
        }
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
        question: "If you eat 2 slices out of an 8-slice pizza, what fraction of the pizza did you eat?",
        correctAnswerText: "2/8 (which simplifies to 1/4 or 0.25)!",
        checkAnswer: (input) => {
            const val = input.trim().toLowerCase();
            return val.includes('2/8') || val.includes('1/4') || val.includes('0.25') || val.includes('one fourth') || val.includes('one-fourth') || val.includes('quarter') || val.includes('2 out of 8');
        }
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
    const name = nameInput.value.trim();

    if (name) {
        localStorage.setItem(NAME_KEY, name);
        updateWelcomeMessage(name);
    } else {
        localStorage.removeItem(NAME_KEY);
        updateWelcomeMessage('Student');
    }
}

// Load Student Name from Web Storage
function loadStudentName() {
    const savedName = localStorage.getItem(NAME_KEY);
    const nameInput = document.getElementById('studentNameInput');

    if (savedName) {
        if (nameInput) {
            nameInput.value = savedName;
        }
        updateWelcomeMessage(savedName);
    } else {
        updateWelcomeMessage('Student');
    }
}

// Update Welcome Message text content
function updateWelcomeMessage(name) {
    const welcomeHeading = document.getElementById('welcomeMessage');
    if (welcomeHeading) {
        welcomeHeading.textContent = `Welcome back, ${name}! 👋`;
    }
}

// Retrieve status map of all lessons from Web Storage
function getLessonStatuses() {
    const data = localStorage.getItem(STATUSES_KEY);
    if (data) {
        return JSON.parse(data);
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

// Start Lesson - Opens lesson modal and sets lesson status to "In Progress" (if not already Completed)
function startLesson(lessonId) {
    const lesson = lessonsData[lessonId];
    if (!lesson) return;

    activeLessonId = lessonId;

    const statuses = getLessonStatuses();
    // Update status to "In Progress" if it hasn't been completed yet
    if (statuses[lessonId] !== 'Completed') {
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
    if (modalQuestion) modalQuestion.textContent = lesson.question;

    // Requirement 7: Clear answer input and feedback state when opening a lesson
    if (answerInput) answerInput.value = '';
    if (feedbackEl) {
        feedbackEl.innerHTML = '';
        feedbackEl.className = 'practice-feedback hidden';
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
    if (!inputEl || !feedbackEl) return;

    const userInputValue = inputEl.value.trim();

    // Requirement 6: Do not allow an empty response to be checked
    if (!userInputValue) {
        feedbackEl.innerHTML = '<span class="feedback-icon">⚠️</span> Please enter an answer first before checking.';
        feedbackEl.className = 'practice-feedback feedback-warning';
        return;
    }

    // Mark active lesson as attempted since non-empty answer was checked
    attemptedLessons[activeLessonId] = true;

    const lesson = lessonsData[activeLessonId];
    const isCorrect = lesson.checkAnswer(userInputValue);

    if (isCorrect) {
        feedbackEl.innerHTML = `<span class="feedback-icon">🎉</span> <strong>Correct!</strong> ${lesson.correctAnswerText}`;
        feedbackEl.className = 'practice-feedback feedback-success';
    } else {
        feedbackEl.innerHTML = `<span class="feedback-icon">❌</span> That response is not correct. The correct answer is: <strong>${lesson.correctAnswerText}</strong>`;
        feedbackEl.className = 'practice-feedback feedback-error';
    }

    const statuses = getLessonStatuses();
    updateModalCompleteButton(statuses[activeLessonId] === 'Completed');
    renderProgressAndLessons();
}

// Toggle or Mark Lesson as Complete
function toggleComplete(lessonId) {
    const statuses = getLessonStatuses();
    const currentStatus = statuses[lessonId] || 'Not Started';

    // Requirement: Must attempt practice question before marking lesson as complete
    if (currentStatus !== 'Completed' && !attemptedLessons[lessonId]) {
        if (activeLessonId === lessonId) {
            const feedbackEl = document.getElementById('practiceFeedback');
            if (feedbackEl) {
                feedbackEl.innerHTML = '<span class="feedback-icon">⚠️</span> Please attempt and check the practice question first before marking this lesson as complete!';
                feedbackEl.className = 'practice-feedback feedback-warning';
            }
        } else {
            startLesson(lessonId);
            const feedbackEl = document.getElementById('practiceFeedback');
            if (feedbackEl) {
                feedbackEl.innerHTML = '<span class="feedback-icon">⚠️</span> Please attempt and check the practice question first before marking this lesson as complete!';
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
            attemptedLessons[id] = true;
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
            } else if (!attemptedLessons[id]) {
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
        } else if (activeLessonId && !attemptedLessons[activeLessonId]) {
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
        attemptedLessons[id] = false;
    }

    renderProgressAndLessons();
}
