import { Router } from "express";


const router = Router();

router.get("/home", async (req, res) => {
  const { q } = req.query as any;
  try {
    res.json(q);
  } catch (error) {
    res.status(500).send(error);
  }
});
