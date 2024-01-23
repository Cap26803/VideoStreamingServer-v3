const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const crypto = require('crypto');
const Grid = require('gridfs-stream');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace 'your_mongodb_uri' with your MongoDB Atlas URI
const mongoURI = 'mongodb+srv://chinmay:chinmay@cluster0.nkd0mnu.mongodb.net/VideoStream';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

const conn = mongoose.connection;

// Initialize GridFS
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine using GridFS
const storage = multer.memoryStorage();

const upload = multer({ storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: false,
}));

app.use(express.static('public'));

// Video upload route
app.post('/upload', upload.single('video'), (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: 'No file provided' });
  }

  const { originalname, buffer } = file;

  const writeStream = gfs.createWriteStream({
    filename: crypto.randomBytes(16).toString('hex') + path.extname(originalname),
    bucketName: 'uploads',
  });

  writeStream.write(buffer);
  writeStream.end();

  writeStream.on('close', () => {
    res.status(200).json({ message: 'Video uploaded successfully' });
  });
});

// Serve HTML files based on the route
app.get('/:page', (req, res) => {
  const page = req.params.page;
  const absolutePathToHtml = path.resolve(`${page}.html`);

  res.sendFile(absolutePathToHtml, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      if (err.status === 404) {
        res.status(404).send('File Not Found');
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/index`);
});
