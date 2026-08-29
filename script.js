// Student Math Dashboard - Script

// LocalStorage Keys
const NAME_KEY = 'math_dashboard_student_name';
const COMPLETED_KEY = 'math_dashboard_completed_lessons';

// State Variables (data state only, not styling variables)
let activeLessonId = null;

// Lesson Data Details
const lessonsData = {
    1: {
        title: "1. Addition & Subtraction",
        icon: "➕",
        content: `
            <p><strong>Quick Concept Refresher:</strong></p>
            <ul>
                <li><strong>Addition (+):</strong> Combining numbers together. (e.g., 7 + 5 = 12)</li>
                <li><strong>Subtraction (-):</strong> Taking one number away from another. (e.g., 15 - 6 = 9)</li>
            </ul>
            <p style="margin-top: 1rem;"><strong>Practice Question:</strong></p>
            <p>If you have 8 apples and pick 4 more, how many apples do you have in total?</p>
            <p style="margin-top: 0.5rem; color: #059669; font-weight: 600;">Answer: 8 + 4 = 12 apples!</p>
        `
    },
    2: {
        title: "2. Multiplication & Division",
        icon: "✖️",
        content: `
            <p><strong>Quick Concept Refresher:</strong></p>
            <ul>
                <li><strong>Multiplication (&times;):</strong> Fast repeated addition of equal groups. (e.g., 4 &times; 3 = 12)</li>
                <li><strong>Division (&divide;):</strong> Splitting a quantity into equal groups. (e.g., 12 &divide; 3 = 4)</li>
            </ul>
            <p style="margin-top: 1rem;"><strong>Practice Question:</strong></p>
            <p>If 15 cookies are shared equally among 3 friends, how many cookies does each friend get?</p>
            <p style="margin-top: 0.5rem; color: #059669; font-weight: 600;">Answer: 15 &divide; 3 = 5 cookies each!</p>
        `
    },
    3: {
        title: "3. Fractions & Decimals",
        icon: "🍕",
        content: `
            <p><strong>Quick Concept Refresher:</strong></p>
            <ul>
                <li><strong>Fractions:</strong> Represent parts of a whole unit (e.g., 1/2 is half, 3/4 is three quarters).</li>
                <li><strong>Decimals:</strong> Numbers expressed with a decimal point (e.g., 0.5 equals 1/2).</li>
            </ul>
            <p style="margin-top: 1rem;"><strong>Practice Question:</strong></p>
            <p>If you eat 2 slices out of an 8-slice pizza, what fraction of the pizza did you eat?</p>
            <p style="margin-top: 0.5rem; color: #059669; font-weight: 600;">Answer: 2/8 (which simplifies to 1/4 or 0.25)!</p>
        `
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

    // Load saved student name from Web Storage
    loadStudentName();

    // Load completed lessons state from Web Storage and update UI
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

// Retrieve array of completed lesson IDs from Web Storage
function getCompletedLessons() {
    const data = localStorage.getItem(COMPLETED_KEY);
    return data ? JSON.parse(data) : [];
}

// Save array of completed lesson IDs to Web Storage
function setCompletedLessons(completedArray) {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedArray));
}

// Toggle lesson completion state
function toggleComplete(lessonId) {
    let completed = getCompletedLessons();
    const index = completed.indexOf(lessonId);

    if (index === -1) {
        completed.push(lessonId);
    } else {
        completed.splice(index, 1);
    }

    setCompletedLessons(completed);
    renderProgressAndLessons();

    // If modal is open for this lesson, update modal completion button state
    if (activeLessonId === lessonId) {
        updateModalCompleteButton(completed.includes(lessonId));
    }
}

// Render overall progress bar and lesson card states
function renderProgressAndLessons() {
    const completed = getCompletedLessons();
    const totalLessons = 3;
    const count = completed.length;

    // Update Progress Text
    const progressText = document.getElementById('progressText');
    if (progressText) {
        progressText.textContent = `${count} of ${totalLessons} Lessons Completed`;
    }

    // Update Progress Bar class (strictly using CSS class rules, NO JS style variables)
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        let fillClass = 'progress-fill-0';
        if (count === 1) fillClass = 'progress-fill-33';
        if (count === 2) fillClass = 'progress-fill-66';
        if (count === 3) fillClass = 'progress-fill-100';

        progressBar.className = `progress-fill ${fillClass}`;
    }

    // Update individual lesson cards (1, 2, 3)
    for (let id = 1; id <= totalLessons; id++) {
        const isCompleted = completed.includes(id);
        const card = document.getElementById(`card-${id}`);
        const badge = document.getElementById(`badge-${id}`);
        const completeBtn = document.getElementById(`completeBtn-${id}`);

        if (card) {
            if (isCompleted) {
                card.classList.add('card-completed');
            } else {
                card.classList.remove('card-completed');
            }
        }

        if (badge) {
            if (isCompleted) {
                badge.textContent = 'Completed ✓';
                badge.className = 'badge badge-complete';
            } else {
                badge.textContent = 'Not Complete';
                badge.className = 'badge badge-incomplete';
            }
        }

        if (completeBtn) {
            if (isCompleted) {
                completeBtn.textContent = 'Completed ✓';
                completeBtn.className = 'btn btn-completed-state';
            } else {
                completeBtn.textContent = 'Mark Complete';
                completeBtn.className = 'btn btn-complete';
            }
        }
    }
}

// Start Lesson - Opens the interactive lesson modal
function startLesson(lessonId) {
    const lesson = lessonsData[lessonId];
    if (!lesson) return;

    activeLessonId = lessonId;

    const modal = document.getElementById('lessonModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalIcon = document.getElementById('modalIcon');
    const modalBody = document.getElementById('modalBody');

    if (modalTitle) modalTitle.textContent = lesson.title;
    if (modalIcon) modalIcon.textContent = lesson.icon;
    if (modalBody) modalBody.innerHTML = lesson.content;

    const completed = getCompletedLessons();
    updateModalCompleteButton(completed.includes(lessonId));

    if (modal) {
        modal.classList.remove('modal-hidden');
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
