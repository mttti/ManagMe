import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

const cors = require("cors");
let sql: string;
const tokenSecret = "secret";
const jsonParser = bodyParser.json();
const app = express();
app.use(jsonParser);
app.use(cors());
const PORT = 3000;
const http = require("http").Server(app);

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
  },
});

socketIO.on("connection", (socket: any) => {
  let notifications: any[] = [];

  socket.on("getNotifications", (data: any) => {
    sql = `SELECT * FROM notification WHERE userId="${data.userId}"`;
    db.all(sql, [], (err: any, rows: any[]) => {
      if (err) notifications = [];
      else if (rows.length < 1) return (notifications = []);
      else notifications = rows;
      socket.emit("userNotifications", notifications);
      return;
    });
    socket.emit("userNotifications", notifications);
  });

  socket.on("addNotification", (data: any) => {
    sql =
      "INSERT INTO notification(title, date, priority,read,userId,GUID) VALUES(?,?,?,?,?,?)";
    const { title, date, priority, read, userId, GUID } = data;
    db.run(sql, [title, date, priority, read, userId, GUID]);
    sql = `SELECT * FROM notification WHERE userId="${data.userId}"`;
    db.all(sql, [], (err: any, rows: any[]) => {
      if (err) notifications = [];
      else if (rows.length < 1) return (notifications = []);
      else notifications = rows;
      socket.emit("userNotifications", notifications);
      return;
    });
    socket.emit("userNotifications", notifications);
  });

  socket.on("disconnect", () => {});
});

app.listen(PORT, () => {
  console.log("Server port: ", PORT);
});
http.listen(4001);

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
  "./managme.db",
  sqlite3.OPEN_READWRITE,
  (err: any) => {
    if (err) return console.error(err);
  }
);

///// PROJECT

app.post("/project", verifyToken, (req, res) => {
  const userRole = getUserRole(req);
  if (userRole === "ADMIN" || userRole === "DEVOPS") {
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
  } else {
    return res.json({ status: 401, success: false });
  }
});

