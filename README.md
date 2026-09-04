# Student Math Dashboard

> "A simple space for students to learn, practice, and keep track of their progress."

The **Student Math Dashboard** is a beginner-friendly web application where students can enter their name, open math lessons, answer practice questions, and keep track of their progress.

I built this dashboard to give students a simple place to review lessons, practice questions, and see what they have completed on their own.

The student's name and lesson progress are saved using **Web Storage**, so the information stays there after the page is refreshed.

## Features

- Enter and save a student's name
- Show a personalized welcome message after the name is saved
- Leave the name field blank for a new user
- View three math lessons
- Start a lesson
- Review a quick concept refresher
- Answer a practice question before seeing the answer
- Check an answer and receive feedback
- Receive a new question after an incorrect answer
- Require a correct answer before a lesson can be marked complete
- Track lessons as Not Started, In Progress, or Completed
- Track overall lesson progress
- Reset lesson progress without deleting the saved student name
- Save student information and lesson progress using `localStorage`

## Technologies and Tools

| Tool | Purpose |
| --- | --- |
| HTML | Creates the structure and content of the dashboard |
| CSS | Controls the layout and design |
| JavaScript | Handles student interactions, questions, feedback, and progress |
| Web Storage | Saves the student's name and lesson progress |
| Antigravity | Used to help build and develop the project |
| Git | Tracks changes made to the project |
| GitHub | Stores the project and commit history |

## Project Structure

| File | Purpose |
| --- | --- |
| `index.html` | Contains the dashboard structure and lesson content |
| `style.css` | Contains the styling for the dashboard |
| `script.js` | Handles student names, lesson questions, progress, and Web Storage |

## How the Dashboard Works

When a new user opens the dashboard, the name field is blank.

After the student enters and saves a name, the dashboard displays a personalized welcome message.

Each lesson starts as **Not Started**.

When the student opens a lesson, the status changes to **In Progress**. If the student leaves the lesson without completing it, it stays In Progress.

Inside each lesson, the student sees a quick concept refresher followed by a practice question.

The answer is not shown right away. The student has to enter a response and click **Check Answer**.

If the answer is wrong, the dashboard gives feedback, shows the correct answer, and gives the student another question from the same lesson.

The student has to answer a question correctly before the lesson can be marked as complete.

Once the lesson is completed, the status changes to **Completed** and the overall progress updates.

## Important Decisions

### Using Local Storage

I chose to use `localStorage` because this version of the project does not need student accounts or a database.

This allows the student's saved name and lesson progress to remain after the page is refreshed.

### Leaving the Name Blank for New Users

The dashboard originally opened with "Alice" already entered as the student's name.

I removed the preset name because the dashboard should not assume who the user is.

A new user now sees a blank name field and a general welcome message. After the student saves a name, the dashboard uses that name in the welcome message.

### Adding Interactive Practice Questions

Originally, the practice question and answer appeared at the same time.

I noticed that showing the answer right away did not give students a real chance to solve the problem first, so I changed the lesson flow.

Students now enter their own answer and click **Check Answer** before seeing the solution.

### Requiring a Correct Answer

At first, a student could answer a question incorrectly and still mark the lesson as complete.

I did not think that made sense for the purpose of the dashboard.

Now, if the student gets a question wrong, they receive another question from the same lesson. They have to answer one correctly before they can mark the lesson complete.

### Tracking Lesson Status

I also noticed that lessons were showing as **In Progress** before the student had actually opened them.

I changed the logic so that lessons now start as **Not Started**.

A lesson only changes to **In Progress** after the student opens it. Once it is completed, it stays **Completed**.

### Resetting Progress

I added a Reset Progress option so students can start their lessons over.

Before the progress is reset, the dashboard asks the student to confirm.

Resetting the progress returns the lessons to Not Started, but the student's saved name stays on the dashboard.

I made that choice because restarting lesson progress should not require the student to enter their name again.

## Challenges

### Saving Student Information and Progress

One challenge was making sure the student's information and lesson progress did not disappear after refreshing the page.

I solved this by saving the student's name and lesson status information in `localStorage`.

When the dashboard opens again, JavaScript retrieves the saved information and updates the page.

### Testing the Application

While testing, the `open_browser_url` tool could not create a browser context because the Playwright driver download returned a 404 error.

I closed that browser and used Go Live in Antigravity instead.

Using Go Live, I tested the name-saving feature, lesson progress, Reset Progress, practice questions, answer feedback, and lesson completion.

## What I Parked

For now, I have not added:

- Student accounts
- Passwords
- A database
- Online progress syncing
- A teacher dashboard
- More advanced student analytics

I want to keep this version focused on the HTML, CSS, JavaScript, and Web Storage concepts I am currently practicing.

## Next Steps

Next, I may add more lessons and more practice questions.

Later, I would like to explore student accounts and a database so progress can be saved across different devices.

## Project Journal

Development decisions, challenges, testing, and changes are documented in `JOURNAL.md`.
