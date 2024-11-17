var express = require('express');
var router = express.Router();
const axios = require("axios");
const User = require("../models/User");
const ensureAuthenticated = require("../middlewares/authMiddleware");

/* GET home page. */
router.get('/',ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/api/vehicle", async (req, res) => {
  const { regNumber } = req.body;

  try {
    const apiUrl = process.env.BackendUrl+`${regNumber}`;
    const response = await axios.get(apiUrl, {
      headers: {
        "Host": process.env.Host,
        "Token": process.env.Token,
        "Origin": process.env.Origin,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch vehicle details" });
  }
});

// Start the server
module.exports = router;
