import express from "express";
import cors from "cors";
import { z } from "zod";
import fs from "fs/promises";

const app = express();

app.use(cors());
app.use(express.json());

type User = {
  email: string;
  password: string;
};

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

const loadDb = async (filename: string) => {
  try {
    const rawData = await fs.readFile(
      `${__dirname}/../database/${filename}.json`,
      "utf-8"
    );
    const data = JSON.parse(rawData);
    return data as User[];
  } catch (error) {
    return null;
  }
};

const saveDB = async (filename: string, data: any) => {
  try {
    const fileContent = JSON.stringify(data);
    await fs.writeFile(
      `${__dirname}/../database/${filename}.json`,
      fileContent
    );
    return true;
  } catch (error) {
    return false;
  }
};

app.get("/api/registration", async (req, res) => {
  const userData = await loadDb("users");
  if (!userData) return res.sendStatus(500);

  res.json();
});


const PostRequest = z.object({
  id: z.number(),
  email: z.string().email(),
  password: z.string().min(5),
  confirmPassword: z.string().min(5),
});

app.post("/api/registration", async (req, res) => {
  const result = PostRequest.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error.issues);
  const newUser = result.data;

  const userData = await loadDb("users");
  if (!userData) return res.sendStatus(500);

  const id = Math.random();
  const isSuccessful = await saveDB("users", [...userData, { ...newUser, id }]);

  if (!isSuccessful) return res.sendStatus(500);

  res.json({ ...newUser, id });
});

app.listen(3000);
