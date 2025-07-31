const amqplib = require("amqplib");
const amqp_url = process.env.RABBITMQ_URL || "amqp://localhost";

const receiveEmail = async () => {
  try {
    const connection = await amqplib.connect(amqp_url);
    const channel = await connection.createChannel();

    const exchangeName = "email_topic";
    await channel.assertExchange(exchangeName, "topic", { durable: true });

    const { queue } = await channel.assertQueue("", { exclusive: true });
    console.log(`Queue created: ${queue}`);

    const args = process.argv.slice(2);
    if (args.length === 0) {
      console.log("Usage: node receiveEmail.js <routing_key> [more_keys...]");
      process.exit(1);
    }

    for (const key of args) {
      await channel.bindQueue(queue, exchangeName, key);
      console.log(`✅ Bound queue ${queue} to topic '${key}'`);
    }

    console.log("⏳ Waiting for messages...");
    await channel.consume(
      queue,
      (msg) => {
        console.log(
          `📩 Routing key: ${
            msg.fields.routingKey
          }, Msg: ${msg.content.toString()}`
        );
      },
      { noAck: true }
    );
  } catch (e) {
    console.error("Error in receiveEmail:", e);
  }
};

receiveEmail();
