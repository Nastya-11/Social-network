import express from "express";
import { getBlockes, addBlockes, deleteBlockes } from "../controllers/block.js";

const router = express.Router();

router.get("/", getBlockes);

router.post("/", addBlockes);
router.delete("/", deleteBlockes);

export default router;
