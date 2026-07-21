import express from "express";
import { getRelationships, addRelationship, deleteRelationship, getFollowers, getFollowings } from "../controllers/relationship.js";

const router = express.Router();

router.get("/followers", getFollowers);
router.get("/followings", getFollowings); 
router.get("/", getRelationships);
router.post("/", addRelationship);
router.delete("/", deleteRelationship);

export default router;
