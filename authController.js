const jwt = require("jsonwebtoken");
const db = require("../config/db/db");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utils/token");
const { generateAuthorizeToken } = require("../utils/token");

const loginStudent = async (req, res) => {
  try {
    const { email, password, phone,type } = req.body;

    if (type == "email") {
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "email and password are required" });
      }
    } else if (type == "mobile") {
      if (!phone || !password) {
        return res
          .status(400)
          .json({ message: "phone and password are required" });
      }
    }
    let isValiadCredentials = [];
    if (email) {
      const query = `SELECT * from userlogin WHERE email =? and password= ?`;
      let [rows] = await db.query(query, [email, password]);
      isValiadCredentials = rows;
    } else if (phone) {
      const query = `SELECT * from userlogin WHERE phone =? and password= ?`;
      let [rows] = await db.query(query, [phone, password]);
      isValiadCredentials = rows;
    }

    if (isValiadCredentials.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const student = isValiadCredentials;

    const accessToken = generateAccessToken(student[0]);
    // const refreshToken = generateRefreshToken(student);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      // refreshToken,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
  
};

const handleRefreshToken = (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "token required" });

    jwt.verify(token, REFRESH_SECRET, (err, student) => {
      if (err) return res.status(403).json({ message: "Invalid Token" });

      const newAccessToken = generateAccessToken(student);
      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Refresh Error", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { loginStudent, handleRefreshToken, generateAuthorizeToken };

//student table- > record
//

//teacher table- > record

//userLogin -> Login API for common entities
// userLoginId userMasterId email phone password role
// 1              10                              student
// 2               13
