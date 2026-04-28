const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect SQLite database
const db = new sqlite3.Database("./recipes.db", (err) => {
  if (err) {
    console.log("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});
//RECIPE DATABASE
// Create recipes table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    cookTime TEXT,
    servings INTEGER,
    calories INTEGER
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipeId INTEGER NOT NULL,
    ingredientName TEXT NOT NULL
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS pantry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ingredientName TEXT NOT NULL,
    quantity TEXT,
    expiryDate TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    dietPreference TEXT
  )
`);
//seed recipe
db.get("SELECT COUNT(*) AS count FROM recipes", (err, row) => {
  if (!err && row.count === 0) {
    db.run(`
      INSERT INTO recipes (title, description, cookTime, servings, calories)
      VALUES
      ('Mushroom Pasta', 'Creamy mushroom pasta with garlic and Parmesan.', '20 min', 2, 520),
      ('Chicken Salad', 'Fresh salad with grilled chicken.', '15 min', 1, 350),
      ('Omelette', 'Classic fluffy egg omelette.', '10 min', 1, 250),
      ('Fried Rice', 'Quick fried rice with vegetables.', '18 min', 2, 480)
    `);
  }
});

db.get("SELECT COUNT(*) AS count FROM recipe_ingredients", (err, row) => {
  if (!err && row.count === 0) {
    db.run(`
      INSERT INTO recipe_ingredients (recipeId, ingredientName)
      VALUES
      (1, 'Pasta'),
      (1, 'Mushroom'),
      (1, 'Garlic'),
      (1, 'Cream'),
      (1, 'Cheese'),
      (1, 'Butter')
    `);
  }
});
//seed user 
db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
  if (!err && row.count === 0) {
    db.run(`
      INSERT INTO users (name, email, dietPreference)
      VALUES ('Malcolm', 'user@email.com', 'Vegetarian')
    `);
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

//get recipe
app.get("/recipes", (req, res) => {
  db.all("SELECT * FROM recipes", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post("/recipes", (req, res) => {
  const { title, description, cookTime, servings, calories } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const sql = `
    INSERT INTO recipes (title, description, cookTime, servings, calories)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [title, description, cookTime, servings, calories],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({
          message: "Recipe added successfully",
          id: this.lastID
        });
      }
    }
  );
});

//SEARCH FUNCTION Search recipes by title 
app.get("/recipes/search", (req, res) => {
  const { q } = req.query;

  db.all(
    "SELECT * FROM recipes WHERE title LIKE ?",
    [`%${q}%`],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

// Get single recipe by id
app.get("/recipes/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM recipes WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ message: "Recipe not found" });
    } else {
      res.json(row);
    }
  });
});

// Delete recipe by id
app.delete("/recipes/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM recipes WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: "Recipe not found" });
    } else {
      res.json({ message: "Recipe deleted successfully" });
    }
  });
});

// Update recipe by id
app.put("/recipes/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, cookTime, servings, calories } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const sql = `
    UPDATE recipes
    SET title = ?, description = ?, cookTime = ?, servings = ?, calories = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [title, description, cookTime, servings, calories, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ message: "Recipe not found" });
      } else {
        res.json({ message: "Recipe updated successfully" });
      }
    }
  );
});
//add ingredients by recipe id :GET
app.get("/recipes/:id/ingredients", (req, res) => {
  const { id } = req.params;

  db.all(
    "SELECT * FROM recipe_ingredients WHERE recipeId = ?",
    [id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});
// Add ingredient to recipe POST
app.post("/recipes/:id/ingredients", (req, res) => {
  const { id } = req.params;
  const { ingredientName } = req.body;

  if (!ingredientName) {
    return res.status(400).json({ error: "Ingredient name is required" });
  }

  db.run(
    "INSERT INTO recipe_ingredients (recipeId, ingredientName) VALUES (?, ?)",
    [id, ingredientName],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({
          message: "Ingredient added successfully",
          id: this.lastID
        });
      }
    }
  );
});

//PANTRY DATABASE 
// Get all pantry items
app.get("/pantry", (req, res) => {
  db.all("SELECT * FROM pantry", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Add pantry item
app.post("/pantry", (req, res) => {
  const { ingredientName, quantity, expiryDate } = req.body;

  if (!ingredientName) {
    return res.status(400).json({ error: "Ingredient name is required" });
  }

  const sql = `
    INSERT INTO pantry (ingredientName, quantity, expiryDate)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [ingredientName, quantity, expiryDate], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        message: "Pantry item added successfully",
        id: this.lastID
      });
    }
  });
});

// Delete pantry item by id
app.delete("/pantry/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM pantry WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: "Pantry item not found" });
    } else {
      res.json({ message: "Pantry item deleted successfully" });
    }
  });
});

// Update pantry item by id
app.put("/pantry/:id", (req, res) => {
  const { id } = req.params;
  const { ingredientName, quantity, expiryDate } = req.body;

  if (!ingredientName) {
    return res.status(400).json({ error: "Ingredient name is required" });
  }

  const sql = `
    UPDATE pantry
    SET ingredientName = ?, quantity = ?, expiryDate = ?
    WHERE id = ?
  `;

  db.run(sql, [ingredientName, quantity, expiryDate, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: "Pantry item not found" });
    } else {
      res.json({ message: "Pantry item updated successfully" });
    }
  });
});
//get user profile
app.get("/profile", (req, res) => {
  db.get("SELECT * FROM users LIMIT 1", [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(row);
    }
  });
});
//update user profile 
app.put("/profile", (req, res) => {
  const { name, email, dietPreference } = req.body;

  db.run(
    "UPDATE users SET name = ?, email = ?, dietPreference = ? WHERE id = 1",
    [name, email, dietPreference],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Profile updated successfully" });
      }
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});