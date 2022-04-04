import {
  setMessage,
  setWaiting,
  button,
  label,
  address,
  checkbox,
} from "./ui.js";

const isMetaMaskInstalled = () => window.ethereum && window.ethereum.isMetaMask;
const goToMetamask = () => (window.location = "https://metamask.io/download/");

let accounts = [];
let account = "";

if (!isMetaMaskInstalled()) {
  //If it isn't installed we ask the user to click to install it
  button.addEventListener("click", goToMetamask);
} else {
  button.innerText = "Login";
  label.innerText = "Click to login with Metamask";
  button.addEventListener("click", login);

  accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });

  account = accounts[0];

  address.innerText = accounts[0];
  checkbox.parentNode.style.visibility = "visible";
  checkbox.addEventListener("change", toggleMockAddress);
}

function toggleMockAddress() {
  console.log(this);
  if (this.checked) {
    account = "0x0000000000000000000000000000000000000000";
  } else {
    account = accounts[0];
  }

  address.innerText = account;
}

async function login() {
  setWaiting("Logging in...");

  // Connect to metamask and get user accounts

  const responseNonce = await fetch(`/users/${account}/message`);
  const { message } = await responseNonce.json();
  console.log(message);
  // Sign message
  const signedMessage = await signMessage(accounts[0], message).catch((err) => {
    setMessage(err.message);
    return null;
  });

  if (!signedMessage) return;

  // Send signature to backend
  const responseSign = await fetch(`/users/${account}/signature`, {
    method: "POST",
    body: JSON.stringify({ signature: signedMessage }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  switch (responseSign.status) {
    case 200:
      let { success } = await responseSign.json();

      if (success) {
        setMessage("You are now logged in!");
      } else {
        setMessage("Something unexpected went wrong!");
      }
      break;
    case 401:
      setMessage("You are not authorized!");
      break;
  }
  // const { success } = await responseSign.json();
  console.log(responseSign.status, responseSign);
}

async function signMessage(address, msg) {
  let response = await ethereum.request({
    method: "personal_sign",
    params: [address, msg],
  });
  return response;
}
