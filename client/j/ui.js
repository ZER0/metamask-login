import { when } from "./animation.js";

async function pulsing() {
  this.classList.add("pulse");

  await when(this).ends("button-pulse");

  this.classList.remove("pulse");
}

export const button = document.querySelector("button");
export const label = document.querySelector("section label");
export const checkbox = document.querySelector("input[type=checkbox]");
export const address = document.querySelector("address");

checkbox.checked = false;

button.addEventListener("click", pulsing);

async function hideMessage() {
  label.classList.remove("fade-up-out", "fade-up-in");
  label.classList.add("fade-up-out");

  return await when(label).ends("fade-up-out");
}

async function showMessage() {
  label.classList.add("fade-up-in");

  await when(label).starts("fade-up-in");
}

export async function setMessage(text) {
  await hideMessage();

  label.parentNode.classList.remove("waiting");

  await showMessage();

  label.innerText = text;
}

export async function setWaiting(text) {
  await hideMessage().then(showMessage);

  label.parentNode.classList.add("waiting");
  label.innerText = text;
}
