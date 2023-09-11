import express from "express";
import helmet from "helmet";
import "dotenv/config";
// dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
