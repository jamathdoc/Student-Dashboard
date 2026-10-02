# Student Math Dashboard

> "A simple space for students to learn, practice, and keep track of their progress."

The **Student Math Dashboard** is a beginner-friendly web application that allows students to enter their name, view Algebra I lessons, practice skills, and track which lessons they have completed.

The project is designed for students who may need access to math learning materials when a teacher or tutor is not available. Instead of relying on someone to tell them what to work on next, students can open the dashboard and see their lessons and progress in one place.

Student information and lesson progress are saved using **Web Storage**, so the data remains available after the page is refreshed or reopened.

## Features

- Save a student's name
- Display a personalized welcome message
- View six Algebra I lessons
- Start a lesson
- Review a quick concept refresher
- Answer interactive practice questions
- Practice with 10 randomly selected questions from a 40-question lesson bank
- Track correct answers during practice
- Track attempts internally
- Move through practice using a Next Question button
- Automatically complete a lesson after all 10 practice questions are answered
- Track missed questions and skills for future review features
- Track lessons as Not Started, In Progress, or Completed
- Track overall lesson progress
- Reset lesson and practice progress
- Keep student data persistent using `localStorage`

## Technologies and Tools

| Tool | Purpose |
| --- | --- |
| HTML | Creates the structure and content of the dashboard |
| CSS | Controls the layout and visual design |
| JavaScript | Handles student interactions, practice logic, and dashboard updates |
| Web Storage | Saves the student's name and lesson progress |
| Antigravity | Used to help build and develop the project |

## Project Structure

| File | Purpose |
| --- | --- |
| `index.html` | Contains the dashboard structure and lesson content |
| `style.css` | Contains the styling for the dashboard |
| `script.js` | Handles student names, lesson progress, practice questions, and Web Storage |

## Important Decisions

I kept the project simple so I could focus on practicing HTML, CSS, JavaScript, and Web Storage.

I separated the HTML, CSS, and JavaScript into three files so that each part of the project has a clear purpose and the code is easier to follow.

I also chose to use `localStorage` so that the student's name and completed lessons do not disappear when the page is refreshed.

## Challenges

One challenge was making the student's information and lesson progress persistent.

At first, information stored on the page would normally be lost after a refresh. I solved this by saving the student's name and completed lesson information in `localStorage`.

When the application opens again, JavaScript retrieves the saved information and updates the dashboard.

---

# Week 4 Update

## What I Changed

This week I continued working on the Student Math Dashboard and made several changes after testing it from the student's point of view.

### Reset Progress

I added a Reset Progress option so students can restart their lesson progress.

Before the progress is cleared, the dashboard asks the student to confirm the reset.

I decided that resetting progress should only reset the lessons. The student's saved name stays on the dashboard.

### Interactive Practice Questions

Originally, the practice question and the answer were shown at the same time.

When I tested the dashboard, I realized that this did not give the student a real chance to solve the problem first.

I changed the lesson so that students now have to enter an answer and click **Check Answer** before seeing the solution.

The dashboard gives feedback based on whether the answer is correct or incorrect.

### More Practice After an Incorrect Answer

At first, a student could get a practice question wrong and still mark the lesson as complete.

I did not think that made sense for the purpose of the dashboard.

Now, if a student gets a question wrong, they see the correct answer and receive another question from the same lesson.

The student has to answer one question correctly before the lesson can be marked complete.

### Lesson Status

I noticed that lessons were showing **In Progress** before the student had actually opened them.

I changed the lesson status so that each lesson now starts as **Not Started**.

A lesson only changes to **In Progress** after the student opens it.

Once the student completes the lesson, the status changes to **Completed**.

### Student Name

The dashboard originally opened with the name "Alice" already entered.

I removed the preset name because the dashboard should not assume who the user is.

For a new user, the name field now starts blank.

After the student enters and saves their name, the dashboard displays a personalized welcome message using that name.

## Current Features

At this stage, the dashboard allowed students to:

- Enter and save their own name
- Receive a personalized welcome message
- View three math lessons
- Start a lesson
- Review a quick concept refresher
- Answer a practice question before seeing the answer
- Check their answer and receive feedback
- Receive another question after an incorrect answer
- Answer a question correctly before completing a lesson
- Track lessons as Not Started, In Progress, or Completed
- Track overall lesson progress
- Reset lesson progress
- Keep their saved name after resetting progress
- Keep their name and lesson progress saved using `localStorage`

## Testing

I tested the updated dashboard using Go Live in Antigravity.

