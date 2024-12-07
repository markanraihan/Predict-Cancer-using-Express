const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 9000;

// Multer untuk menangani file upload
const upload = multer({
  limits: { fileSize: 1000000 }, // Batas ukuran 1MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

// Endpoint /predict
app.post("/predict", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        status: "fail",
        message: "No file uploaded or unsupported file format",
      });
    }

    // Simulasi prediksi model ML
    const isCancer = Math.random() > 0.5; // Dummy prediction logic
    const predictionResult = isCancer ? "Cancer" : "Non-cancer";
    const suggestion = isCancer
      ? "Segera periksa ke dokter!"
      : "Penyakit kanker tidak terdeteksi.";

    return res.status(200).json({
      status: "success",
      message: "Model is predicted successfully",
      data: {
        id: uuidv4(),
        result: predictionResult,
        suggestion: suggestion,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error.message === "File too large") {
      return res.status(413).json({
        status: "fail",
        message: "Payload content length greater than maximum allowed: 1000000",
      });
    }
    return res.status(400).json({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
  }
});

// Error handler untuk multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(413).json({
      status: "fail",
      message: "Payload content length greater than maximum allowed: 1000000",
    });
  }
  next(err);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
