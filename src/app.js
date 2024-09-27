const express = require('express');
const http = require('http');
// Import Server from 'socket.io';
const { Server } = require("socket.io");
const cors = require('cors');
const { connectToDatabase } = require("../config/database");
const port = 3000;
const app = express();
const server = http.createServer(app);
const routes = require("./routes");
const { generateContent } = require('./listeners/Ai.listener');

// make a new instance of Server and pass in the http server instance 
// And also CORS options
(async () => {
    connectToDatabase()
    const allowedOrigins = "*";
    const corsOptionsAll = {
        optionsSuccessStatus: 202,
        origin: allowedOrigins,
        credentials: true,
    };
    const io = new Server(server, {
        cors: {
            origin: "*",
            // methods: ["GET", "POST"]
        }
    });



    app.use(express.json());
    app.use(cors(corsOptionsAll));
    // When a client establishes a connection with the server, 
    // this event listener will be triggered.
    io.on('connection', (socket) => {
        // Listen for 'message_send' events from the client. When the client sends a message,
        // the server receives it and logs the message data to the console.
        socket.on('message_send', (data) => {
            console.log(data); // Output the received message data.


            // This will notify everyone about the new message.
            io.emit('message_receive', data);
        });

        socket.on('generate_content', async (data) => {
            console.log("🚀 ~ socket.on ~ data:", data)
            try {
                await generateContent(socket, data);
            } catch (error) {
                socket.emit('error', { message: 'Failed to generate content' });
            }
        });
        // Listen for the 'disconnect' event which triggers when a client disconnects.
        // Log a message indicating that a user has disconnected from the server.
        socket.on('disconnect', () => {
            console.log('🔥: A user disconnected'); // Notify the server of the disconnection.
        });
    });

    app.use("/api", routes);

    app.use((req, res) => {
        return res.status(404).send({ error: "Route not found" });
    });
    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
})();