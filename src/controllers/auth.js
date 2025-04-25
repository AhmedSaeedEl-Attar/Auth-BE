const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const register = async (req, res) => {
  const { username, email, password, isAdmin } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ username }).exec(); // exec() means execute the query

  if (foundUser) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with bcrypt

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    isAdmin: isAdmin || false, // Default to false if not provided
  });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: user._id,
      },
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign(
    {
      UserInfo: {
        id: user._id,
      },
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true, // Cannot be accessed by JavaScript
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "None", // CSRF protection and cross-site cookie
    secure: true, // Only send cookie over HTTPS
  });

  res.json({
    accessToken,
    id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};

const login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
          {
            UserInfo: {
              id: user._id,
            },
          },
          ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15m",
          }
        );

        const refreshToken = jwt.sign(
          {
            UserInfo: {
              id: user._id,
            },
          },
          REFRESH_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );

        res.cookie("jwt", refreshToken, {
          httpOnly: true, //accessible only by web server
          secure: true, //https
          sameSite: "None", //cross-site cookie
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
          accessToken,
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
};

const refreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403); // Forbidden

    const foundUser = await User.findById(decoded.UserInfo.id).exec();
    if (!foundUser) return res.sendStatus(401); // Unauthorized

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
        },
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  });
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
