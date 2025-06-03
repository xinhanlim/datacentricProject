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

  //get all movies
  app.get("/movies", async (req,res) => {
    try{
        const movies = await db.collection("movies").find().project({
            title:1,
            genre:1,
            duration:1,
            rating:1,
            cast:1,
            director:1,
            synopsis:1,
        }).toArray();

        res.json({movies});

    } catch(error){
        console.log("error fetching movies" ,error);
        res.status(401).json({ Error: "Error"});
    };
  });

  //findOne movie
  app.get("/movies/:id", async (req,res) => {
    try{
        const id = req.params.id;
        console.log(id);
        const movie = await db.collection("movies").findOne(
            {_id: new ObjectId(id)},
            {projection: {_id:0, categories:0}}
        ); 
        console.log(movie);
        if(!movie){
            res.status(401).json({Error: "Error"});
        };

        res.json({movie});

    }catch(error){
        console.log("error fetching movies" ,error);
        res.status(401).json({ Error: "Error"});
    };
  });


}
main();

app.listen(3200, () => {
  console.log("Server started");
});
