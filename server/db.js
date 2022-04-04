// This module is faking the database methods needed for the login.
// It stores the nonce in a file with the same name of the wallet.
//
// For each user, identified by a wallet address, we need to store a nonce.
// (Number used Once), even before it's actually verified.
// Therefore, it would be probably wise to have a session also for such kind
// of users, and purge the database from the users that didn't go through the
// registration once the session is expired.

const crypto = require("crypto");

const {
  promises: { readFile, writeFile },
} = require("fs");

const generateNonce = () => crypto.randomUUID();

module.exports.getNonceForUser = async (wallet_address) =>
  await readFile("./server/wallets/" + wallet_address).then((value) =>
    value.toString()
  );

module.exports.generateNonceForUser = async (wallet_address) => {
  let nonce = generateNonce();

  return await writeFile("./server/wallets/" + wallet_address, nonce)
    .then((_value) => nonce)
    .catch((_err) => null);
};
