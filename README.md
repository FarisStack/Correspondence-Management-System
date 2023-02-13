# Correspondence Management System - Email Workflow Tracking & Instant Messaging Channels.
This repository holds the source-code for my graduation project. This project was submitted in partial fulfilment of the requirements for the bachelor's degree in computer systems engineering.
Below attached the project's thesis with a brief presentation 👇
#### Thesis 📗
https://drive.google.com/file/d/1OXVQ2hIC8Wc7Fxy2aGu4qBtuP7D7ndt2/view?usp=sharing
#### PowerPoint Presentation 🖼️
https://docs.google.com/presentation/d/1WG8mI9JSiwxuydh7glXp416hBfBjR7a8/edit?usp=sharing&ouid=101911150244059699323&rtpof=true&sd=true

![F-2](https://user-images.githubusercontent.com/54215462/180660408-75c4d796-d6fe-4813-a658-50cfc92cfb76.jpg)


# Abstract
- The idea of developing a Correspondence Management System (CMS) was first inspired by discovering our university's HRM "Human Resources Management System".
- By questioning the head of the department, Dr. Mohammad Khalil, and some of our lecturers on how the communication process runs among these lecturers themselves, and among the lecturers and their heads of departments and deans for example, we concluded that the process of workflow communications and messaging inside our university is almost automated and pretty much comfortable.
- Hence, we began thinking of why not trying to adopt a new similar software system that offers the same essential functions and modules which the PTUK HRM system offers,
 but with an attempt to generalize the system by making it flexible to fit the needs of any organization, not only a university, since most of the establishments share a nearly similar workflow communication and messaging process, with some additional custom differences.
<img width="586" alt="image" src="https://user-images.githubusercontent.com/54215462/218521098-540ef54a-2e27-4401-88a8-9361459e2f24.png">
<img width="583" alt="image" src="https://user-images.githubusercontent.com/54215462/218521598-9003073e-a872-4c34-ae83-462d3de00061.png">


# Problem Statement
<img width="579" alt="image" src="https://user-images.githubusercontent.com/54215462/218522252-7cebcea7-a9df-4e5f-9506-b2cb83ad47e4.png">
<img width="587" alt="image" src="https://user-images.githubusercontent.com/54215462/218522291-045db91f-851a-40bb-b42b-187fede89fff.png">


## Functional Features
### 1. Build the Organizational Structure
![image](https://user-images.githubusercontent.com/54215462/218528958-fd7fc906-b011-4b80-9b0d-7b4db003cf6b.png)
<img width="535" alt="image" src="https://user-images.githubusercontent.com/54215462/218522647-b99a5326-59b3-4220-ba33-924ca1a197d5.png">
<img width="590" alt="image" src="https://user-images.githubusercontent.com/54215462/218522693-532a1705-4baa-4488-a174-7c132b1aa6b0.png">
<img width="593" alt="image" src="https://user-images.githubusercontent.com/54215462/218522753-3803c864-4879-4588-aec3-7d344155dbb6.png">
<hr />

### 2. Registering a new employee 
![image](https://user-images.githubusercontent.com/54215462/218529016-0e0626be-6cdc-4c0f-b1a7-5ba693c1181e.png)
![image](https://user-images.githubusercontent.com/54215462/218523009-1f814646-f010-4b9b-9019-98a82a89563a.png)
<hr />

### 3. User Login
<img width="589" alt="image" src="https://user-images.githubusercontent.com/54215462/218523122-13fec49c-7e7b-4366-9375-cddfecd97236.png">
<hr />

### 4. User Logout
- The authenticated user should be able to logout when they want to. 
- The authenticated user should be automatically logged out when their cookie/session which stores their info expires.
![image](https://user-images.githubusercontent.com/54215462/218523252-32204c0f-c352-45aa-b7df-992cd0d7b0fd.png)
<hr />


### 5. Forget Password
![image](https://user-images.githubusercontent.com/54215462/218523582-c18c6125-82fa-4616-a38d-f6c3964d451a.png)
![image](https://user-images.githubusercontent.com/54215462/218523626-d54a8d6b-d644-46f3-a809-fd833d664eae.png)
![image](https://user-images.githubusercontent.com/54215462/218523671-fbba8889-ae46-484d-aa70-f37867855485.png)
- An email with a secret token will be sent to the user to reset their password:
- The user should be allowed to reset their password only if the clicked link is valid and not expired:
![image](https://user-images.githubusercontent.com/54215462/218523790-88aadb6e-1233-456c-9b0f-0521af411bde.png)
![image](https://user-images.githubusercontent.com/54215462/218523807-09c13782-376d-456b-88c1-8185df61a630.png)
<hr />

### 6. Send a new workflow (email)
- The authenticated user can send a workflow to the people he/she is allowed to send to according to his/her position in the organizational structure/hierarchy.
![image](https://user-images.githubusercontent.com/54215462/218523833-862e64c6-82f7-4ab3-a927-d45ccff72d56.png)

- Convenient Rich-Text Editor
![image](https://user-images.githubusercontent.com/54215462/218524043-cc9c1995-0bbe-409d-b76e-ba68ec43b33c.png)

- Attach multiple files with the email before sending. In addition to the drag and drop feature
![image](https://user-images.githubusercontent.com/54215462/218524195-2c42743d-8b7b-49a9-9f34-7593834a1ba8.png)

- Inbox page shows the user all their workflows which were received from other users. Emails where users put you as a direct recipient (consignee)
![image](https://user-images.githubusercontent.com/54215462/218524261-d79e2a89-0a43-4c02-8743-3a46de886795.png)
<hr />


### 7. View CC Page
- CC page shows the user all their workflows which were received from other users. Emails where users put you as a CC recipient (not a direct consignee)
![image](https://user-images.githubusercontent.com/54215462/218524346-c471bd33-bdaa-418f-a3ae-23da9088fd2c.png)
<hr />


### 8. View Follow-up page
- Follow-up page shows the user all their workflows which were sent by him/her. Emails which the user sent/created.
![image](https://user-images.githubusercontent.com/54215462/218524455-ece275a1-ff9e-4093-8850-31a4cab54b99.png)
<hr />

### 9. Archiving emails
- Archiving lets you tidy up your inbox, CC, and Follow-up pages - by moving messages into you’re the archive, so you don't have to delete anything.
![image](https://user-images.githubusercontent.com/54215462/218524530-3773e4e4-5607-47eb-8d23-bcc1e9d53095.png)
<hr />


### 10. Pin / Unpin an Email
![image](https://user-images.githubusercontent.com/54215462/218524689-225f232e-72ad-42da-8fc0-74645cd4383c.png)
<hr />

### 11. On request pagination
- Imagine the delay that is caused when the user views their inbox that contains more than 1000 records for example! 
- Emails should be fetched from the server only on-demand. Which means: Don’t fetch huge amount of data at once. Instead, fetch data in batches 
![image](https://user-images.githubusercontent.com/54215462/218524731-3d4bd7c6-0173-4688-bd09-b3dc617538c3.png)
<hr />

### 12. Show a chronological stack/sequence of all "actions" or "replies" on this specific email
![image](https://user-images.githubusercontent.com/54215462/218524865-9193e697-be43-469e-8739-ed463344c286.png)
<hr />


### 13. Reply / forward / add new action to the currently clicked email
![image](https://user-images.githubusercontent.com/54215462/218524952-bde2b0ab-8208-4e98-bf58-ab8cbea857f4.png)
<hr />


### 14. Print the page as PDF
- Sometimes the user needs to have a physical copy of an email. So, once the user has clicked on a specific email record, the user can click on print page button to provide a .pdf or a .doc version of the chronological stack/sequence of all "actions" or "replies".
![image](https://user-images.githubusercontent.com/54215462/218525112-7e6d49a8-7a2c-4a8b-82f0-4ba4f515a8e4.png)
![image](https://user-images.githubusercontent.com/54215462/218525129-82e89660-2c0a-4627-a3cb-fba772e043a0.png)
<hr />

### 15. Search (filter) Emails
![image](https://user-images.githubusercontent.com/54215462/218525157-8dd201b1-eed4-45d8-83f2-cd4bf4d259ea.png)
<hr />


### 16. Fetch list of employees this user can message
![image](https://user-images.githubusercontent.com/54215462/218525275-9d870054-985b-4fb4-a659-b2d8d825e2f7.png)
![image](https://user-images.githubusercontent.com/54215462/218525315-a0033d5d-8555-458d-a496-199cb092c14b.png)
![image](https://user-images.githubusercontent.com/54215462/218525340-8753802c-cded-443f-adc8-732cbf544e16.png)
![image](https://user-images.githubusercontent.com/54215462/218525351-b57aade2-57ab-4950-9f0e-61034613c1b4.png)
<img width="594" alt="image" src="https://user-images.githubusercontent.com/54215462/218525404-b4d354f9-2378-44fa-bd2c-e982f6e4882e.png">
<hr />

### 17. Switch to another position while logged in
• Since the employee can have more than one position,• although, the employee will have only one account, but he/she can determine in which position he/she is currently logged in.
![image](https://user-images.githubusercontent.com/54215462/218525653-67bc08ab-7d6e-46c0-a725-42d4c29aa16c.png)
<hr />

### 18. Update Employee's Info
- The user can update their basic information, such as: their full name, phone number, birth date, city of residence, gender, marital status, and so on.
![image](https://user-images.githubusercontent.com/54215462/218525709-48a85873-801e-461d-90a3-238542745796.png)
<hr />

### 19. Change Password
![image](https://user-images.githubusercontent.com/54215462/218525892-ed538f55-963b-403f-9690-acbd2c30d733.png)
<hr />



### 20. Search Employees
![image](https://user-images.githubusercontent.com/54215462/218526847-bd603f28-2d97-449e-aaf0-57b4ea3143b9.png)
![image](https://user-images.githubusercontent.com/54215462/218526904-c53fe60d-cc22-4fb0-8d5a-b2c7aab59589.png)
<hr />

### 21. Manage employees' positions, job titles, and classifications (for admin)
- The admin can assign new positions with job titles and classifications to an employee.
- Remove some of the current positions assigned to an employee
- Update the current positions, job titles, and classifications of an employee. 
![image](https://user-images.githubusercontent.com/54215462/218526972-5bc32672-4c96-475f-97b2-71908fbed734.png)
<hr />

### 22. Create a direct messaging channel for real-time chat
<img width="590" alt="image" src="https://user-images.githubusercontent.com/54215462/218527092-2c6a9d5e-f002-4388-aaf7-716171931b9a.png">

<img width="422" alt="image" src="https://user-images.githubusercontent.com/54215462/218527227-69614042-c695-41f5-8410-476282cc3d9e.png">


<hr />

### 23. Create a group channel for real-time chat
<img width="584" alt="image" src="https://user-images.githubusercontent.com/54215462/218527274-85e59fb5-2c52-4dd7-8ce0-51f3c35659dd.png">
<hr />

### 24. Add and remove members from a channel + Rename channel
<img width="496" alt="image" src="https://user-images.githubusercontent.com/54215462/218527420-82add985-2c10-43f5-83ff-36c6529c4b83.png">
<hr />

### 25. Receive Push Notifications
<img width="587" alt="image" src="https://user-images.githubusercontent.com/54215462/218527470-a3aa4d4e-b4df-471d-bc57-e11a78b0994f.png">
<img width="583" alt="image" src="https://user-images.githubusercontent.com/54215462/218527553-27bd94e3-2313-4530-a8c8-46300691dc95.png">
<hr />

## Database Relational Schema
![image](https://user-images.githubusercontent.com/54215462/218527742-66fa4667-2740-48b2-98ab-eceb1ffc60dd.png)
<hr />





