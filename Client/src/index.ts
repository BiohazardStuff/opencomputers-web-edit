import * as path from "path";

import * as express from "express";
import { Express } from "express";

const app: Express = express();

app.use(express.static(path.join(__dirname, "./public")));

app.listen(
  3000,
  () => {
    console.log("Started server on port 3000");
  }
);
