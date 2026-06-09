


import { emailHandlers } from "./handlers/email.handlers.js";


export const processEmailJob = async (job) => {
  const handler = emailHandlers[job.name];

  if (!handler) {
    console.log(`no handler found for : ${job.name}`);
    return;
  }

  return await handler(job);
};