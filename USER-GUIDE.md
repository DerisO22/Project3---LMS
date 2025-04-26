# User Guide
### Setup  
*Run Backend*  
Using the command `node server.js` will run the server's backend component on `port 3000`.  

*Run Frontend*  
* Ensure that `npm` is installed on the frontend server.  
    - Run `npm install` to install all necessary packages. This only needs to be done once.  
* After `npm` is successfully installed, input the command `npm start` to run the server on `port 3001`. 
* The frontend component requires confirmation to run on another port.
   
*Signing In*  
Once the server is successfully running in a browser, you are required to sign in.
The default login information is:  
-   **Username:** `ADMIN`  
-   **Password:** `ADMIN`  

***Troubleshooting***
Here are some common issues associated with server setup:  
*Backside Errors on MacOS*
If the backend throws an error upon startup, ensure that:  
* XCode is installed and up to date
  
If the issue persists, try reinstalling `express cors sqlite3`  
### Course Management
*Create a Course*  
Within the Course Management section, click the `Add Course` button to open the course creation form.  
To create a course for: Section 1 of Machine Learning (DAT-410) that meets in Joyce Hall room 210 and starts at 11:30, fill out the form like so:  
![Course Creation Image]()  

*Update a Course*  
In the event that course information has changed:
- Navigate to the Course Management Section
- Find the course you need to update
- Click on the `Edit` button within the `Actions` Column  

A pop-up form will appear:  
- Navigate to the information that you wish to change.  
- Make your alterations.  
- Click `Save Changes` at the bottom of the form to amend your changes.  

*Delete a Course*  
In the event that a course must be removed from the system:
- Navigate to the course you intend to delete
- Within the Actions column: find the `Delete` button
- Click the `delete` button

### Student Management  
*Create a Student*  
Within the student management section: click `Add Student`  
This will produce a form pop-up and all you to enter the student's information.   
To create a 2026 Data Science student named Boba Fett, with an associated email of boba.fett@starwars.org, follow this image:  
![Student Creation Image]()   

*Update a Student*  
Within the student management section, identify the student you are looking for.  
Within that row, navigate to the `Actions` column and select the `Edit` button.  
By default, the values will be autofilled, allowing you to edit specific information without the need to retype all of the student's data.  
Make the necessary changes and select: `Save Changes` to append your changes to the Student Database.  

*Delete a Student*  
To remove a student who has left the school:  
Navigate to the `Student Management` Section  
Find the specific student within the table.  
Navigate to the `Actions` Column for that student  
Select delete to remove the student from the database.  
  
### Grades Management  
*Add Student Grades*  
To add associated grades to a student profile:   
Navigate to the `Student Grades Management` section.  
Select: `Add Student's Grades`  
This will create a pop-up form.  
To input values for a specific student, identify the associated StudentID value.  
With the case of our previous student: Boba Fett's student ID is **294**  
Identify the CourseID for the class associated with the grades.  
In this case, DAT-210 has a CourseID of **1**  
Then fill the associated grades following the image below:  
![Student Creation Image]()   
**Note** that if a student has yet to complete an assignment or an assignment has yet to be assigned:  
Input a *0* for those grades  

*Update Student Grades*  
To update grades associated with a specific student:  
Navigate to the `Student Grades Management` section.  
Find the specific student you wish to edit:  
Navigate to the `Actions` column  
Select `Edit`  
This will create a pop-up window.  
Make the necessary changes  
Select `Save Changes` to append your grade changes  

*Delete Student Grades*  
To remove a student's listed grades:  
Identify the specific students grades within the `Student Grades Management` section.  
Navigate to that student's `Action` column  
Select delete   

### Student's Courses Management  
*Associate a Student with a Course*  
To associate a specific student with a specific course:  
Navigate to the `Student's Courses Management` section  
Select `Add Student Courses`  
This will create a pop-up window.  
Within the pop-up window:  
Click the `Select Student` dropdown  
Select the desired student  
Then click the `Select Course` dropdown  
Select the desired course  
Click `Save Changes` to confirm your changes  

*Update a Student-Course Pair*  
Navigate to the `Student's Courses Management` section  
Identify the Student-Course pair you wish to update  
Within that row, select `Edit`  
This will produce a pop-up window.  
Make your necessary changes.  
Click `Save Changes` to confirm your updates  

*Delete a Student-Course Pair*  
Navigate to the `Student's Courses Management` section  
Identify the Student-Course pair you wish to delete  
Within that row, select `Delete`  
