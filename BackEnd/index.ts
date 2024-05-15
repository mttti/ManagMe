import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

const cors = require("cors");
let sql: string;
const tokenSecret = "secret";
const jsonParser = bodyParser.json();
const app = express();
app.use(jsonParser);
app.use(cors());
const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server port: ", PORT);
});

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
  "./menagme.db",
  sqlite3.OPEN_READWRITE,
  (err: any) => {
    if (err) return console.error(err);
  }
);

///// PROJECT

app.post("/project", (req, res) => {
  try {
    const { GUID, name, description } = req.body;
    sql = "INSERT INTO project(GUID, name, description) VALUES(?,?,?)";
    db.run(sql, [GUID, name, description], (err: any) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      console.log("success");
    });
    return res.json({ status: 201, success: true });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.get("/project", (req, res) => {
  sql = "SELECT * FROM project";
  try {
    db.all(sql, [], (err: any, rows: string | any[]) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      if (rows.length < 1)
        return res.json({ status: 204, success: false, message: "No match" });
      return res.json({ status: 200, data: rows, success: true });
    });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.get("/project/:id", (req, res) => {
  const id = req.params.id;
  sql = `SELECT * FROM project WHERE GUID="${id}"`;

  try {
    db.all(sql, [], (err: any, rows: string | any[]) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      if (rows.length < 1)
        return res.json({ status: 204, success: false, message: "No match" });
      return res.json({ status: 200, data: rows, success: true });
    });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.delete("/project/:id", (req, res) => {
  const id = req.params.id;
  sql = `DELETE FROM project WHERE GUID="${id}"`;
  try {
    db.run(sql, [], (err: any) => {
      if (err) return res.json({ status: 300, success: false, error: err });
    });
    return res.json({ status: 200, success: true });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.put("/project", (req, res) => {
  const { GUID, name, description } = req.body;
  sql = `UPDATE project SET name=?, description=? WHERE GUID=?`;
  try {
    db.run(sql, [name, description, GUID], (err: any) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      console.log("success");
    });
    return res.json({ status: 201, success: true });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

///// PINNED PROJECT

app.post("/pinnedProject", (req, res) => {
  try {
    const { GUID, name, description } = req.body;
    sql = "DELETE FROM pinnedProject";
    db.run(sql, [], (delErr: any) => {
      if (delErr) {
        return res.json({ status: 300, success: false, error: delErr });
      }
      sql = "INSERT INTO pinnedProject(GUID, name, description) VALUES(?,?,?)";
      db.run(sql, [GUID, name, description], (err: any) => {
        if (err) return res.json({ status: 300, success: false, error: err });
        console.log("success");
      });
    });
    return res.json({ status: 201, success: true });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.get("/pinnedProject", (req, res) => {
  sql = "SELECT * FROM pinnedProject";
  try {
    db.all(sql, [], (err: any, rows: string | any[]) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      if (rows.length < 1)
        return res.json({ status: 204, success: false, message: "No match" });
      return res.json({ status: 200, data: rows, success: true });
    });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.delete("/pinnedProject/:id", (req, res) => {
  const id = req.params.id;
  sql = `DELETE FROM pinnedProject WHERE GUID="${id}"`;
  try {
    db.run(sql, [], (err: any) => {
      if (err) return res.json({ status: 300, success: false, error: err });
    });
    return res.json({ status: 200, success: true });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.put("/pinnedProject", (req, res) => {
  const { GUID, name, description } = req.body;
  sql = `UPDATE pinnedProject SET name=?, description=? WHERE GUID=?`;
  try {
    db.run(sql, [name, description, GUID], (err: any) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      console.log("success");
    });
    return res.json({ status: 201, success: true });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

///// STORY

app.post("/story", (req, res) => {
  try {
    const {
      GUID,
      name,
      description,
      priority,
      projectId,
      date,
      status,
      ownerId,
    } = req.body;
    sql =
      "INSERT INTO story(GUID, name, description,priority,projectId,date,status,ownerId) VALUES(?,?,?,?,?,?,?,?)";
    db.run(
      sql,
      [GUID, name, description, priority, projectId, date, status, ownerId],
      (err: any) => {
        if (err) return res.json({ status: 300, success: false, error: err });
        console.log("success");
      }
    );
    return res.json({ status: 201, success: true });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.get("/story", (req, res) => {
  sql = "SELECT * FROM story";
  try {
    db.all(sql, [], (err: any, rows: string | any[]) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      if (rows.length < 1)
        return res.json({ status: 204, success: false, message: "No match" });
      return res.json({ status: 200, data: rows, success: true });
    });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.get("/story/:id", (req, res) => {
  const id = req.params.id;
  sql = `SELECT * FROM story WHERE GUID="${id}"`;

  try {
    db.all(sql, [], (err: any, rows: string | any[]) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      if (rows.length < 1)
        return res.json({ status: 204, success: false, message: "No match" });
      return res.json({ status: 200, data: rows, success: true });
    });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.delete("/story/:id", (req, res) => {
  const id = req.params.id;
  sql = `DELETE FROM story WHERE GUID="${id}"`;
  try {
    db.run(sql, [], (err: any) => {
      if (err) return res.json({ status: 300, success: false, error: err });
    });
    return res.json({ status: 200, success: true });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.put("/story", (req, res) => {
  const {
    GUID,
    name,
    description,
    priority,
    projectId,
    date,
    status,
    ownerId,
  } = req.body;
  sql = `UPDATE story SET name=?, description=?, priority=?, projectId=?, date=?, status=?, ownerId=? WHERE GUID=?`;
  try {
    db.run(
      sql,
      [name, description, priority, projectId, date, status, ownerId, GUID],
      (err: any) => {
        if (err) return res.json({ status: 300, success: false, error: err });
        console.log("success");
      }
    );
    return res.json({ status: 201, success: true });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.get("/story/projectId/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  sql = `SELECT * FROM story WHERE projectId="${projectId}"`;

  try {
    db.all(sql, [], (err: any, rows: string | any[]) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      if (rows.length < 1)
        return res.json({ status: 204, success: false, message: "No match" });
      return res.json({ status: 200, data: rows, success: true });
    });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

///// TASK

app.post("/task", (req, res) => {
  try {
    const {
      GUID,
      name,
      description,
      priority,
      storyId,
      expectedTime,
      status,
      additionDate,
      startDate,
      finishDate,
      userId,
    } = req.body;
    console.log(req.body);
    sql =
      "INSERT INTO task(GUID, name, description,priority,storyId,expectedTime,status,additionDate,startDate,finishDate,userId) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
    db.run(
      sql,
      [
        GUID,
        name,
        description,
        priority,
        storyId,
        expectedTime,
        status,
        additionDate,
        startDate,
        finishDate,
        userId,
      ],
      (err: any) => {
        if (err) return res.json({ status: 300, success: false, error: err });
        console.log("success");
      }
    );
    return res.json({ status: 201, success: true });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.get("/task", (req, res) => {
  sql = "SELECT * FROM task";
  try {
    db.all(sql, [], (err: any, rows: string | any[]) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      if (rows.length < 1)
        return res.json({ status: 204, success: false, message: "No match" });
      return res.json({ status: 200, data: rows, success: true });
    });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.get("/task/:id", (req, res) => {
  const id = req.params.id;
  sql = `SELECT * FROM task WHERE GUID="${id}"`;

  try {
    db.all(sql, [], (err: any, rows: string | any[]) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      if (rows.length < 1)
        return res.json({ status: 204, success: false, message: "No match" });
      return res.json({ status: 200, data: rows, success: true });
    });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.delete("/task/:id", (req, res) => {
  const id = req.params.id;
  sql = `DELETE FROM task WHERE GUID="${id}"`;
  try {
    db.run(sql, [], (err: any) => {
      if (err) return res.json({ status: 300, success: false, error: err });
    });
    return res.json({ status: 200, success: true });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.put("/task", (req, res) => {
  const {
    GUID,
    name,
    description,
    priority,
    storyId,
    expectedTime,
    status,
    additionDate,
    startDate,
    finishDate,
    userId,
  } = req.body;
  sql = `UPDATE task SET name=?, description=?, priority=?, storyId=?, expectedTime=?, status=?, additionDate=?,startDate=?,finishDate=?,userId=? WHERE GUID=?`;
  try {
    db.run(
      sql,
      [
        name,
        description,
        priority,
        storyId,
        expectedTime,
        status,
        additionDate,
        startDate,
        finishDate,
        userId,
        GUID,
      ],
      (err: any) => {
        if (err) return res.json({ status: 300, success: false, error: err });
        console.log("success");
      }
    );
    return res.json({ status: 201, success: true });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.get("/task/storyId/:storyId", (req, res) => {
  const storyId = req.params.storyId;
  sql = `SELECT * FROM task WHERE storyId="${storyId}"`;

  try {
    db.all(sql, [], (err: any, rows: string | any[]) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      if (rows.length < 1)
        return res.json({ status: 204, success: false, message: "No match" });
      return res.json({ status: 200, data: rows, success: true });
    });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

///// USER

app.get("/user", (req, res) => {
  sql = "SELECT * FROM user";
  try {
    db.all(sql, [], (err: any, rows: string | any[]) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      if (rows.length < 1)
        return res.json({ status: 204, success: false, message: "No match" });
      return res.json({ status: 200, data: rows, success: true });
    });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.post("/user", (req, res) => {
  try {
    const { GUID, name, surname, userRole, password, login } = req.body;
    sql =
      "INSERT INTO user(GUID, name, surname, userRole, password, login) VALUES(?,?,?,?,?,?)";
    db.run(
      sql,
      [GUID, name, surname, userRole, password, login],
      (err: any) => {
        if (err) return res.json({ status: 300, success: false, error: err });
        console.log("success");
      }
    );
    return res.json({ status: 201, success: true });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.post("/login", async (req, res) => {
  const { login, password } = req.body;
  verifyUser(login, password)
    .then((user: any) => {
      let accessToken = generateToken(user, "15m");
      let refreshToken = generateToken(user, "2h");
      sql = "INSERT INTO refreshToken(refreshToken) VALUES (?)";
      db.run(sql, [refreshToken]);
      res.json({
        success: true,
        login: user.login,
        userName: user.name,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ success: false, message: "Username or password incorrect!" });
    });
});

app.post("/googleLogin", async (req, res) => {
  const { id, email, name } = req.body;
  const user = {
    id: id,
    login: email,
  };
  let accessToken = generateToken(user, "15m");
  let refreshToken = generateToken(user, "2h");
  sql = "INSERT INTO refreshToken(refreshToken) VALUES (?)";
  db.run(sql, [refreshToken]);

  res.json({
    success: true,
    login: user.login,
    userName: name,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
});

app.post("/logout", verifyToken, (req, res) => {
  const refreshToken = req.body.token;
  console.log(refreshToken);
  sql = `DELETE FROM refreshToken WHERE refreshToken="${refreshToken}"`;
  try {
    db.run(sql, [], (err: any) => {
      if (err) return res.json({ status: 300, success: false, error: err });
    });
    return res.json({
      status: 200,
      success: true,
      message: "You logged out successfully!",
    });
  } catch (error) {
    return res.json({
      status: 400,
      succes: false,
      message: "Failed to logout",
    });
  }
});

app.post("/refreshToken", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(401).json("You are not authenticated!");
  }
  console.log("refresh");
  verifyRefreshToken(refreshToken)
    .then((token) => {
      jwt.verify(refreshToken, tokenSecret, (err: any, user: any) => {
        err && console.log(err);

        sql = `DELETE FROM refreshToken WHERE refreshToken="${refreshToken}"`;
        db.run(sql, [], (err: any) => {
          if (err) return res.json({ status: 300, success: false, error: err });
        });

        const newAccesToken = generateToken(user, "15m");
        const newRefreshToken = generateToken(user, "2h");

        sql = "INSERT INTO refreshToken(refreshToken) VALUES (?)";
        db.run(sql, [newRefreshToken], (err: any) => {
          if (err) return res.json({ status: 300, success: false, error: err });
        });

        res.status(200).json({
          accessToken: newAccesToken,
          refreshToken: newRefreshToken,
        });
      });
    })
    .catch((err) => {
      return res.status(403).json("Refresh token is not valid!");
    });
});

async function verifyRefreshToken(token: string) {
  sql = "SELECT * FROM refreshToken WHERE refreshToken=?";

  return new Promise((resolve, reject) => {
    db.all(sql, [token], (err: any, rows: string | any[]) => {
      if (err) {
        reject(err);
      } else {
        if (rows.length > 0) {
          resolve(rows);
        } else {
          resolve(null);
        }
      }
    });
  });
}

async function verifyUser(login: string, password: string) {
  let user: any = null;
  sql = "SELECT * FROM user WHERE login=? AND password =?";

  return new Promise((resolve, reject) => {
    db.all(sql, [login, password], (err: any, rows: string | any[]) => {
      if (err) {
        reject(err); // Jeśli wystąpił błąd, odrzuć obietnicę
      } else {
        if (rows.length > 0) {
          user = rows[0];
          console.log("Znaleziono użytkownika:", user);
          resolve(user); // Rozwiąż obietnicę z użytkownikiem
        } else {
          console.log("Użytkownik nie znaleziony");
          resolve(null); // Rozwiąż obietnicę z wartością null, jeśli użytkownik nie został znaleziony
        }
      }
    });
  });
}
function generateToken(user: any, exp: string) {
  const token = jwt.sign({ id: user.id, login: user.login }, tokenSecret, {
    expiresIn: exp,
  });

  return token;
}
function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(403);

  jwt.verify(token, tokenSecret, (err: any, user: any) => {
    if (err) {
      console.log(err);
      return res.status(401).send(err.message);
    }
    req.user = user;
    next();
  });
}
