const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 5000;

// Gemini Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are a Senior Flight Dispatcher and Aviation Data Analyst. 
    Your goal is to parse aviation charts, METAR boards, or cockpit displays with 100% accuracy.
    
    RULES:
    1. Output strictly in JSON format.
    2. If the image is blurry or unreadable, set translated_meaning to "VISUAL DATA INSUFFICIENT".
    3. Extract raw text, provide a pilot-friendly translated meaning, identify the airport (ICAO), and determine the flight category (VFR, IFR, MVFR, LIFR).
    4. Never hallucinate. If a value is unknown, use null.`
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 1. Callsign Decoder (OpenSky Network)
app.get('/api/decode/:callsign', async (req, res) => {
    try {
        const { callsign } = req.params;
        // Note: In a real app, we'd use OpenSky's REST API. 
        // For this demo, we'll provide enriched data.
        const response = await axios.get(`https://opensky-network.org/api/flights/all?begin=${Math.floor(Date.now() / 1000) - 3600}&end=${Math.floor(Date.now() / 1000)}`);

        // Filter for specific callsign if needed, or return mock-enhanced data for UX
        res.json({
            airline: "Delta Air Lines",
            aircraft: "Airbus A321-211",
            route: "KLAX -> KJFK",
            status: "EN ROUTE",
            altitude: "36,000 ft"
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch flight data" });
    }
});

// 2. Multimodal Chart Decoder (Gemini Vision)
app.post('/api/analyze-chart', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) return res.status(400).json({ error: "No image provided" });

        const result = await model.generateContent([
            "Analyze this aviation document and return the JSON object.",
            { inlineData: { data: imageBase64.split(',')[1], mimeType: "image/jpeg" } }
        ]);

        const response = await result.response;
        let text = response.text();

        // Basic JSON cleaning if Gemini adds markdown blocks
        text = text.replace(/```json|```/g, "").trim();

        res.json(JSON.parse(text));
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "AI Analysis Failed" });
    }
});

// 3. Live Weather Briefing (CheckWX API)
app.get('/api/weather/:icao', async (req, res) => {
    try {
        const { icao } = req.params;
        const response = await axios.get(`https://api.checkwx.com/metar/${icao}/decoded`, {
            headers: { 'X-API-Key': process.env.CHECKWX_API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Weather data unavailable" });
    }
});

app.listen(port, () => {
    console.log(`SkyLens Intelligence Server running on port ${port}`);
});
