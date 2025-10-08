const mongoose = require('mongoose');

//connect db
const connectDB = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((connect) => {
      console.log(`Database Connected : ${connect.connection.host}`);
    })
};
module.exports = connectDB;
