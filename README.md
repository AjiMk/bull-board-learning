# Bull-Board Learning Repository

This repository is a personal project for learning how to use Bull-Board with TypeScript, Node.js, and Express. Bull-Board is a UI built on top of bull and bullmq, a Node.js redis based queue library.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Bull-Board APIs](#bull-board-apis)
- [Learning Progress](#learning-progress)
- [Resources](#resources)
- [Contributing](#contributing)

## Installation

1. Clone the repository:

```sh
git clone git@github.com:AjiMk/bull-board-learning.git
cd bull-board-learning
```

2. Install dependencies:

```sh
npm install
```

## Usage

1. To start the server, run:

```sh
npm start
```

2. Open your browser and navigate to `http://localhost:3000/admin/queues` to access the Bull-Board UI.

## Project Structure

```
.
├── src
│   └── index.ts
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

- `src/index.ts`: Main entry point of the application.
- `.gitignore`: Specifies files and directories to be ignored by Git.
- `package.json`: Contains project metadata and dependencies.
- `tsconfig.json`: TypeScript configuration file.
- `README.md`: Project documentation.

## Scripts

- `npm watch`: Starts the application in watch mode.
- `npm start`: Starts the application.
- `npm run build`: Compiles the TypeScript code to JavaScript.


## Bull-Board APIs

Here is the list of internal APIs utilized by the bull-board. All actions related to bull or bullmq are executed through these APIs. If you wish to contribute to the the bull-board API, please review this [API package](https://github.com/felixmosh/bull-board/tree/master/packages/api) from bull-board.


**Base URL:** `http://localhost:3000`

#### Redis stats
`GET '/api/redis/stats`

#### Queues
`GET /api/redis/stats`

#### Job logs
`GET /api/queues/:queueName/:jobId/logs`

#### Job
`GET /api/queues/:queueName/:jobId`

#### Add new Job
`POST /api/queues/:queueName/add`

#### Retry all jobs
`PUT /api/queues/:queueName/retry/:queueStatus`

#### Promote Queue
`PUT /api/queues/:queueName/promote`

#### Clean queue
`PUT /api/queues/:queueName/clean/:queueStatus`

#### Pause Queue
`PUT /api/queues/:queueName/pause`

#### Resume Queue
`PUT /api/queues/:queueName/resume`

#### Empty Queue
`PUT /api/queues/:queueName/empty`

#### Retry Job
`PUT /api/queues/:queueName/:jobId/retry/:queueStatus`

#### Remove Job 
`PUT /api/queues/:queueName/:jobId/clean`

#### Promote Job
`PUT /api/queues/:queueName/:jobId/promote`

## Learning Progress

This section will be updated regularly with my learning progress and notes:

### Day 1

- Set up the project with TypeScript, Node.js, Express, and Bull-Board.
- Created a basic Express server and integrated Bull-Board.

### Day 2

- Implemented the bull-board multi-instance example in the example/multiple-instance branch.
- Tested:
    - Job progress
    - Job retry from completed stage
- Implemented UI customizations and queue formatter options.
- Added an API endpoint to dispatch a job: /add/<id>
- Learned the core structure of Bull-Board, including:
    - Adapters (Server and Queue)
    - Internal APIs
    - How the bull-board instance injects APIs into the provided server adapters.

## Resources

- [Bull-Board GitHub Repository](https://github.com/felixmosh/bull-board)
- [bull Documentation](https://github.com/OptimalBits/bull)
- [bullmq Documentation](https://github.com/taskforcesh/bullmq)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express Documentation](https://expressjs.com/)

## Contributing

Feel free to fork this repository and submit pull requests. Any suggestions or improvements are welcome!

---

Happy coding!
