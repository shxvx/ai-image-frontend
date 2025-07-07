require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;
const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;

app.use(cors());
app.use(express.json());

app.post('/generate-image', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });
  try {
    console.log("Sending prompt:", prompt);
    const response = await axios.post(
  "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
  { inputs: prompt },
  {
    headers: {
      Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
      Accept: "image/png"
    },
    responseType: 'arraybuffer'
  }
    );
    console.log("✅ Image received");
    const base64Image = Buffer.from(response.data).toString('base64');
    res.json({ success: true, imageUrl: `data:image/png;base64,${base64Image}` });
  } catch (err) {
    console.error("❌ Error:", err.response?.status, err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Image generation failed" });
  }
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
