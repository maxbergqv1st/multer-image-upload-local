import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const app = express()
const postersDir = path.join(process.cwd(), 'storage', 'posters')
fs.mkdirSync(postersDir, { recursive: true })

// Allow frontend on Vite dev server to read API responses.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }

  next()
})

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, postersDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-')
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${base}-${unique}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Endast bildfiler tillåts'))
  },
})

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    ok: true,
    filename: req.file?.filename,
    path: req.file?.path,
  })
})

app.listen(3001, () => console.log('API running on http://localhost:3001'))
