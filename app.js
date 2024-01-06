const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
app.use(express.json());
const data = path.join(__dirname, "moviesData.db");
let db = null;
const intServer = async () => {
  try {
    db = await open({
      filename: data,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("the server is running on 3000 port");
    });
  } catch (e) {
    console.log(`Database Error ${e.message}`);
    process.exit(1);
  }
};
intServer();

app.get("/movies/", async (req, res) => {
  const query1 = `SELECT * FROM movie;`;
  const moviesArray = await db.all(query1);
  res.send(moviesArray);
});

app.post("/movies/", async (req, res) => {
  const movieDetails = req.body;
  const { director_id, movie_name, lead_actor } = movieDetails;
  const query2 = `INSERT INTO
      book (director_id,movie_name,lead_actor)
    VALUES
      (${director_id},
        '${movie_name}',
        '${lead_actor}'
      );`;
  await db.run(query2);
  res.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (req, res) => {
  const movieId = req.params.movieId;
  const query3 = `SELECT * FROM movie WHERE movieId=${movieId};`;
  const movieResult = await db.all(query3);

  if (movieResult && movieResult.length > 0) {
    res.send(movieResult);
  } else {
    res.status(404).send("Movie not found");
  }
});
app.put("/movies/:movieId/", async (req, res) => {
  const movieId = req.params.movieId;
  const movieDetails = req.body;
  const { director_id, movie_name, lead_actor } = movieDetails;
  const query4 = `UPDATE movie SET director_id=${director_id},
    movie_name='${movie_name}', lead_actor='${lead_actor}' WHERE movieId=${movieId};`;
  await db.run(query4);
  res.send("Movie Details Updated");
});
app.delete("/movies/:movieId/", async (req, res) => {
  const movieId = req.params.movieId;
  const query5 = `DELETE from movie WHERE movieId=${movieId};`;
  await db.run(query5);
  res.send("Movie Removed");
});

app.get("/directors/", async (req, res) => {
  const query6 = `SELECT * FROM director;`;
  const d = await db.all(query6);
  res.send(d);
});

app.get("/directors/", async (req, res) => {
  const query6 = `SELECT * FROM director;`;
  const d = await db.all(query6);
  res.send(d);
});

app.get("/directors/:directorId/movies/", async (req, res) => {
  const directorId = req.params.directorId;
  const query7 = `SELECT movie.*
FROM movie
JOIN director ON movie.director_id = director.director_id
WHERE director.director_id=${directorId};`;
  const m = db.all(query7);
  res.send(m);
});
module.exports = app;
