const express = require("express");
const db = require("./db");
const { message, validate } = require("./auth");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./client"));

// This route returns the message to be signed by the wallet, so that the user
// can prove the address is providing belongs to him.
//
// It's mandatory the message contains a nonce.
//
// If a nonce exists already in the DB for the wallet address given, it's used
// in the message, otherwise it generate a new one and store it in the DB.
app.get("/users/:wallet_address/message", async (req, res) => {
  let { wallet_address } = req.params;

  let nonce = await db
    .getNonceForUser(wallet_address)
    .catch((_err) => db.generateNonceForUser(wallet_address));

  res.send({ message: message(nonce) });
});

// This route authenticate the user by checking if the signature for the given
// address is valid.
app.post("/users/:wallet_address/signature", async (req, res) => {
  let { wallet_address } = req.params;
  let nonce = await db.getNonceForUser(wallet_address).catch(() => null);

  if (!nonce) {
    res.send("Wallet does not exists");
    return;
  }

  let isValid = validate(wallet_address, req.body.signature, message(nonce));

  if (isValid) {
    // Update the user nonce
    await db.generateNonceForUser(wallet_address);

    // Here we should create the session for the user, e.g. we could send back
    // a JSON Web Token

    res.status(200).json({
      success: true,
      msg: "You are now logged in.",
    });
  } else {
    // User is not authenticated
    res.status(401).send("Invalid credentials");
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
