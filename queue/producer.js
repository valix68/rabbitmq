const amqplib = require("amqplib");
const amqp_url = process.env.RABBITMQ_URL;

const sendQueue = async ({ msg }) => {
  try {
    // 1.Create connection
    const connection = await amqplib.connect(amqp_url);
    //2. Create channel
    const channel = await connection.createChannel();
    //3. Create name queue
    const queueName = "q1";
    //4. Create queue
    await channel.assertQueue(queueName, {
      durable: true,
    });
    //5. Send message to queue
    await channel.sendToQueue(queueName, Buffer.from(msg), {
      // expiration: "10000", // Message expiration time in milliseconds
      persistent: true, // Ensure message is saved to disk
    });

    //6 Close channel and connection
  } catch (e) {
    console.error("Error in sendQueue:", e);
  }
};

const msg = process.argv.slice(2).join(" ") || "Hello, World!";

sendQueue({ msg });
