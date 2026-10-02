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

**-------------------------------------------------------------------------------------------------------------------------------------------------------**

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









📘 Project Journal

September 17, 2026



🔵 What I Worked On



This week I continued working on the Student Math Dashboard and focused on improving the practice experience for students.



I made several updates to the dashboard:



Added a question counter so students can see their progress through the practice section



Added a correct-answer score



Added an attempt counter



Added a Next Question button



Changed the lesson requirements so students must earn four correct answers before they can complete a lesson



Added backup questions that appear when a student answers incorrectly



Changed the practice flow so the visible goal remains four correct answers instead of showing every question in the question bank



Updated Reset Progress so it also clears the practice score, attempts, current question, and backup question position



🟡 Decisions I Made



One of the main decisions I made this week was changing how many correct answers a student needs before completing a lesson.



Previously, a student only needed one correct answer before they could mark the lesson complete. I decided that one correct answer was not enough practice, so I changed the requirement to four correct answers.



I also had to decide how the question bank should work.



At first, I considered simply showing all of the available questions as part of the lesson. I decided against that because I did not want every student to be required to complete a longer set of questions.



Instead, the student sees the practice as four questions. The extra questions are used as backup questions if the student answers one incorrectly.



For example, if a student is on Question 2 of 4 and answers incorrectly, the dashboard gives them another question, but the visible progress remains Question 2 of 4. Once they answer a question correctly, they can move forward.



I also decided to track attempts separately from correct answers. This allows students to see how many times they tried while still keeping the completion goal focused on four correct answers.



🔴 Challenges and Errors I Encountered



While working on the practice system, I ran into a few problems with the code.



At one point, there was a save conflict in Antigravity and part of the practice tracking code disappeared.



I also noticed duplicated code after one of the agent edits.



There were two declarations for the practice statistics and two declarations for the question number. There were also two different versions of the question counter being used at the same time.



Another issue was making sure the backup questions worked the way I wanted. I did not want the dashboard to show Question 1 of 8 because the student is not expected to complete eight questions. The goal is still four correct answers.



I also had to make sure Reset Progress cleared the new practice data and not only the lesson status.



🟢 How I Solved Them



When the save conflict happened, I compared the versions of the file and restored the missing practice tracking code.



For the duplicated code, I reviewed the changes before accepting them and had the Antigravity agent remove the duplicate variables and keep only the correct version.



I made sure the practice statistics were set up for all three lessons.



I also changed the question counter so it displays progress toward the four required correct answers instead of showing the total number of questions in the question bank.



The practice flow now uses four main questions and additional backup questions.



If a student answers incorrectly, the attempt count increases, but the correct-answer count does not. The dashboard then gives the student another question while keeping them on the same visible practice step.



If the student answers correctly, the correct-answer score increases and they can move to the next question.



Once the student reaches four correct answers, the practice section is complete and the lesson can be marked complete.



I also updated Reset Progress so it clears the correct-answer count, attempts, current question, and backup question position.



🧪 Testing



I tested the updated dashboard using Go Live in Antigravity.



I checked that:



Practice begins at Question 1 of 4



Correct answers increase the correct-answer score



Every submitted answer increases the attempt count



Incorrect answers do not increase the correct-answer score



An incorrect answer gives the student a backup question



The visible question number stays the same after an incorrect answer



A correct backup answer counts toward the four required correct answers



The Next Question button appears after a correct answer



The Next Question button moves the student forward in the practice flow



Students cannot complete a lesson before earning four correct answers



The lesson becomes available for completion after the student earns four correct answers



The practice completion message appears after the fourth correct answer



Reset Progress clears the practice score and question progress



The student's saved name remains after resetting progress



I also tested a full lesson from the first question through four correct answers.



The features worked as expected during my manual testing.



🟠 What I Parked



There are other features I could add, but I decided not to add everything at once.



For now, I parked:



Difficulty levels



Timed practice



Percentage grades



Student accounts



Passwords



A database



Online progress syncing



Teacher reports



Adaptive question difficulty



More advanced student analytics



I may come back to some of these later, but for now I want to keep the project focused on improving the practice experience and making sure the current features work well together.



🟣 What I Learned



One thing I learned this week is that using a coding agent does not mean I can accept every change without checking it.



The agent helped me make changes more quickly, but I still had to review the code carefully.



I caught duplicated variables, noticed when part of the practice tracking code was missing, and tested the dashboard myself before deciding that the changes were complete.



I also learned that the way a feature is presented to the student matters.



Technically, the dashboard could have shown all eight questions in the question bank, but that did not match the experience I wanted. The student only needs four correct answers, so I changed the visible counter to reflect that goal.



I also started thinking more about what should happen after a student gets something wrong. Instead of simply counting the mistake and moving on, I used backup questions so the student gets another opportunity to practice the same skill.



This week helped me see that building the feature is only one part of the process. I also have to think about the rules behind the feature, how the student experiences it, and whether the code actually matches what I intended.



🟣 Next Steps



Next, I want to:



Keep testing the practice flow and make sure all three lessons behave the same way



Keep the README updated as the project changes



Continue using clear commit messages that explain what I changed



Consider adding a lesson summary that shows the student's total attempts and correct answers



Explore larger or randomized question banks later



Continue thinking about student accounts and a database for a future version
**-------------------------------------------------------------------------------------------------------------------------------------------------------**

📘 Project Journal

September 28, 2026

🔵 What I Worked On

This week I made a major update to the Student Math Dashboard and changed both the content and the practice flow.

