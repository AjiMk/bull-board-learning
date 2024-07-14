import express, {Request, Response} from "express";
import bull from "bull";
import fastRedact from "fast-redact"
import { Job, Queue, Worker } from "bullmq";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

const app = express();

const redisConnectionOption = {
  port: 6379,
  host: 'localhost',
};

const redact = fastRedact({
  paths: ['headers.cookie', 'password', 'access_token']
})


/**
 * Worker
 * 
 */
new Worker("FirstQueue", async(job: Job) => {
  return 1;
}, {
  connection: redisConnectionOption
});


/**
 * Queue
 *
 */
const queue = new Queue("FirstQueue");

/**
 * Server adapter
 * 
 */
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

/**
 * Queue adapter
 * 
 */
const queueAdapter = new BullMQAdapter(queue, {readOnlyMode: false, description:"First Queue"});
queueAdapter.setFormatter("name", (job: Job)=> {return `#${job.name}`});
queueAdapter.setFormatter("data", (data: any)=> redact(data))
queueAdapter.setFormatter("returnValue", (data) => data)

createBullBoard({
  queues: [queueAdapter],
  serverAdapter: serverAdapter,
  options: {
    uiConfig:{
      boardTitle: "Queue Board",
      miscLinks: [
        {text: 'Logout', url: '/logout'}
      ],
    },
  }
});

app.use("/admin/queues", serverAdapter.getRouter());

/**
 * Adding job
 */
app.get("/add/:id", (req: Request, res: Response) => {
  const jobName = `dummy_job_${req.params.id}`;

  queue.add(jobName, {"id":req.params.id});

  return res.json({status: "ok"});
})

app.get("/logout", (req, res) => {
  return res.end();
})

app.listen(3000, () => {
  console.log("Running on 3000....");
  console.log("For the UI, open http://localhost:3000/admin/queues");
  console.log("Make sure Redis is running on port 6379 by default");
});
