import express from "express";
import { Job, Queue, Worker } from "bullmq";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t * 1000));

const app = express();

const redisConnectionOption = {
  port: 6379,
  host: 'localhost',
};


async function setupBullMqProcesor(name: string) {
  new Worker(name, async function(job: Job) {
    for (let i = 0; i <= 100; i++) {
      await sleep(Math.random());
      await job.updateProgress(i);
      await job.log(`Processing job at interval ${i}`);

      if (Math.random() * 200 < 1) throw new Error(`Random error ${i}`);
    }

    return { jobId: `This is the return value of job (${job.id})`};
  }, {
    connection:redisConnectionOption
  })
}


async function run() {
  /**
   *
   */
  const firstQueue = new Queue("FirstQueue", {connection:redisConnectionOption});
  const secondQueue = new Queue("SecondQueue", {connection:redisConnectionOption});

  await setupBullMqProcesor(firstQueue.name);
  await setupBullMqProcesor(secondQueue.name);

  
  /**
   * Create a new server adapter
   */
  const firstServerAdapter = new ExpressAdapter();
  const secondServerAdapter = new ExpressAdapter();

  firstServerAdapter.setBasePath("/instance/1");
  secondServerAdapter.setBasePath("/instance/2");

  createBullBoard({
    queues: [new BullMQAdapter(firstQueue)],
    serverAdapter: firstServerAdapter,
  });

  createBullBoard({
    queues: [new BullMQAdapter(secondQueue)],
    serverAdapter: secondServerAdapter,
  });

  app.use("/instance/1", firstServerAdapter.getRouter());
  app.use("/instance/2", secondServerAdapter.getRouter());

  app.use('/add', (req, res) => {
    const opts: any = req.query.opts || {};

    if (opts.delay) {
      opts.delay = +opts.delay * 1000; // delay must be a number
    }

    firstQueue.add('Add instance 1', { title: req.query.title }, opts);
    secondQueue.add('Add instance 2', { title: req.query.title }, opts);

    res.json({
      ok: true,
    });
  });

  app.listen(3000, () => {
    console.log("Running on 3000....");
    console.log('For the UI of instance1, open http://localhost:3000/instance/1');
    console.log('For the UI of instance2, open http://localhost:3000/instance/2');
    console.log('Make sure Redis is running on port 6379 by default');
    console.log('To populate the queue, run:');
    console.log('  curl http://localhost:3000/add?title=Example');
    console.log('To populate the queue with custom options (opts), run:');
    console.log('  curl http://localhost:3000/add?title=Test&opts[delay]=9');
  });
}

run().catch((e)=> console.log(e));
