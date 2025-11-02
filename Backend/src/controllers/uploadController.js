const { supabase } = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Single file upload middleware
exports.upload = upload.single('image');

// Handle image upload
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // In a real application, you would upload to a cloud storage service like AWS S3, Cloudinary, etc.
    // For now, we'll return the local file path or upload to Supabase Storage
    
    // Option 1: Return local file URL (for development)
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    // Option 2: Upload to Supabase Storage (recommended for production)
    // Uncomment the following code to use Supabase Storage:
    /*
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileName = req.file.filename;
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      // Clean up local file
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ error: error.message });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);
    
    const fileUrl = urlData.publicUrl;
    
    // Clean up local file after upload
    fs.unlinkSync(req.file.path);
    */

    res.json({
      message: 'Image uploaded successfully',
      imageUrl: fileUrl,
      url: fileUrl, // Alternative key for compatibility
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: error.message || 'Failed to upload image' });
  }
};

