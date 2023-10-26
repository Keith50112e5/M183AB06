DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
	"id"	INTEGER NOT NULL,
	"title"	TEXT NOT NULL,
	"content"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO posts ("title", "content") VALUES
    ("Introduction to JavaScript","JavaScript is a dynamic language primarily used for web development..."),
    ("Functional Programming","Functional programming is a paradigm where functions take center stage..."),
    ("Asynchronous Programming in JS","Asynchronous programming allows operations to run in parallel without blocking the main thread...")
;

SELECT * FROM posts;