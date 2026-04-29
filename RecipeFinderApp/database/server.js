const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const PORT = 3000;


// Middleware
app.use(cors());
app.use(express.json());

// Connect SQLite database
const db = new sqlite3.Database("./recipeFinder.db", (err) => {
  if (err) {
    console.log("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});
//RECIPE DATABASE
// Create recipes table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    password TEXT NOT NULL
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS pantry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    ingredientName TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS favourites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    recipeId TEXT NOT NULL,
    recipeTitle TEXT NOT NULL,
    recipeImage TEXT,
    cookTime TEXT,
    servings INTEGER,
    calories INTEGER,
    difficulty TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    recipeId TEXT NOT NULL,
    recipeTitle TEXT NOT NULL,
    recipeImage TEXT,
    cookTime TEXT,
    servings INTEGER,
    calories INTEGER,
    difficulty TEXT,
    viewedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`);


// USER DATABASE
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

app.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (name, email, phone, password)
       VALUES (?, ?, ?, ?)`,
      [name, email, phone, hashedPassword],
      function (err) {
        if (err) {
          return res.status(400).json({
            error: "Email or phone already exists",
          });
        }

        res.json({
          message: "User registered successfully",
          userId: this.lastID,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Register failed" });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    }
  );
});

// USER PROFILE
//get user profile
app.get("/profile/:userId", (req, res) => {
  const { userId } = req.params;

  db.get(
    "SELECT id, name, email, phone FROM users WHERE id = ?",
    [userId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(row);
    }
  );
});

//update user profile 
app.put("/profile/:userId", (req, res) => {
  const { userId } = req.params;
  const { name, email, phone } = req.body;

  db.run(
    "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?",
    [name, email, phone, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Profile updated successfully" });
    }
  );
});

//change password
app.put("/profile/:userId/password", (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.get("SELECT * FROM users WHERE id = ?", [userId], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Current password is wrong" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db.run(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "Password updated successfully" });
      }
    );
  });
});

// PANTRY DATABASE
// Get all pantry items
app.get("/pantry", (req, res) => {
  db.all("SELECT * FROM pantry", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

// Get pantry items by user id
app.get("/pantry/:userId", (req, res) => {
  const { userId } = req.params;

  db.all(
    "SELECT * FROM pantry WHERE userId = ? ORDER BY id DESC",
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
});

// Add pantry item
app.post("/pantry", (req, res) => {
  const { userId, ingredientName } = req.body;

  if (!userId || !ingredientName) {
    return res.status(400).json({ error: "User ID and ingredient name are required" });
  }

  db.run(
    "INSERT INTO pantry (userId, ingredientName) VALUES (?, ?)",
    [userId, ingredientName],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Pantry item added successfully",
        id: this.lastID,
      });
    }
  );
});

// Update pantry item by pantry item id
app.put("/pantry/:id", (req, res) => {
  const { id } = req.params;
  const { ingredientName } = req.body;

  if (!ingredientName) {
    return res.status(400).json({ error: "Ingredient name is required" });
  }

  db.run(
    "UPDATE pantry SET ingredientName = ? WHERE id = ?",
    [ingredientName, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Pantry item not found" });
      }

      res.json({ message: "Pantry item updated successfully" });
    }
  );
});

// Delete pantry item by pantry item id
app.delete("/pantry/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM pantry WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Pantry item not found" });
    }

    res.json({ message: "Pantry item deleted successfully" });
  });
});




//FAVOURITES DATABASE
// Get all favourite recipes
app.get("/favourites/:userId", (req, res) => {
  db.all(
    "SELECT * FROM favourites WHERE userId = ? ORDER BY createdAt DESC",
    [req.params.userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.post("/favourites", (req, res) => {
  const { userId, recipeId, recipeTitle, recipeImage, cookTime, servings, calories, difficulty } = req.body;

  if (!userId || !recipeId || !recipeTitle || !recipeImage || !cookTime || !servings || !calories || !difficulty) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    `INSERT INTO favourites 
    (userId, recipeId, recipeTitle, recipeImage, cookTime, servings, calories, difficulty)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, recipeId, recipeTitle, recipeImage, cookTime, servings, calories, difficulty],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Added to favourites", id: this.lastID });
    }
  );
});

app.delete("/favourites/:id", (req, res) => {
  db.run(
    "DELETE FROM favourites WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Removed from favourites" });
    }
  );
});


//HISTORY DATABASE
// Get user history
app.get("/history/:userId", (req, res) => {
  db.all(
    "SELECT * FROM history WHERE userId = ? ORDER BY viewedAt DESC",
    [req.params.userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.post("/history", (req, res) => {
  const { userId, recipeId, recipeTitle, recipeImage, cookTime, servings, calories, difficulty } = req.body;

  if (!userId || !recipeId || !recipeTitle || !recipeImage || !cookTime || !servings || !calories || !difficulty) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    `INSERT INTO history (userId, recipeId, recipeTitle, recipeImage, cookTime, servings, calories, difficulty)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, recipeId, recipeTitle, recipeImage, cookTime, servings, calories, difficulty],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "History added", id: this.lastID });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});