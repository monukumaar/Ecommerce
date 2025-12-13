const mongoose = require("mongoose");
const error = require("../../../mernProjectEcommerce/backend/middleware/error");
const connectDatabase = () => {
  mongoose.connect(process.env.DB_URI).then((data) => {
    console.log(" Mongodb Connected");
  })
}
module.exports = connectDatabase;
