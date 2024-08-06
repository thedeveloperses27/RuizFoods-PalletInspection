# App Running Instructions
- Create .env file in project directory for environment variables (you can ask Ibrahim Saifullah ibrahim.saifullah1@gmail.com for this).
  - There should be `DB_HOST`, `DB_USER`, `DB_PORT`, `DB_PASSWORD`, `DB_DATABASE`, `JWT_SECRET`, `SENDGRID_API_KEY`.
  - If you want to continue to use SendGrid for email verification, ask me (Ibrahim) for my account login. I created it with a random password so that I can easily share it.
- Open terminal in project directory and run `npm start` to run React app
- Open another terminal in project directory and run `node NodeJS/server.js` to run server script

The main files to worry about are `src/App.js`, the `src/components` folder, and `NodeJS/server.js`.

# Database Creation Instructions
I personally chose PostgreSQL to create the database. I created the database in AWS RDS but have deleted since I am not sure how to manage the billing and I lose a few dollars a month.\
I created 5 tables: 1 for each warehouse and 1 for users. The warehouse tables were titled TX1, CA1, CA4, and SC1 which is how Ruiz Foods refers to them. Each of the warehouse tables have the same schema, with the primary key being `location_id` (data type: text), second column being `risk_level` (data type: boolean), `last_updated` (data type: timestamp with time zone), and `image_url` (data type: text).\
TX1 has 3526 rows. CA1 has 6472 rows. CA4 has 924 rows. SC1 has 3296 rows.\
I obtained .csv files with pallet locations from a company rep and wrote a script to populate these tables with the pallet locations, you can do the same. \
For users, I had primary key `email` (data type: text), column `password` with data type text (password gets hashed by the code), `verified` (data type: boolean), `first_name` (data type text) and `last_name` (data type text). 


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
