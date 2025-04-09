const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/noithat');
        console.log("Connected to MongoDB Thành Công!!");
    } catch (error) {
        console.error("Connection to MongoDB failed:", error);
    }
}

module.exports = { connect };