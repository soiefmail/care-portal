# Care Portal - A Medical Store/Billing Software for Any Health Care Center or Hospital

## Background
Care Portal is a medical store/billing/reporting Software runs locally on any platforms (Windows, Linux, Unix, Mac OS X, etc.). It's pretty easy to install and handy to use. You may change title, icon, logo, address, labels etc as you want in your organization directly in the files. For business changes, you can tweak the files. It's built on Model-View-Controller (MVC) architectural pattern. This is an open source software, free to use as per your need.

Through this application, you can take care of a patient's admission to discharge in your hospital. You can produce bills and keep track of all of your transactions and print receipt copy for various operations. Care Portal is currently caters Indoor Patient department (IPD). Outdoor Patient department (OPD) entry will be coming soon.

## Features
* Login Authentication used for secure access. 'bcrypt' password hashing mechanism is used to conceal password and secure your data.
* Patient registration, admission, discharge, package deal, payment track, invoice generation, due calculation etc facilities are available.
* Print patient, package, invoice etc details on the go.
* Include hospitals bills (bed charges, lab charges, doctor fees etc) along with medicine bills in the invoice.
* Check memory allocation (for admin).
* Delete a patient (for admin).
* Update patient Information (for admin).
* Block a User (Healthcare Agent) (for admin).
* Automated invoice, dues calculation based on advance paid and amount paid at the time of billing. 

## Demo / Example
Check out the link below to get a hands on experience:  
https://care-health-portal.herokuapp.com


You may sign up (new registration) there but to access all the controls, you need admin access. For admin access use below credential.  
Username: **admin**  
Password: **admin123**

## How to install it
###  Installation Guide for Mac OS X
1. Open mac terminal. To install homebrew, execute below command.
    ```
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    ```
2. Install and Run MongoDB with Homebrew. Run below commands one by one
    ```
    brew update
    brew install mongodb
    sudo mkdir -p /data/db
    # <Note: Provide your system password in case it's asking>
    sudo chown -R `id -un` /data/db
    # <Note: Provide your system password in case it's asking>
    ```
    **Reference**: https://treehouse.github.io/installation-guides/mac/mongo-mac.html .

    **Note**: To stop the Mongo daemon hit ctrl-c (control key + 'c' button).
3. Install nodeJS v8 using brew. Run below command in terminal -
    ```
    brew install node@8
    ```
4. Download or clone care-portal repo in your local and navigate to care-portal folder in terminal. For Example you may use below command - 
    ```
    cd /Users/<YOUR SYSTEM ID>/Downloads/care-portal
    ```
    or,
    type 'cd ' in terminal and drag and drop 'care-portal' into it.

5. Inject node dependencies. Execute - 
    ```
    npm i
    ```
6. Install bower using npm. 
    ```
    npm install -g bower
    ```
7. Inject bower dependencies. Execute -
    ```
    bower i
    ```
8. Install forever server globally. Execute-
    ```
    sudo npm install forever --global
    # <Note: Provide your system password in case it's asking>
    ```
9. Run your application -
    ```
    npm start
    # <Note: Provide your system password in case it's asking>
    ```
    Application will be opened in your favourite browser automatically. In case you face issues with that, you may go to "http://localhost:3000/" in your preferred browser.
10. To stop your application -
    ```
    npm stop
    # <Note: Provide your system password in case it's asking>
    ```
    **Note**: Next time when you want to open your application, just navigate to your working folder/repo as stated above and run npm start/stop in terminal.

###  Installation Guide for Windows
1. Install node/npm v8.11.3 from https://nodejs.org/en/blog/release/v8.11.3/ . Select your windows version (32 bit or 63 bit), download and install.
2. Install mongodb 3.2 from https://www.mongodb.com/download-center/community . Select the version as 3.2. Download and install.
3. Download or clone care-portal repo in your local and navigate to care-portal folder in your command prompt. You can use below command-
    ```
    cd <PATH/care-portal>
    ```
4. Run-
    ```
    npm i
    ```
5. Install bower using npm. 
    ```
    npm install -g bower
    ```
6. Inject bower dependencies. Execute -
    ```
    bower i
    ```
7. Install forever server globally. Execute-
    ```
    npm install forever --global
    ```
8. Double click on START_Care_Portal_Windows.bat to start
    Application will be opened in your favourite browser automatically. In case you face issues with that, you may go to "http://localhost:3000/" in your preferred browser.
9.  To stop the application, close all the command prompt windows and double click on STOP_Care_Portal_Windows.bat.

    **Note**: Next time when you want to open your application, just double click on START_Care_Portal_Windows.bat to start and double click on STOP_Care_Portal_Windows.bat to stop. Additionally you may create desktop shortcuts of these two bat files.

## Run the application in several machines
You may run this healthcare application in different machines. To do this, you have to make one system as your server machine where the application will run all the time. And to access it in a separate computer within the same network, you have to get the ipv4 address of the main computer where application is running and put it into the browser address bar of the other machines followed by ':3000'. For example the URL should look like '192.168.1.104:3000'. In windows run the below command in command prompt to get ipv4 address:
```
ipconfig/all
```

## User Manual
- Start your application.
- Sign Up / New Registration of user(Healthcare agent or admin):
By default signup page is available for new registration but any link to that page is not introduced for security reason. Visit "localhost:3000/signup" in your browser to create a new user id. If you want to deactivate the registration process, comment 'signup' route in "../care-portal/routes/index.js". It's recommended to create an 'admin' user as it has special rights privileges in the settings.

    Sample shot for Sign Up Page:
