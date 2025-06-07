const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const dbname = "cinemadb";
const { ObjectId } = require("mongodb");

const mongoUri = process.env.MONGO_URI;

let app = express();
app.use(express.json());
app.use(cors());

async function connect(uri, dbname) {
  let client = await MongoClient.connect(uri);
  let db = client.db(dbname);
  return db;
}

async function main() {
  let db = await connect(mongoUri, dbname);

  //get all movies & search function
  app.get("/movies", async (req, res) => {
    try {
        // const { title, genre, releaseYear, rating, cast, categories } = req.query;
        // let filter = {};
  
        // if (title) {
        //   filter.title = { $regex: title, $options: 'i' };
        // }
  
        // if (genre) {
        //   filter["genre.name"] = { $regex: genre, $options: 'i' };
        // }
  
        // if (releaseYear) {
        //   filter.releaseYear = parseInt(releaseYear);
        // }
  
        // if(rating){
        //   filter.rating = {$gte: parseFloat(rating)};
        // }
  
        // if(cast){
        //   filter["cast.name"] = {$regex : cast, $options: ''};
        // }
  
        // if(categories){
        //   filter["categories.name"] = { $in: categories.split(',')};
        // }
        
      const movies = await db
        .collection("movies")
        .find()
        .project({
          title: 1,
          genre: 1,
          releaseYear: 1,
          rating: 1,
          cast: 1,
          categories: 1,
        })
        .toArray();

      res.json({ movies });
    } catch (error) {
      console.log("error fetching movies", error);
      res.status(401).json({ Error: "Error" });
    }
  });

  app.get("/movies/search", async (req,res) => {
    try {
        const { title, genre, releaseYear, rating, cast, categories } = req.query;
        let filter = {};
  
        if (title) {
          filter.title = { $regex: title, $options: 'i' };
        }
  
        if (genre) {
          filter["genre.name"] = { $regex: genre, $options: 'i' };
        }
  
        if (releaseYear) {
          filter.releaseYear = parseInt(releaseYear);
        }
  
        if(rating){
          filter.rating = {$gte: parseFloat(rating)};
        }
  
        if(cast){
          filter["cast.name"] = {$regex : cast, $options: ''};
        }
  
        if(categories){
          filter["categories.name"] = { $in: categories.split(',')};
        }

        const movies = await db
        .collection("movies")
        .find(filter)
        .project({
          title: 1,
          genre: 1,
          releaseYear: 1,
          rating: 1,
          cast: 1,
          categories: 1,
        })
        .toArray();

      res.json({ movies });
      } catch (error) {
        console.log("error fetching movies", error);
        res.status(401).json({ Error: "Error" });
      }
  });

  //findOne movie
  app.get("/movies/:id", async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);
      const movie = await db
        .collection("movies")
        .findOne(
          { _id: new ObjectId(id) },
          { projection: { _id: 0, categories: 0 } }
        );
      console.log(movie);
      if (!movie) {
        res.status(401).json({ Error: "Error" });
      }

      res.json({ movie });
    } catch (error) {
      console.log("error fetching movies", error);
      res.status(401).json({ Error: "Error" });
    }
  });

 

  //Add movies
  app.post("/movies", async (req,res) => {

  });
  
}
main();

app.listen(3200, () => {
  console.log("Server started");
});
