require('dotenv').config();
const express = require('express')
const app = express();
const authRoutes = require('./routes/auth')
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json())
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
