const amqplib = require("amqplib");
const amqp_url = process.env.RABBITMQ_URL;

const receiveNoti = async ({ msg }) => {
  try {
    // 1.Create connection
    const connection = await amqplib.connect(amqp_url);
    //2. Create channel
    const channel = await connection.createChannel();
    //3. Create exchange
    const exchangeName = "video";

    await channel.assertExchange(exchangeName, "fanout", {
      durable: true,
    });

    //4. create queue
    const { queue } = await channel.assertQueue("");
    console.log(`name queue::: ${queue}`);

    //5. Binding
    await channel.bindQueue(queue, exchangeName, "");

    await channel.consume(
      queue,
      (msg) => {
        console.log("Received message:", msg.content.toString());
      },
      {
        noAck: true,
      }
    );
  } catch (e) {
    console.error("Error in receiveNoti:", e);
  }
};

const msg = process.argv.slice(2).join(" ") || "Hello, Exchange!";
postVideo({ msg });
