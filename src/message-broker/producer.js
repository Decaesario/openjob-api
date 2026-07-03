import amqp from 'amqplib';

const ProducerService = {
    sendMessage: async (queue, message) => {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
            const channel = await connection.createChannel();

            await channel.assertQueue(queue, { durable: true });
            channel.sendToQueue(queue, Buffer.from(message));

            setTimeout(() => {
                connection.close();
            }, 1000);
        } catch (err) {
            console.error('RabbitMQ error:', err.message);
        }
    },
};

export default ProducerService;