I checked that:

- The name field starts blank for a new user
- A saved name appears in the welcome message
- The saved name remains after refreshing the page
- Lessons begin as Not Started
- A lesson changes to In Progress after it is opened
- Practice answers are hidden until the student attempts the question
- Correct and incorrect answers receive feedback
- An incorrect answer gives the student another practice question
- A student cannot complete the lesson until they answer a question correctly
- Completed lessons update the overall progress
- Reset Progress returns the lessons to Not Started
- Resetting lesson progress does not remove the student's saved name

## Testing Challenge

While testing, the `open_browser_url` tool failed to create a browser context because the Playwright driver download returned a 404 error.

I closed that browser and used Go Live in Antigravity instead. This allowed me to run the dashboard and test the features manually.

## What I Parked

For now, I decided not to add:

- Student accounts
- Passwords
- A database
- Online progress syncing
- A teacher dashboard
- More advanced student analytics

I may add some of these later, but I want to keep the current version focused on the concepts I am learning now.

## Next Steps

Next, I may add more lessons and expand the practice question banks.

Later, I would like to explore student accounts and a database so that a student's progress could be saved across different devices.

---

# Week 5 Update

## What I Changed

This week I expanded the practice system in the Student Math Dashboard so students have to do more than answer one question correctly before completing a lesson.

Previously, a student could answer one practice question correctly and then mark the lesson complete. I wanted the practice to feel more useful, so I changed the lesson flow.

### Practice Progress Tracker

I added a visible practice tracker inside each lesson.

Students can now see:

- Which practice question they are working on
- How many answers they have gotten correct
- How many attempts they have made

The lesson displays progress such as:

`Question 2 of 4`

and:

`Correct: 1 | Attempts: 2`

This gives students a clearer idea of how they are doing while they practice.

### Four Correct Answers Required

Students now need to earn four correct answers before they can complete a lesson.

Getting one answer correct no longer unlocks the completion button.

If a student tries to mark the lesson complete too early, the dashboard tells them that they need four correct answers first.

### Primary and Backup Questions

Each lesson now uses four main practice questions and a bank of backup questions.

The student still sees the lesson as a four-question practice goal.

If a student gets one of the main questions wrong, the dashboard gives them a different question from the backup bank. The visible question number does not move forward until the student earns the correct answer.

For example, if the student is on `Question 2 of 4` and gets the question wrong, they receive another question but remain on `Question 2 of 4`.

This lets students continue practicing the same skill without immediately repeating the exact same problem.

### Next Question Button

I also added a **Next Question** button.

After a correct answer, students can move to the next practice question. The answer box and feedback are cleared before the next question appears.

Once the student earns four correct answers, the Next Question button disappears and the lesson can be marked complete.

### Reset Progress

I updated the reset feature so that it also clears the new practice data.

Resetting progress now resets:

- Lesson status
- Correct answer count
- Attempt count
- Current practice question
- Backup question position

The student's saved name still remains.

## Testing

I tested the updated practice flow manually using Go Live in Antigravity.

I checked that:

- Practice starts at `Question 1 of 4`
- Correct answers increase the correct score
- Every submitted answer increases the attempt count
- Incorrect answers do not increase the correct score
- An incorrect answer loads a backup question
- The visible question number stays the same after an incorrect answer
- Correct backup answers count toward the four required answers
- The Next Question button appears after a correct answer
- The Next Question button disappears after it is clicked
- Students cannot complete a lesson before earning four correct answers
- The lesson becomes available for completion after four correct answers
- Reset Progress clears the practice score and question progress

## Important Decision

I decided not to make students work through all of the questions in the question bank.

Instead, the visible goal remains four correct answers. The extra questions are used as backup questions when a student answers incorrectly.

I chose this approach because I wanted students to have another chance to practice without making the lesson feel unnecessarily long.

## What I Parked

For now, I decided not to add:

- Difficulty levels
- Timed practice
- Percentage grades
- Student accounts
- A database
- Teacher reports
- Adaptive question difficulty
- Online progress syncing

I may explore some of these later, but I want the current version to stay focused on lesson practice and progress tracking.

## Next Steps

Possible future updates include:

- Adding larger question banks
- Randomizing backup questions
- Saving practice scores between sessions
- Adding a lesson summary after completion
- Showing students which skills they may need to practice again

---

# Week 6 Update

## What I Changed

This week I made a major update to the Student Math Dashboard.

The project moved from a small three-lesson math prototype to a broader Algebra I practice dashboard with six lessons, larger question banks, randomized practice sessions, and more detailed progress tracking.

