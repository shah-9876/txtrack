// Required modules
require("dotenv").config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');


const app = express();
app.use(cors());

// Middleware
app.use(express.json());

// Blockstream API base URL
const blockstreamApiUrl = process.env.URL;

// API endpoint to get block details by block hash
app.get('/block/:blockHash', async (req, res) => {
  const blockHash = req.params.blockHash;
  try {
    const response = await axios.get(`${blockstreamApiUrl}/block/${blockHash}`);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching block' });
  }
});

// API endpoint to get transaction details by transaction id
app.get('/transaction/:txid', async (req, res) => {
  const txid = req.params.txid;
  try {
    const response = await axios.get(`${blockstreamApiUrl}/tx/${txid}`);
    const { txid: id, version, locktime, size, weight, fee, status } = response.data;
    res.json({ txid: id, version, locktime, size, weight, fee, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching transaction' });
  }
});

// API endpoint to get address details
app.get('/address/:address', async (req, res) => {
  const address = req.params.address;
  try {
    const response = await axios.get(`${blockstreamApiUrl}/address/${address}`);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching address information' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
