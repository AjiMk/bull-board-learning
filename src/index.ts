import express from "express";
import bull from "bull";
import { Queue } from "bullmq";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

const app = express();

/**
 * Create a new queue
 *
 */
const queue = new Queue("FirstQueue");

/**
 * Create a new server adapter
 */
const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath("/admin/queues");
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullMQAdapter(queue)],
  serverAdapter: serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

app.listen(3000, () => {
  console.log("Running on 3000....");
  console.log("For the UI, open http://localhost:3000/admin/queues");
  console.log("Make sure Redis is running on port 6379 by default");
});
