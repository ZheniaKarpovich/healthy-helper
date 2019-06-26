# Drivemotors Engine

The Back-end application is based on the koa framework and is written
using module-based architecture.

## Installation
NVM should be installed for run application in development mode.

```sh
cd /path/to/project/dir
cp .env_example .env
npm install
```

## Commands
* `npm start` - Runs the application in production mode.
* `npm run pm2` - Command for access to PM2.
Example: `npm run pm2 -- list`.
* `npm run dev` - Runs the application in development mode.
* `npm run log` - Starts reading of PM2 logs.
* `npm run eslint` - Runs code quality tool eslint.
* `npm run test` - Runs tests.

## Development
For start development use command `npm run dev`.\
This command starts application instance in
[debug mode](https://nodejs.org/en/docs/guides/debugging-getting-started/)
with automatically restart when a file of project is modified.\
Use IDE-integrated or browser inspector client.

For start reading of logs use command `npm run log`.\
All log files are stored in .log directory.\
For activate
[debug log](https://www.npmjs.com/package/debug)
uncomment DEBUG variable in .env file.
