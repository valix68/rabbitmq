
const amqplib = require("amqplib");
const amqp_url = process.env.RABBITMQ_URL;

const receiveQueue = async ({ msg }) => {
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
    //5. receive message to queue
    await channel.consume(
      queueName,
      (msg) => {
        console.log("Received message:", msg.content.toString());
        //   channel.ack(msg);
      },
      {
        noAck: true,
      }
    );

    //6 Close channel and connection
  } catch (e) {
    console.error("Error in receiveQueue:", e);
  }
};

receiveQueue({ msg: "Hello, World!" });
