📘 Project Journal
August 28, 2026
🔵 What I Worked On
Today I started building a simple Student Math Dashboard.

I created the basic structure for the project using:

index.html

style.css

script.js

The dashboard allows a student to enter their name, view math lesson cards, start lessons, and mark lessons as complete.

🟡 Decisions I Made
I decided to keep the project simple and focus on the skills we are currently using in class.

I chose to use separate HTML, CSS, and JavaScript files so the project stays organized.

I also decided to use Web Storage so that the student's name and lesson progress remain saved after the page is refreshed.

🔴 Challenges I Encountered
One challenge was figuring out how to keep the student's information from disappearing when the page reloads.

Another challenge was deciding how much functionality to include without making the project too complicated.

🟢 How I Solved Them
I used localStorage to save the student's name and completed lessons.

I also limited the first version to three lessons, a progress tracker, and basic lesson buttons. This allowed me to practice the main concepts without adding features that I had not learned yet.

🟣 Next Steps
Next, I want to:

Test that the saved name remains after refreshing the page

Test that completed lessons stay marked as complete

Make sure the progress tracker updates correctly

Review the code before pushing the project to GitHub
-------------------------------------------------------------------------------------------------------------------------------------------------------
September 4, 2026
🔵 What I Worked On
This week I kept working on the Student Math Dashboard and focused on making the lessons work better for students.

I made several updates to the dashboard:

Added a Reset Progress option

Changed the practice questions so students do not see the answer before trying the problem

Added an answer field and a Check Answer button

Added feedback for correct and incorrect answers

Added more practice questions so students get another question if they answer incorrectly

Changed the lesson rules so students have to answer a question correctly before they can mark the lesson complete

Fixed the lesson status so lessons start as Not Started instead of showing In Progress before they are opened

Removed the preset student name "Alice"

Changed the name field so it stays blank until the user enters and saves their own name

Updated the welcome message so it uses the name the student actually saves

🟡 Decisions I Made
One of the main things I changed was how the practice questions work.

At first, the question and the answer appeared at the same time. When I tested the dashboard, I realized that did not give the student a real chance to solve the problem on their own. I changed it so the student has to enter an answer and click Check Answer before seeing the solution.

I also noticed that a student could get a question wrong and still mark the lesson as complete. I did not think that made sense. If the goal is for the student to practice the concept, simply attempting the question should not be enough.

I changed it so that when a student gets a question wrong, they see the correct answer and then get another question from the same lesson. They have to answer one question correctly before they can mark the lesson complete.

I also changed how the lesson statuses work. A lesson should not say In Progress if the student has never opened it. Now, each lesson starts as Not Started and only changes to In Progress after the student actually starts the lesson.

Another change I made was removing the preset name "Alice." The dashboard should not assume who the user is. A new user now starts with a blank name field. Once they enter and save their name, the dashboard uses that name in the welcome message.

For the Reset Progress feature, I decided that resetting lesson progress should not remove the student's name. A student might want to start their lessons again without having to enter their name again.

🔴 Challenges and Errors I Encountered
While testing the dashboard, the open_browser_url tool failed to create a browser context because the Playwright driver download returned a 404 error.

Instead of stopping there, I closed that browser and tried running the project with Go Live in Antigravity. That worked.

I also noticed several problems while testing the dashboard myself:

Lessons were showing In Progress before I had opened them

Practice answers were visible before the student attempted the question

Students could mark a lesson complete even after answering the practice question incorrectly

"Alice" was already entered as the student name even though a new user had not entered anything

These were not things I planned to change at the beginning. I noticed them while actually using the dashboard.

🟢 How I Solved Them
Since the automated browser test did not work, I used Go Live in Antigravity to test the dashboard manually.

For the Reset Progress feature, I entered and saved my name, marked lessons as completed, and then selected Reset Progress. A confirmation message appeared asking if I was sure I wanted to reset my progress. After I selected Yes, the lesson progress reset and my saved name stayed on the dashboard.

For the practice questions, I removed the answer that was automatically displayed. Students now have to enter their own answer and click Check Answer.

If the answer is correct, they receive feedback and can complete the lesson. If the answer is wrong, they see the correct answer and receive another question from the same lesson.

I also fixed the lesson status so that a lesson begins as Not Started. It only changes to In Progress after the lesson has actually been opened.

For the student name, I removed the preset "Alice" value. The name field now starts blank for a new user, and the personalized welcome message only appears after the student saves their own name.

🧪 Testing
I tested the updated dashboard using Go Live in Antigravity.

I checked that:

A new user's name field starts blank

A saved name appears in the welcome message

The saved name remains after refreshing the page

Lessons begin as Not Started

A lesson changes to In Progress after it is opened

Practice answers are hidden until the student attempts the question

Students can enter and check their answers

Correct answers receive feedback

Incorrect answers receive feedback and another question

Students cannot complete a lesson until they answer a question correctly

Completed lessons update the overall progress

Reset Progress returns the lessons to Not Started

Resetting progress does not remove the saved student name

The features worked as expected during my manual testing.

🟠 What I Parked
There are other features I could add, but I decided not to add everything at once.

For now, I parked:

Student accounts

Passwords

A database

Online progress syncing

A teacher dashboard

More advanced student analytics

I may come back to some of these later, but for now I want to keep the project focused on the concepts I am currently learning.

🟣 What I Learned
One thing I noticed this week is that getting the code to work is only part of the process.

Testing the dashboard myself helped me catch things I would not have noticed just by looking at the code.

For example, the original practice question technically worked, but showing the answer immediately made it less useful. I also realized that letting a student complete a lesson after getting the question wrong did not match the purpose of the dashboard.

I started looking at the project more from the student's point of view instead of only asking whether the feature worked.

I also learned that if a testing tool fails, it does not automatically mean the application is broken. The automated browser did not work, but I was still able to run and test the dashboard using Go Live.

Most of my changes this week came from actually using the dashboard and noticing where the student experience did not make sense. Testing it helped me decide what needed to change and why.

🟣 Next Steps
Next, I want to:

Review the current code and make sure all of the features continue working together

Keep the README updated as the project changes

Continue using clear commit messages that explain what I changed

Add more lessons and practice questions later

Explore student accounts and a database in a future version

