const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
            .then((db) => {
                console.log("\x1b[36m%s\x1b[0m", `MongoDB connected: ${db.connection.host}`);
            });
    } catch (err) {
        console.log("MongoDB connection unsuccessful");
        console.error(err);
        process.exit(1);
    }
}

module.exports = { connectDB };