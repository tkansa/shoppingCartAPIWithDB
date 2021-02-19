const express = require('express');
//const cors = require("cors");
const shoppingCart = require("./shoppingCart-routes");

const app = express();

app.use(express.json());



app.listen(3000, console.log("listening on port 3000"));

app.use("/cart-items", shoppingCart);