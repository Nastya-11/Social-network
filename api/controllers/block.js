import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getBlockes = (req, res) => {
  const q = "SELECT blockerUserId FROM blockes WHERE blockedUserId = ?"; 

  db.query(q, [req.query.blockedUserId], (err, data) => {
    if (err) return res.status(500).json(err); 

    return res.status(200).json(data.map((block) => block.blockerUserId));
  });
};

export const addBlockes = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO blockes (`blockerUserId`,`blockedUserId`) VALUES (?, ?)";
    const blockerUserId = userInfo.id;
    const blockedUserId = req.body.userId;

    db.query(q, [blockerUserId, blockedUserId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Blocked");
    });
  });
};


export const deleteBlockes = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!"); 

    const q =
      "DELETE FROM blockes WHERE `blockerUserId` = ? AND `blockedUserId` = ?";

    const blockerUserId = userInfo.id; 
    const blockedUserId = req.body.userId;

    db.query(q, [blockerUserId, blockedUserId], (err, data) => {
      if (err) return res.status(500).json(err); 
      return res.status(200).json("Unblock");
    });
  });
};
