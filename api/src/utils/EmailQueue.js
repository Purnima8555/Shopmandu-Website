
import { Queue } from "bullmq";
import IORedis from "ioredis";
import crypto from "crypto"
// import { encrypt } from "./encryptDecrypt.util.js";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});


const emailQueue = new Queue("email-queue", {
  connection
});


async function addEmailJob(to, subject, body) {
  const job = await emailQueue.add('send-email', {
    to,
    subject,
    body
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    removeOnComplete: 2000,
    removeOnFail: 5000,
  });

  // console.log(`Mail Job added to queue with ID: ${job.id}`);
}


export async function addResetPasswordEmailJob(to, uId, token) {
  const job = await emailQueue.add(
    "reset-password-email",
    {
      to,
      userId: uId,
      // token: token
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000
      },
      jobId: `reset-password-${to}-${Math.floor(Date.now() / 60000)}`, // prevents duplicates
      removeOnComplete: 2000,
      removeOnFail: 5000,
    }
  );
  return job;
}

/// add email job
export async function orderNotification(jobs) {
  await emailQueue.addBulk(jobs)
}

export async function scheduleCodOrderConfirmation(orderId) {
  await emailQueue.add(
    "cod-order-confirmation",
    {
      orderId,
    },
    {
      delay: 10000, // 10 seconds
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      jobId: `confirm_cod_order-${orderId}`,
    }
  );
}

export async function scheduleUnpaidOrderCancellation(orderId) {
  await emailQueue.add(
    "cancel-unpaid-order",
    {
      orderId,
    },
    {
      delay: 10 * 60 * 1000,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      jobId: `cancel-unpaid-order-${orderId}`,
    }
  );
}


/// order confermation

export async function orderConfermationNotifaction(order) {

  let totalItems = order.items.length
  await emailQueue.add(
    "order-confirmation-notifaction",

    {
      email: order.customerId.email,
      orderNumber: order.orderNumber,
      customerName: order.customerId.userName,
      totalItems,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress?.toObject?.() || order.shippingAddress
    },
    {
      delay: 1000,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      jobId: `order-confirmation-email-${order._id}`
    }
  )
}

/// remove job when online payment succesfull

export async function removeOrderCancellationJob(orderId) {
  const jobId = `cancel-unpaid-order-${orderId}`;

  const job = await emailQueue.getJob(jobId);
  if (!job) {
    return false;
  }
  await job.remove();
  return true;
}

export async function welcomeEmailNotification(user) {
  await emailQueue.add(
    "welcome-email",
    {
      userName: user.userName,
      email: user.email,
      appUrl: "http://localhost:5173",
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: 2000,
      removeOnFail: 5000,
    },
  );
}

// const counts = await emailQueue.getJobCounts();
// console.log(counts);



export default addEmailJob;
