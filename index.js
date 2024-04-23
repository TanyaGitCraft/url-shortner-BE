// const express = require("express");
// const mongoose = require("mongoose");
// require("dotenv").config();
// // const { connectToMongoDB } = require("./connect");
// const urlRoute = require("./routes/url");
// const URL = require("./models/url");
// const cors = require("cors"); // Import the cors middleware

// const MONGO_URI = require("./config");
// const app = express();
// const url = process.env.MONGO_URI;

// mongoose
//   .connect("mongodb+srv://Tanya:HXj0jueYvjLQjbrw@cluster0.vorcgtb.mongodb.net/Sortner?retryWrites=true&w=majority", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("MongoDB connected!");

//   })
//   .catch((err) => console.log(err));

// app.use(cors()); // Enable CORS for all routes
// app.use(express.json());

// app.use("/url", urlRoute);
// app.get("/:shortId", async (req, res) => {
//   try {
//     // Your existing code for URL redirection
//     const shortId = req.params.shortId;
//     const entry = await URL.findOneAndUpdate(
//       {
//         shortId,
//       },
//       {
//         $push: {
//           visitHistory: {
//             timestamp: Date.now(),
//           },
//         },
//       }
//     );

//     if (!entry) {
//       return res.status(404).send("URL not found");
//     }

//     // Set CORS headers explicitly
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//       "Access-Control-Allow-Methods",
//       "GET, PUT, POST, DELETE, OPTIONS"
//     );
//     res.header("Access-Control-Allow-Headers", "Content-Type");

//     res.redirect(entry.redirectURL);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// const PORT = 8001;
// app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_51OcjKcSDTxn5PnSnU1ezUusZdLs7d97SZsEGRxjUw7yPoxM2r7XAwuGsTJXbIEr7rsJF0u1sl1BYAquJM1Y3FmHy00hbeyjlna');

const cors = require("cors"); // Import the cors middleware
app.use(cors()); // Enable CORS for all routes

app.post('/create-checkout-session', async (req, res) => {
  /**
   * NOTE: We could also accept planid. On the basis of plan id at BE we could get the payment details i.e price, plan name, plan currency.
   * Before accepting payment we should also need to check in out Database that if plan is already active for the specific user.
   * If user already have a plan the return the response or error with message Plan already exists to this user id.
   * Otherwise redirect to checkout page and then follow the desired business logics.
   * */ 
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
            
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:4200/success',
    cancel_url: 'http://localhost:4200/cancel',
  });

  res.json({ id: session.id });
});

app.listen(4242, () => console.log(`Listening on port ${4242}!`));