const amqplib = require("amqplib");
const amqp_url = process.env.RABBITMQ_URL || "amqp://localhost";

const sendEmail = async () => {
  try {
    const connection = await amqplib.connect(amqp_url);
    const channel = await connection.createChannel();

    const exchangeName = "email_topic";
    await channel.assertExchange(exchangeName, "topic", { durable: true });

    const args = process.argv.slice(2);
    if (args.length < 1) {
      console.log("Usage: node sendEmail.js <routing_key> [message]");
      process.exit(1);
    }

    const topic = args[0];
    const msg = args[1] || "Default message";

    channel.publish(exchangeName, topic, Buffer.from(msg));
    console.log(`✅ Sent: '${msg}' with topic '${topic}'`);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (e) {
    console.error("Error in sendEmail:", e);
  }
};

sendEmail();
