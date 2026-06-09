

import { Worker } from "bullmq";
import IORedis from "ioredis";
import { processEmailJob } from "./email.processor.js";
import connectDB from "../config/dbConnect.js";

const connection = new IORedis({   //// connect to redis server.
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
});

connectDB();  //// connect to the mongoDB database.

export const emailWorker = new Worker(  /// create email worker
  "email-queue",
  async (job) => {
    return await processEmailJob(job);
  },
  {
    connection, 
    concurrency: 5,  //// worker take 5 job at a time
    // lockDuration: 10000,
  }
);

emailWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed successfully`)
});

emailWorker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed: ${err.message}`)
});