# Applicant Tracker
Applicant Tracker is a sample application that you with a working example of a Backbone app using the Kinvey Backbone client library. It demonstrates the use of Backbone Models and Collections with Kinvey, along with relational data, user management, and integration with the Github API. The app is used to track job applicants, pull developer Github profiles, and allow users to record notes on each appliant's profile.

## Run It
After downloading or cloning the repository:

* Replace `App Key` and `App Secret` (in `js/init.js`) with your application's credentials.
* Add a user to your Kinvey backend through the [web console](https://console.kinvey.com/addons/users/new), and set the permissions for users to "Read Only" (under the [Settings](https://console.kinvey.com/addons/users/settings) page).
* Create an `applicants` collection and import `backend/applicants.json` for some sample data to get started with. Make sure to set the permissions to "Full" for this collection as well.
* Copy the contents of `backend/applicants-post-fetch.js` into the post-fetch [custom code](https://console.kinvey.com/addons/business-logic/applicants) for the `applicants` collection, making sure to add your Github API keys to the top of the file.
* Install the Grunt dependencies:

```
npm install
```

* Run the local development environment with Grunt (launches a local server and watches for changes)

```
grunt
```

Check it out in action at [http://localhost:3000](http://localhost:3000)

## Functionality
This application demonstrates:

* Basic set-up for Backbone.js apps using Kinvey
* Storing and retrieving data using Backbone Models and Collections
* Managing user sessions, logins, and state
* Connecting to external API's, like Github
* Modeling relational data using the Kinvey library and backbone-associations

## Architecture
The starting point of this application is `js/init.js`. This app uses RequireJS to manage dependencies. 

Any applicants with a Github username attached to their record (under the `github`) property will automatically display that applicant's Github profile. This is done using custom server code - for the exact code, see the `backend/applicants-post-fetch.js` file.