const amqplib = require("amqplib");
const amqp_url = process.env.RABBITMQ_URL;

const postVideo = async ({ msg }) => {
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

    //4. publish video
    await channel.publish(exchangeName, "", Buffer.from(msg));

    console.log("[x]Send OK:::", msg);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 2000);
  } catch (e) {
    console.error("Error in postVideo:", e);
  }
};

const msg = process.argv.slice(2).join(" ") || "Hello, Exchange!";
postVideo({ msg });