app.get("/project", verifyToken, (req, res) => {
  const userRole = getUserRole(req);
  const userId = getUserId(req);
  switch (userRole) {
    case "ADMIN":
      sql = "SELECT * FROM project";
      break;
    case "DEVOPS":
      sql = "SELECT * FROM project";
      break;
    case "DEVELOPER":
      sql = `SELECT * FROM project where GUID IN (SELECT projectId from userTask WHERE userId="${userId}")`;
      break;

    default:
      break;
  }

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

app.get("/project/:id", verifyToken, (req, res) => {
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

app.delete("/project/:id", verifyToken, (req, res) => {
  const userRole = getUserRole(req);
  if (userRole === "ADMIN" || userRole === "DEVOPS") {
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
  } else {
    return res.json({ status: 401, success: false });
  }
});

app.put("/project", verifyToken, (req, res) => {
  const userRole = getUserRole(req);
  if (userRole === "ADMIN" || userRole === "DEVOPS") {
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
  } else {
    return res.json({ status: 401, success: false });
  }
});

///// PINNED PROJECT

app.post("/pinnedProject", verifyToken, (req, res) => {
  const userId = getUserId(req);
  try {
    const { GUID, name, description } = req.body;
    sql =
      "INSERT OR REPLACE INTO pinnedProject(GUID, name, description,userId) VALUES(?,?,?,?)";
    db.run(sql, [GUID, name, description, userId], (err: any) => {
      if (err) return res.json({ status: 300, success: false, error: err });
    });

    return res.json({ status: 201, success: true });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.get("/pinnedProject", verifyToken, (req, res) => {
  const userId = getUserId(req);
  sql = "SELECT * FROM pinnedProject WHERE userId=?";
  try {
    db.all(sql, [userId], (err: any, rows: string | any[]) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      if (rows.length < 1)
        return res.json({ status: 204, success: false, message: "No match" });
      return res.json({ status: 200, data: rows, success: true });
    });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

app.delete("/pinnedProject/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const userRole = getUserRole(req);
  if (userRole === "ADMIN" || userRole === "DEVOPS") {
    sql = `DELETE FROM pinnedProject WHERE GUID="${id}"`;
    try {
      db.run(sql, [], (err: any) => {
        if (err) return res.json({ status: 300, success: false, error: err });
      });
      return res.json({ status: 200, success: true });
    } catch (error) {
      return res.json({ status: 400, succes: false });
    }
  } else {
    return res.json({ status: 401, success: false });
  }
});

app.put("/pinnedProject", verifyToken, (req, res) => {
  const userRole = getUserRole(req);

  if (userRole === "ADMIN" || userRole === "DEVOPS") {
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
  } else {
    return res.json({ status: 401, success: false });
  }
});

///// STORY

app.post("/story", verifyToken, (req, res) => {
  const userRole = getUserRole(req);

  if (userRole === "ADMIN" || userRole === "DEVOPS") {
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
  } else {
    return res.json({ status: 401, success: false });
  }
});

app.get("/story", verifyToken, (req, res) => {
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

app.get("/story/:id", verifyToken, (req, res) => {
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

app.delete("/story/:id", verifyToken, (req, res) => {
  const userRole = getUserRole(req);

  if (userRole === "ADMIN" || userRole === "DEVOPS") {
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
  } else {
    return res.json({ status: 401, success: false });
  }
});

app.put("/story", verifyToken, (req, res) => {
  const userRole = getUserRole(req);

  if (userRole === "ADMIN" || userRole === "DEVOPS") {
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
  } else {
    return res.json({ status: 401, success: false });
  }
});

app.get("/story/projectId/:projectId", verifyToken, (req, res) => {
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

app.post("/task", verifyToken, (req, res) => {
  const userRole = getUserRole(req);

  if (userRole === "ADMIN" || userRole === "DEVOPS") {
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
        UserId,
      } = req.body;
      sql =
        "INSERT INTO task(GUID, name, description,priority,storyId,expectedTime,status,additionDate,startDate,finishDate,UserId) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
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
          UserId,
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
  } else {
    return res.json({ status: 401, success: false });
  }
});

app.get("/task", verifyToken, (req, res) => {
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

app.get("/task/:id", verifyToken, (req, res) => {
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

app.delete("/task/:id", verifyToken, (req, res) => {
  const userRole = getUserRole(req);

  if (userRole === "ADMIN" || userRole === "DEVOPS") {
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
  } else {
    return res.json({ status: 401, success: false });
  }
});

app.put("/task", verifyToken, (req, res) => {
  const userRole = getUserRole(req);

  if (userRole === "ADMIN" || userRole === "DEVOPS") {
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
      UserId,
    } = req.body;
    sql = `UPDATE task SET name=?, description=?, priority=?, storyId=?, expectedTime=?, status=?, additionDate=?,startDate=?,finishDate=?,UserId=? WHERE GUID=?`;
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
          UserId,
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
  } else {
    return res.json({ status: 401, success: false });
  }
});

app.get("/task/storyId/:storyId", verifyToken, (req, res) => {
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

app.post("/assignTask", verifyToken, (req, res) => {
  try {
    const { taskId, projectId, userId } = req.body;
    sql = "INSERT INTO userTask(taskId,projectId,userId) VALUES(?,?,?)";
    db.run(sql, [taskId, projectId, userId], (err: any) => {
      if (err) res.json({ status: 300, success: false, error: err });
    });
    return res.json({ status: 201, success: true });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});

///// USER

app.get("/user", verifyToken, (req, res) => {
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

app.post("/user", verifyToken, (req, res) => {
  try {
    const { GUID, name, surname, userRole, password, login } = req.body;
    sql =
      "INSERT INTO user(GUID, name, surname, userRole, password, login) VALUES(?,?,?,?,?,?)";
    db.run(
      sql,
      [GUID, name, surname, userRole, password, login],
      (err: any) => {
        if (err) return res.json({ status: 300, success: false, error: err });
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
    name: name,
  };
  let accessToken = generateToken(user, "15m");
  let refreshToken = generateToken(user, "2h");
  sql = "INSERT INTO refreshToken(refreshToken) VALUES (?)";
  db.run(sql, [refreshToken]);

  res.json({
    success: true,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
});

app.post("/logout", verifyToken, (req, res) => {
  const refreshToken = req.body.token;
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
        reject(err);
      } else {
        if (rows.length > 0) {
          user = rows[0];
          resolve(user);
        } else {
          resolve(null);
        }
      }
    });
  });
}
function generateToken(user: any, exp: string) {
  const token = jwt.sign(
    {
      userId: user.GUID,
      userName: user.name,
      login: user.login,
      userRole: user.userRole,
    },
    tokenSecret,
    {
      expiresIn: exp,
    }
  );

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
function getUserRole(req: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (token) {
    const decodedToken: { userRole: string } = jwtDecode(token);
    const userRole = decodedToken.userRole;
    return userRole;
  }
  return null;
}
function getUserId(req: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (token) {
    const decodedToken: { userId: string } = jwtDecode(token);
    const userId = decodedToken.userId;
    return userId;
  }
  return null;
}

/////NOTIFICATIONS

app.post("/markAsRead", verifyToken, (req, res) => {
  try {
    const { GUID } = req.body;
    sql = "UPDATE notification SET read=? WHERE GUID=?";
    db.run(sql, [true, GUID], (err: any) => {
      if (err) res.json({ status: 300, success: false, error: err });
    });
    return res.json({ status: 201, success: true });
  } catch (error) {
    return res.json({ status: 400, succes: false });
  }
});
