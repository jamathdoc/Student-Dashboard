# Student Math Dashboard

> "A simple space for students to learn, practice, and keep track of their progress."

The **Student Math Dashboard** is a beginner-friendly web application that allows students to enter their name, view available math lessons, start lessons, and track which lessons they have completed.

The project is designed for students who may need access to math learning materials when a teacher or tutor is not available. Instead of relying on someone to tell them what to work on next, students can open the dashboard and see their lessons and progress in one place.

Student information and lesson progress are saved using **Web Storage**, so the data remains available after the page is refreshed or reopened.

## Features

* Save a student's name
* Display a personalized welcome message
* View three math lessons
* Start a lesson
* Mark lessons as complete
* Track overall lesson progress
* Keep student data persistent using `localStorage`

## Technologies and Tools

| Tool        | Purpose                                                |
| ----------- | ------------------------------------------------------ |
| HTML        | Creates the structure and content of the dashboard     |
| CSS         | Controls the layout and visual design                  |
| JavaScript  | Handles student interactions and updates the dashboard |
| Web Storage | Saves the student's name and completed lessons         |
| Antigravity | Used to help build and develop the project             |

## Project Structure

| File         | Purpose                                                 |
| ------------ | ------------------------------------------------------- |
| `index.html` | Contains the dashboard structure and lesson content     |
| `style.css`  | Contains the styling for the dashboard                  |
| `script.js`  | Handles student names, lesson progress, and Web Storage |

## Important Decisions

I kept the project simple so I could focus on practicing HTML, CSS, JavaScript, and Web Storage.

I separated the HTML, CSS, and JavaScript into three files so that each part of the project has a clear purpose and the code is easier to follow.

I also chose to use `localStorage` so that the student's name and completed lessons do not disappear when the page is refreshed.

## Challenges

One challenge was making the student's information and lesson progress persistent.

At first, information stored on the page would normally be lost after a refresh. I solved this by saving the student's name and completed lesson information in `localStorage`.

When the application opens again, JavaScript retrieves the saved information and updates the dashboard.
