const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env'});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('Database connected');
    } catch (error) {
        console.log(error),
        process.exit(1); // Detener aplicación
    }
}

module.exports = connectDB;