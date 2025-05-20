const express = require('express')
const jwt = require('jsonwebtoken')
const { createClient } = require('@supabase/supabase-js')
const sendEmail = require('../utils/sendEmail')

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

const otps = {} // In-memory OTP storage (email -> { otp, attempts, expiresAt })

// Send OTP
router.post('/send-otp', async (req, res) => {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000) // 5 minutes later
  
    // Insert session record
    const { error } = await supabase.from('sessions').insert({
      email,
      otp_code: otp,
      created_at: now.toISOString(),
      expiration_time: expiresAt.toISOString(),
      status: 'pending'
    })
  
    if (error) {
        console.error("Supabase insert error:", error)
        return res.status(500).json({ error: 'Error storing OTP' })
      }
  
    await sendEmail(email, otp)
  
    res.json({ message: 'OTP sent successfully' })
  })  

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body
  
    const { data: sessionData, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('email', email)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
  
    if (error || !sessionData || sessionData.length === 0)
      return res.status(400).json({ error: 'No active OTP found' })
  
    const session = sessionData[0]
  
    if (session.expiration_time < new Date().toISOString()) {
      // Expired
      await supabase
        .from('sessions')
        .update({ status: 'expired' })
        .eq('id', session.id)
      return res.status(410).json({ error: 'OTP expired' })
    }
  
    if (session.otp_code !== otp) {
      return res.status(401).json({ error: 'Incorrect OTP' })
    }
  
    // Mark OTP as verified
    await supabase
      .from('sessions')
      .update({ status: 'verified' })
      .eq('id', session.id)
  
    // Upsert profile (create if not exists)
    await supabase
      .from('profiles')
      .upsert({
        email,
        last_login: new Date().toISOString()
      }, { onConflict: ['email'] })
  
    // Create JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.json({ token })
  })

// Authenticated route
router.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Missing token' })

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.json({ email: decoded.email })
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' })
  }
})

module.exports = router
