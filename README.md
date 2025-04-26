# LMS Project | Ryan, Deris, and Thomas
CSI-300: Database Management Systems


## Mac Setup:
- Clone Project using: `https://github.com/DerisO22/Project3---LMS`

## Run Project:
### Backend
  - run `node server.js` to start the backend

### Frontend
  - run `npm install` to ensure all proper packages are downloaded locally
  - run `npm start` to run the server in a browser

## Troubleshooting Common Issues on MacOS:
### Issue: 
Backend throws an error
### Fix:
Ensure Xcode is up to date
Rerun `node server.js` on the backend

If issue persists: try reinstalling `express cors sqlite3`


## Windows Setup
- Clone Project using `https://github.com/DerisO22/Project3---LMS`

## Run Project:
### Backend
  - Install NodeJS using: `Winget install OpenJS.NodeJS`
  - Restart your system (might still work without)
  - Grant user access using: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`
  - Set up NPM using: `npm init -y`
  - Common issue resolved by running: `npm uninstall express cors sqlite3`
  - Then reinstall those dependencies using: `npm install express cors sqlite3`

### Frontend
  - run `npm install` to ensure all proper packages are downloaded locally
  - Switch Port by using VSCodes code replacement tool (top left). Then replace all instances of `localhost:3000` with `localhost:5000`
  - Then in server.js, swap:
  ``` javascript 
  app.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'));
  ``` 
  to the correct port (5000)
  - run `npm start` to run the server in a browser