const ethUtil = require("ethereumjs-util");

// Returns the message string to be signed by the wallet
module.exports.message = (nonce) => `
Sign this message to prove you have access to this wallet, and we'll log you in.

To prevent hackers using your wallet, here's a unique nonce they can't guess:

${nonce}
`;

// Validate the signature of the message
module.exports.validate = (wallet_address, signature, msg) => {
  // Convert msg to hex string
  const msgHex = ethUtil.bufferToHex(Buffer.from(msg));

  // Check if signature is valid
  const msgBuffer = ethUtil.toBuffer(msgHex);
  const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
  const signatureBuffer = ethUtil.toBuffer(signature);
  const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
  const publicKey = ethUtil.ecrecover(
    msgHash,
    signatureParams.v,
    signatureParams.r,
    signatureParams.s
  );
  const addresBuffer = ethUtil.publicToAddress(publicKey);
  const address = ethUtil.bufferToHex(addresBuffer);

  console.log({ wallet_address, address });
  return wallet_address === address;
};
