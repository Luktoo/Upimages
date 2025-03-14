const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Create uploads directory if missing
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

const upload = multer({ storage });

// Middleware
app.use(express.static(__dirname)); // Serve frontend files
app.use('/uploads', express.static(uploadDir)); // Serve uploaded images

// Upload endpoint
// Stats endpoint
app.get('/stats', (req, res) => {
  res.json({
    visits: visitCount,
    uploads: uploadCount
  });
});

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const shareUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  res.json({
    url: shareUrl,
    filename: req.file.filename
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});