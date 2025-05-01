const express = require("express");
const cors = require("cors");
require("dotenv").config();

const corsOptions = {
  origin: [process.env.frontend_url, "localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
};

const app = express();
const port = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.json());

app.use("/store", require("./src/routes/store.route"));
app.use("/user", require("./src/routes/user.route"));
app.use("/item", require("./src/routes/item.route"));
app.use("/transaction", require("./src/routes/transaction.route"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
