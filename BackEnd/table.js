const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
  "./managme.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err);
  }
);

// const sql =
//   "CREATE TABLE project(ID INTEGER PRIMARY KEY,GUID text, name varchar(255), description varchar(255))";
// const sql =
//   "CREATE TABLE pinnedProject(ID INTEGER PRIMARY KEY,GUID text, name varchar(255), description varchar(255), userId UNIQUE)";
// const sql =
//   "CREATE TABLE story(ID INTEGER PRIMARY KEY,GUID text, name varchar(255), description varchar(255), priority, projectId text, date DATE, status, ownerId text )";
// const sql =
//   "CREATE TABLE task(ID INTEGER PRIMARY KEY,GUID text, name varchar(255), description varchar(255), priority, storyId text, expectedTime, status, additionDate, startDate, finishDate, userId)";
// const sql =
//   "CREATE TABLE user(ID INTEGER PRIMARY KEY,GUID text, name varchar(255), surname varchar(255), userRole, password, login)";
// const sql =
//   "CREATE TABLE refreshToken(ID INTEGER PRIMARY KEY, refreshToken Text)";
const sql =
  "CREATE TABLE userTask(ID INTEGER PRIMARY KEY, taskId text, projectId text, userId text)";

db.run(sql);