### Expanded to Six Algebra I Lessons

I expanded the dashboard from three lessons to six Algebra I topics:

- Linear Equations & Inequalities
- Systems of Equations
- Functions
- Exponents & Polynomials
- Quadratic Functions
- Statistics & Data

I also updated the lesson descriptions and icons so they match the new Algebra I content.

### Larger Question Banks

Each lesson now has a bank of 40 questions.

With six lessons, the dashboard now contains 240 practice questions in total.

I added skill labels to the questions so the dashboard can track the specific skill connected to each problem.

Examples of skill labels include:

- one-step-equations
- variables-on-both-sides
- substitution-method
- rate-of-change
- factoring-quadratics
- calculating-residuals

This will support future features such as showing students which skills they should practice again.

### Randomized 10-Question Practice Sessions

I changed the practice structure again.

Instead of requiring four correct answers, each lesson now gives the student a 10-question practice session.

The 10 questions are randomly selected from that lesson's 40-question bank.

Questions do not repeat within the same practice session.

The student now sees:

`Question 1 of 10`

and:

`Correct: 0 of 10`

A wrong answer still counts as one of the 10 questions. The student receives feedback and then moves to the next question.

### Removed the Student-Facing Attempt Counter

In the previous version, students could see both their number of correct answers and their total attempts.

I decided to remove the attempt count from the student-facing display.

The application can still track attempts internally, but I wanted the visible progress information to focus on the student's progress through the session rather than the number of mistakes they have made.

### Automatic Lesson Completion

I removed the need for students to manually mark a lesson complete.

Previously, the dashboard included a `Mark Complete` button.

Now, the lesson is automatically marked as `Completed` after the student answers Question 10.

The overall lesson progress is also updated automatically.

This makes the completion status reflect the work the student actually finished.

### Missed Skill Tracking

The dashboard now records:

- Correct answers
- Attempts
- Questions answered
- Missed questions
- Missed skills

This information is not all shown to the student yet, but it creates the foundation for future lesson summaries and practice recommendations.

## Testing

I tested the updated dashboard manually using Go Live in Antigravity.

I checked that:

- All six lesson cards appear correctly
- Each lesson opens independently
- Each lesson has a larger question bank
- A practice session selects 10 questions
- Practice displays `Question X of 10`
- Practice displays `Correct: X of 10`
- Incorrect answers do not increase the correct score
- Incorrect answers still count as answered questions
- The Next Question button moves the student through the session
- The same question is not intentionally repeated within one session
- The lesson is automatically marked complete after Question 10
- Completed lessons update the overall dashboard progress
- Reset Progress returns lesson progress to its starting state

## Important Decisions

### Question Bank Size vs. Session Length

I decided to separate the size of the question bank from the length of a practice session.

Each lesson has 40 available questions, but a student only receives 10 questions during one session.

This gives the student more variety without requiring them to complete all 40 questions at once.

### Progress Instead of Attempts

I decided not to make the number of attempts a prominent student-facing metric.

The dashboard still tracks attempts internally, but the student sees how many questions they have answered correctly instead.

### Practice Controls Lesson Completion

I also decided that students should not manually decide when a lesson is complete.

The lesson is now completed automatically after the student finishes the 10-question practice session.

## What I Noticed

Testing the new Algebra I questions exposed an issue with the current answer input.

The dashboard still uses a standard text field, which can make some mathematical answers difficult or awkward to enter.

For example:

- Fractions are easier to understand visually than when typed as plain text.
- Inequality answers should require the full inequality, such as `x > 4`, instead of accepting only `4`.
- Algebraic expressions can have multiple equivalent forms.

I would like the answer field to eventually behave more like a math input tool with a virtual math keyboard.

## What I Parked

For now, I decided not to add:

- A math input field
- A virtual math keyboard
- More advanced fraction entry
- More advanced algebraic equivalence checking
- Lesson summaries
- Saved practice scores between sessions
- Student skill recommendations
- Difficulty levels
- Timed practice
- Student accounts
- A database
- Teacher reports
- Online progress syncing
- A full visual redesign

I decided to leave the current visual design in place for now and focus on making the practice experience work correctly.

## Next Steps

Possible future updates include:

- Adding a math-friendly answer input
- Adding an on-screen math keyboard
- Requiring complete inequality responses
- Improving fraction entry
- Improving equivalent answer checking
- Saving practice results between sessions
- Adding a lesson summary after completion
- Showing students which skills they may need to practice again
