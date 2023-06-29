import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(express.json());
app.use(cors());
const URL = process.env.URL;
const PORT = process.env.PORT;

const createConnection = async () => {
  const client = new MongoClient(URL);
  await client.connect();
  console.log("MongoDB connected successfully...!");
  return client;
};
const client = await createConnection();

app.get("/teachers", async (req, res) => {
  const data = await client
    .db("dash")
    .collection("teachers")
    .find({})
    .toArray();
  res.send(data);
});
app.get("/teachers/:id", async (req, res) => {
  const { id } = req.params;
  const data = await client
    .db("dash")
    .collection("teachers")
    .findOne({ _id: new ObjectId(id) });
  res.send(data);
});
app.get("/students", async (req, res) => {
  const data = await client
    .db("dash")
    .collection("students")
    .find({})
    .toArray();
  res.send(data);
});
app.get("/students/:id", async (req, res) => {
  const { id } = req.params;
  const data = await client
    .db("dash")
    .collection("students")
    .findOne({ _id: new ObjectId(id) });
  res.send(data);
});
app.get("/batches", async (req, res) => {
  const data = await client.db("dash").collection("batches").find({}).toArray();
  res.send(data);
});

app.put("/edited-students/:id", async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    console.log(data);
    await client
      .db("dash")
      .collection("students")
      .updateOne(
        { _id: new ObjectId(id) },

        {
          $set: {
            name: req.body.name,
            Id: req.body.Id,
            dob: req.body.dob,
            batch: req.body.batch,
          },
        }
      );
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});
app.put("/teacher-edit/:id", async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    console.log(data);
    await client
      .db("dash")
      .collection("teachers")
      .updateOne(
        { _id: new ObjectId(id) },

        {
          $set: {
            name: req.body.name,
            img: req.body.img,
            salary: req.body.salary,
            date_of_join: req.body.date_of_join,
            native_place: req.body.native_place,
            subject: req.body.subject,
            batch: req.body.batch,
          },
        }
      );
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});

app.post("/add-students", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    await client.db("dash").collection("students").insertOne({
      name: req.body.name,
      Id: req.body.Id,
      dob: req.body.dob,
      batch: req.body.batch,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});
app.post("/add-teacher", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    await client.db("dash").collection("teachers").insertOne({
      name: req.body.name,
      img: req.body.img,
      salary: req.body.salary,
      date_of_join: req.body.date_of_join,
      native_place: req.body.native_place,
      subject: req.body.subject,
      batch: req.body.batch,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});
app.post("/add-batch", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    await client.db("dash").collection("batches").insertOne({
      name: req.body.name,
      type: req.body.type,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});
app.delete("/teachers/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const del = await client
      .db("dash")
      .collection("teachers")
      .deleteOne({ _id: new ObjectId(id) });
    res.send(del);
  } catch (err) {
    console.log(err);
  }
});
app.delete("/batches/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const del = await client
      .db("dash")
      .collection("batches")
      .deleteOne({ name: id });
    res.send(del);
  } catch (err) {
    console.log(err);
  }
});
app.delete("/students/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const del = await client
      .db("dash")
      .collection("students")
      .deleteOne({ _id: new ObjectId(id) });
    res.send(del);
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () =>
  console.log(`server established successfully On the PORT:${PORT}`)
);