I expanded the dashboard from three general math lessons to six Algebra I lessons:

Linear Equations & Inequalities

Systems of Equations

Functions

Exponents & Polynomials

Quadratic Functions

Statistics & Data

I also expanded the question banks so that each lesson now has 40 questions, for a total of 240 questions across the dashboard.

Instead of using a small set of main questions and backup questions, each lesson now randomly selects 10 unique questions from its 40-question bank for a practice session.

I changed the practice display from a four-correct-answer goal to a 10-question session. Students now see:

Question X of 10

Correct: X of 10

I removed the attempt count from the student-facing display, although attempts are still tracked internally.

I also added skill labels to the questions so the application can keep track of which skills are connected to missed questions.

The practice data now tracks:

Correct answers

Attempts

Questions answered

Missed questions

Missed skills

I also changed lesson completion. Students no longer need to click Mark Complete. After the student answers Question 10, the lesson is automatically marked Completed and the overall dashboard progress updates.

🟡 Decisions I Made

One of the biggest decisions I made this week was separating the size of the question bank from the length of a practice session.

Each lesson has 40 questions available, but the student only receives 10 questions during one practice session.

I chose this because I wanted the dashboard to have more question variety without requiring a student to complete all 40 questions at once.

I also changed my decision from last week about requiring four correct answers.

After working with the larger question banks, I decided that a complete 10-question session gives me more useful information about how the student performed. A wrong answer now counts as one of the 10 questions instead of keeping the student on the same practice step until they get a correct answer.

I also decided to remove the visible attempt counter.

The dashboard can still track attempts internally, but I did not want the student-facing experience to focus on how many times the student was wrong. The main display now focuses on the current question and the number of correct answers.

Another decision was removing the Mark Complete button from the student experience.

I wanted lesson completion to be connected to actually finishing the practice session. The application now marks the lesson complete automatically after Question 10.

🔴 Challenges and Errors I Encountered

This week I made enough changes that I reached my Antigravity usage limit before I finished all of the updates I wanted to make.

I also ran into problems while changing the lesson completion logic.

At one point, the Mark Complete buttons were still appearing even though I wanted completion to happen automatically.

While editing the JavaScript, the application also reached a point where the lesson buttons were visible but could not be clicked. This showed me that a JavaScript error can stop the interactive parts of the page even when the HTML and CSS still display correctly.

Another challenge came from the math answer field.

The current input is a standard text field. This works for simple numeric answers, but it is harder to use for fractions, inequalities, and more complicated algebraic expressions.

I also noticed that some inequality questions accepted only the boundary number as an answer. For example, if the answer is x > 4, accepting only 4 does not show that the student understands the inequality.

🟢 How I Solved Them

I reviewed the lesson completion flow and changed the logic so that completing all 10 questions automatically changes the lesson status to Completed.

I removed the need for students to manually mark lessons complete.

I also kept the existing question bank and practice tracking structure instead of rebuilding the whole application again.

For the larger question banks, I used random question selection without replacement so a student receives 10 different questions from the 40-question bank during one session.

I added skill labels to each question so missed questions can be connected to specific skills later.

For now, I kept the standard text answer field because I did not want to add another major feature after making so many changes this week.

🧪 Testing

I tested the updated dashboard using Go Live in Antigravity.

I checked that:

All six Algebra I lesson cards appear

Each lesson opens independently

Each lesson has a 40-question question bank

A practice session selects 10 questions

The question counter displays Question X of 10

The score displays Correct: X of 10

Incorrect answers do not increase the correct-answer count

Incorrect answers still count as answered questions

The Next Question button moves the student through the practice session

The lesson is automatically marked complete after Question 10

Completed lessons update the overall dashboard progress

Reset Progress returns the lesson progress to its starting state

I also reviewed the practice questions and noticed areas where the answer input can be improved in a future update.

🟠 What I Parked

For now, I decided not to add:

A math input field

A virtual math keyboard

More advanced fraction entry

More advanced algebraic equivalence checking

Stricter inequality input validation

Lesson summaries

Saved practice scores between sessions

Student skill recommendations

Difficulty levels

Timed practice

Student accounts

Passwords

A database

Online progress syncing

Teacher reports

A full visual redesign

I decided to leave the current visual design in place for now because the main practice system has changed significantly this week and I want to make sure the learning flow is stable before redesigning it.

🟣 What I Learned

One thing I learned this week is that changing the structure of the practice system affects much more than the question counter.

Moving from four correct answers to a 10-question session required me to think about question selection, scoring, completion, feedback, missed skills, and how progress is shown to the student.

I also saw more clearly that the way students enter math matters.

A standard text field is easy to build, but it is not always the best tool for mathematical answers. Fractions, inequalities, exponents, and algebraic expressions need an input experience that feels natural for math.

I also learned that visible progress information can affect how the practice experience feels. I decided that Correct: X of 10 gives the student useful information without making the number of attempts the main focus.

This week also reminded me that coding agents can help me move quickly, but I still have to test the application myself. When the buttons stopped responding, the page still looked normal. Testing the actual interactions is what showed me that something had broken.

🟣 Next Steps

Next, I want to:

Improve the math answer input

Explore a math field with an on-screen math keyboard

Make fraction entry easier

Require complete inequality answers such as x > 4 instead of accepting only 4

Improve answer checking for equivalent mathematical expressions

Save practice results between sessions

Add a lesson summary after completion

Use the missed skill data to show students which skills they may need to practice again

Keep the README and project journal updated as the project changes

Continue using clear commit messages that explain what I changed