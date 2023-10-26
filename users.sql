/* Without Role */
DROP TABLE IF EXISTS users;
CREATE TABLE "users" (
	"id"	INTEGER,
	"username"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

/* With Role */
DROP TABLE IF EXISTS users;
CREATE TABLE "users" (
	"id"	INTEGER,
	"username"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	"role"	TEXT NOT NULL DEFAULT 'viewer',
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO users (username,  password) VALUES ("patrick.michel@digital4you.ch"
, "$2b$10$KddKH1wLiCzMR4CzWQVhXeNyMKNBDqOQWRn6py9BZJb2V5rgwviMO")
,("keithyannick.hager@gmail.com","$2b$10$kfpJef647t2ry7G7Yxi2EeuGlzcV5LQScqgP0QWTWrI3crzt.heQ6");

SELECT * FROM users;