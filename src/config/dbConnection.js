const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/reactOAuthDemoDB")
            .then((db) => {
                console.log("\x1b[36m%s\x1b[0m", `MongoDB connected: ${db.connection.host}`);
            });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = { connectDB };