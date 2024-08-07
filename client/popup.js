const URL = "https://txtrack-server.vercel.app/"
function navigateTo(page) {
  document.querySelectorAll(".page").forEach((div) => {
    div.classList.remove("active");
  });
  document.getElementById(page).classList.add("active");
}

function convertUnixToGMT7(unixTimestamp) {
  // Create a new Date object using the Unix timestamp (in milliseconds)
  const date = new Date(unixTimestamp * 1000);

  // Define the offset for GMT-7 in hours
  const offsetGMT7 = -7;

  // Get the UTC hours and adjust it to GMT-7
  const hours = date.getUTCHours() + offsetGMT7;

  // Set the new hours to the date object
  date.setUTCHours(hours);

  // Format the date as a string
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-11
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hoursFormatted = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hoursFormatted}:${minutes}:${seconds} GMT-7`;
}

function bytesToKilobytes(bytes) {
  const kilobytes = bytes / 1000;
  return kilobytes;
}

function wToKiloKWU(weight) {
  const KWU = weight / 1000;
  return KWU;
}

function decimalToHex(decimal) {
  return "0x" + decimal.toString(16).toUpperCase();
}

const decimal = 536870916;
const hex = decimalToHex(decimal);
console.log(`${decimal} in decimal is equal to ${hex} in hexadecimal`);

async function fetchBlock() {
  const blockHash = document.getElementById("blockHash").value;
  const loader = document.getElementById("loaderBlock");
  loader.style.display = "block";
  try {
    const response = await fetch(`${URL}/block/${blockHash}`);
    loader.style.display = "none";
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    const stamp = data.timestamp;
    const gmt7Date = convertUnixToGMT7(stamp);
    const wt = wToKiloKWU(data.weight);
    const kilobytes = bytesToKilobytes(data.size);
    const hexBits = decimalToHex(data.bits);
    const hexVersion = decimalToHex(data.version);
    const hexNonce = decimalToHex(data.nonce);

    document.getElementById("result1").innerHTML = `
      <p><strong>Block Height:</strong> ${data.height}</p>
      <p><strong>Timestamp:</strong> ${gmt7Date}</p>
      <p><strong>Transaction Count:</strong> ${data.tx_count}</p>
      <p><strong>Weight:</strong> ${wt} KWU</p>
      <p><strong>Size:</strong> ${kilobytes} KB</p>
      <p><strong>Previous Block Hash:</strong> ${data.previousblockhash}</p>
      <p><strong>Bits:</strong> ${hexBits}</p>
      <p><strong>Difficulty:</strong> ${data.difficulty}</p>
      <p><strong>Version:</strong> ${hexVersion}</p>
      <p><strong>Nonce:</strong> ${hexNonce}</p>
    `;
  } catch (error) {
    loader.style.display = "none";
    document.getElementById("result1").innerHTML = `Error: ${error.message}`;
  }
}

async function fetchTransaction() {
  const txid = document.getElementById("txid").value;
  const loader = document.getElementById("loaderTransaction");
  const resultDiv = document.getElementById("transactionResult");
  resultDiv.innerHTML = "";
  loader.style.display = "block";
  try {
    const response = await fetch(`${URL}/transaction/${txid}`);
    loader.style.display = "none";
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    resultDiv.innerHTML = `
    <p><strong>Version:</strong> ${data.version}</p>
    <p><strong>Locktime:</strong> ${data.locktime}</p>
    <p><strong>Size:</strong> ${data.size} B</p>
    <p><strong>Weight:</strong> ${data.weight} WU</p>
    <p><strong>Fee:</strong> ${data.fee} sat</p>
    <p><strong>Status:</strong> ${
      data.status.confirmed ? "Confirmed" : "Unconfirmed"
    }</p>
    <p><strong>Block Height:</strong> ${data.status.block_height}</p>
    <p><strong>Block Hash:</strong> ${data.status.block_hash}</p>
    <p><strong>Block Time:</strong> ${new Date(
      data.status.block_time * 1000
    ).toLocaleString()}</p>
  `;
  } catch (error) {
    loader.style.display = "none";
    resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

async function fetchAddress() {
  const address = document.getElementById("addressInput").value;
  const loader = document.getElementById("loaderAddress");
  const resultDiv = document.getElementById("addressResult");
  resultDiv.innerHTML = "";
  loader.style.display = "block";
  try {
    const response = await fetch(`${URL}/address/${address}`);
    loader.style.display = "none";
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    resultDiv.innerHTML = `
    <p><strong>Address:</strong> ${data.address}</p>
    <p><strong>Chain Stats:</strong></p>
    <p><strong>Funded TXO Count:</strong> ${data.chain_stats.funded_txo_count}</p>
    <p><strong>Funded TXO Sum:</strong> ${data.chain_stats.funded_txo_sum}</p>
    <p><strong>Spent TXO Count:</strong> ${data.chain_stats.spent_txo_count}</p>
    <p><strong>Spent TXO Sum:</strong> ${data.chain_stats.spent_txo_sum}</p>
    <p><strong>TX Count:</strong> ${data.chain_stats.tx_count}</p>
    <p><strong>Mempool Stats:</strong></p>
    <p><strong>Funded TXO Count:</strong> ${data.mempool_stats.funded_txo_count}</p>
    <p><strong>Funded TXO Sum:</strong> ${data.mempool_stats.funded_txo_sum}</p>
    <p><strong>Spent TXO Count:</strong> ${data.mempool_stats.spent_txo_count}</p>
    <p><strong>Spent TXO Sum:</strong> ${data.mempool_stats.spent_txo_sum}</p>
    <p><strong>TX Count:</strong> ${data.mempool_stats.tx_count}</p>
  `;
  } catch (error) {
    loader.style.display = "none";
    resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("button[data-nav]").forEach((button) => {
    button.addEventListener("click", () =>
      navigateTo(button.getAttribute("data-nav"))
    );
  });

  document
    .getElementById("fetchBlockButton")
    .addEventListener("click", fetchBlock);
  document
    .getElementById("fetchTransactionButton")
    .addEventListener("click", fetchTransaction);
  document
    .getElementById("fetchAddressButton")
    .addEventListener("click", fetchAddress);

  document
    .getElementById("backToHomeBlock")
    .addEventListener("click", () => navigateTo("home"));
  document
    .getElementById("backToHomeTransaction")
    .addEventListener("click", () => navigateTo("home"));
  document
    .getElementById("backToHomeAddress")
    .addEventListener("click", () => navigateTo("home"));
});
