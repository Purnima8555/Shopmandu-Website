import { createClient } from "redis";

const client = createClient({
    url: "redis://localhost:6379",  /// "redis://localhost:6379"
    socket: {
        keepAlive: 5000,
        reconnectStrategy: retries =>
            Math.min(retries * 100, 3000)
    }
});

client.on("connect", () => {
    console.log("Redis connecting...");
});

client.on("ready", () => {
    console.log("Redis Ready");
});

client.on("reconnecting", () => {
    console.log("Redis Reconnecting...");
});

client.on("end", () => {
    console.log("Redis Connection Ended");
});

client.on("error", (err) => {
    console.error("\nRedis Error");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error(" End Redis Error\n");
});

export async function connectRedis() {
    if (!client.isOpen) {
        await client.connect();
    }

    return client;
}

// process.on("SIGINT", async () => {
//     await client.quit();
//     process.exit(0);
// });

// process.on("SIGTERM", async () => {
//     await client.quit();
//     process.exit(0);
// });

export default client;