# Student Math Dashboard

> "A simple space for students to learn, practice, and keep track of their progress."

The **Student Math Dashboard** is a beginner-friendly web application that allows students to enter their name, view available math lessons, start lessons, and track which lessons they have completed.

The project is designed for students who may need access to math learning materials when a teacher or tutor is not available. Instead of relying on someone to tell them what to work on next, students can open the dashboard and see their lessons and progress in one place.

Student information and lesson progress are saved using **Web Storage**, so the data remains available after the page is refreshed or reopened.

## Features

- Save a student's name
- Display a personalized welcome message
- View three math lessons
- Start a lesson
- Mark lessons as complete
- Track overall lesson progress
- Keep student data persistent using `localStorage`

## Technologies and Tools

| Tool | Purpose |
| --- | --- |
| HTML | Creates the structure and content of the dashboard |
| CSS | Controls the layout and visual design |
| JavaScript | Handles student interactions and updates the dashboard |
| Web Storage | Saves the student's name and completed lessons |
| Antigravity | Used to help build and develop the project |

## Project Structure

| File | Purpose |
| --- | --- |
| `index.html` | Contains the dashboard structure and lesson content |
| `style.css` | Contains the styling for the dashboard |
| `script.js` | Handles student names, lesson progress, and Web Storage |

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

The dashboard now allows students to:

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