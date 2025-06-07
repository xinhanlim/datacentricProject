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
    app.post("/movies", async function (req, res) {
        try {

            // title, genre, duration, releaseYear, rating, cast, reviews and categories
            // when we use POST, PATCH or PUT to send data to the server, the data are in req.body
            let { title, genre, duration, releaseYear, rating, cast, reviews, categories } = req.body;

            // basic validation: make sure that title, genre, cast, reviews and categories
            if (!title || !genre || !cast || !reviews || !categories) {
                return res.status(400).json({
                    "error": "Missing fields required"
                })
            }

            // find the _id of the related genre and add it to the new movie
            let genreDoc = await db.collection('genres').findOne({
                "name": genre
            })

            if (!genreDoc) {
                return res.status(400).json({ "error": "Invalid genre" })
            }

            // find all the categories that the client want to attach to the movie document
            const categoryDocuments = await db.collection('categories').find({
                'name': {
                    '$in': categories
                }
            }).toArray();

            // TODO: create a new movie document
            let newMovieDocument = {
               
            }

            //TODO: insert the new movie document into the collection
            let result = null;

            res.status(201).json({
                'message': 'New movie has been created',
                'movieId': result.insertedId // insertedId is the _id of the new document
            })


        } catch (e) {
            console.error(e);
            res.status(500);
        }
    })

  
}
main();

app.listen(3200, () => {
  console.log("Server started");
});
