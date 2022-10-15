import { config } from "dotenv";
config();

import downloadQueue from "./download-queue";
import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/download", async (req: Request, res: Response) => {
  const { url } = req.query;
  try {
    await downloadQueue.getQueue().add({ url });
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "error" });
  }
});

app.get("/", async (req: Request, res: Response) => {
  return res.json({ ok: true });
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