![alt text](https://github.com/soiefmail/care-portal/blob/master/screenshots/signup.png "Sign Up")

    In case you try to enter a duplicate user id, you will get error as shown below:
![alt text](https://github.com/soiefmail/care-portal/blob/master/screenshots/duplicateUser.png "Duplicate User")

- Login / Sign In:
User can login using the credentials created during sign up.

    Sample shot for Login Page:
![alt text](https://github.com/soiefmail/care-portal/blob/master/screenshots/login.png "Login")

- Reset Password:
Any user can change the password by clicking on 'Change Password' button in login page.

    Sample shot for Change Password Page:
![alt text](https://github.com/soiefmail/care-portal/blob/master/screenshots/changePassword.png "Change Password")

-  Home page or Menu Page gives you the options to select your operation.
    Sample shot for Home Page:
![alt text](https://github.com/soiefmail/care-portal/blob/master/screenshots/home.png "Home")

- Registration for a new patient:
Register a new patient. An auto generated unique id will be shown in the Registration Id box.
For example, "1/CARE/IPD/03/2019" where 1st digit denotes the incremental serial id, 2nd one denotes healthcare name, 3rd one denotes admission type(i.e. IPD or OPD), 4th and 5th one denote current month and year. This sequence makes this is a unique id which could help you to fetch or modify any patient record. The 'Date of Registration' field also gets auto-populated based on your locale. On successful patient registration, you can take a print out by clicking the 'Print Registration Form' button.

    Sample shot for Registration Page:
![alt text](https://github.com/soiefmail/care-portal/blob/master/screenshots/registrationPage.png "Registration")

    Sample shot for Registration Success Page:
![alt text](https://github.com/soiefmail/care-portal/blob/master/screenshots/registrationPageSuccess.png "Registration Success")

    Sample shot for Print Preview of Registration Page:
![alt text](https://github.com/soiefmail/care-portal/blob/master/screenshots/printRegistration.png "Print Registration")

- Package Declaration:
You may keep a note here for the offered package.

    Sample shot for Package Offered Page:
![alt text](https://github.com/soiefmail/care-portal/blob/master/screenshots/package.png "Package")

    Sample shot for Print Package Preview:
![alt text](https://github.com/soiefmail/care-portal/blob/master/screenshots/printPackage.png "Print Package")

- Advance Page:
You may keep a note of the advance taken from the patient party and print out the receipt.

- Patient Admission Page:
This page is used to admit the registered patient to your healthcare center. Here you may declare the name of the referrer who took commission and bought the patient.

    Sample shot for Admission Page:
![alt text](https://github.com/soiefmail/care-portal/blob/master/screenshots/admission.png "Admission")

- Invoice Generation Page:
This page is used to generate invoice. Just fill the particular in the table and the corresponding amount will be auto-calculated.

    Sample shot for Invoice Page:
![alt text](https://github.com/soiefmail/care-portal/blob/master/screenshots/invoice.png "Invoice")

    Sample shot for Invoice Receipt Print Preview:
![alt text](https://github.com/soiefmail/care-portal/blob/master/screenshots/printInvoice.png "Invoice Print")

- Due Page:
You may keep a note here if any due from patient party is pending.

- Get All Payment Details Page:
You can fetch all the transaction details of all patients in a consolidated table. You just need to provide start date and end date to fetch the details within that given date.

    Sample shot for Get All Payment Details Page:
![alt text](https://github.com/soiefmail/care-portal/blob/master/screenshots/getAllPayments.png "Get All Payments")

- Update Aadhar Card Page:
You can modify your aadhar id / Voter Card Id / Social Security Id from this page.

- Settings Page:
Only an admin can open this page. You can see memory allocation for different mongodb collections. You can a delete a patient also. This delete is a soft delete. The deleted record will be saved in 'DeletedPatient' collection. An admin can change/modify an admitted patient details. Other users are not authorised to do that. An admin can block any particular user/agent's user id to revoke the access of that user/agent.

    Sample shot for Settings Page:
![alt text](https://github.com/soiefmail/care-portal/blob/master/screenshots/settings.png "Settings")


## Tools / Softwares Used
| Type        | Tools           |
| ------------- |:-------------:|
| Server Environment      | NodeJS |
| Package Manager      | Bower |
| Database      | Mongo DB |
| CLI Tool - Server Environment      | forever |
| Scripting Library      | JQuery |
| Styling Web Framework      | Bootstrap |
| Node Server Engine      | express |
| Templating Engine      | handlebars |

## Purpose of use of Different Tools / Softwares
- NodeJs is used as it is a free open source JavaScript runtime built on Chrome's V8 JavaScript engine which helps to create server environment and runs on various platforms (Windows, Linux, Unix, Mac OS X, etc.)
- Forever is a simple CLI tool for ensuring that a given script runs continuously (i.e. forever).
- Bower is a command line utility which manages lots of things — web components, libraries, assets, and utilities.
- MongoDB is a document database with the scalability and flexibility that stores data in flexible, JSON-like documents and easily runs on you local. It's easy to handle.
- Express is a Node.js web application framework that provides features for web applications such as server creation, routing etc.
- Handlebars helps to build semantic templates effectively with no frustration. 

## Logs
You may check your output/console logs and error logs in out.log and err.log files. Note that every time we start care-portal application we first cleaning the previous logs.
