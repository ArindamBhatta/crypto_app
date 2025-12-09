import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import express, { Request, Response } from "express";
import cors from "cors";

admin.initializeApp();
const db = admin.firestore();

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY; // stored securely in Firebase

if (!NEYNAR_API_KEY) {
  console.warn("⚠️ NEYNAR_API_KEY is missing. Set it with: firebase functions:secrets:set NEYNAR_API_KEY");
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// 1️⃣ GET AUTH URL
app.get("/auth/url", async (req: Request, res: Response) => {
  try {
    const r = await fetch("https://api.neynar.com/v2/farcaster/login/authorize", {
      method: "GET",
      headers: { "x-api-key": NEYNAR_API_KEY! }
    });

    if (!r.ok) return res.status(500).json({ error: "Failed to contact Neynar" });

    const body = await r.json();
    res.json(body);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2️⃣ COMPLETE SIGN-IN + STORE EMAIL
app.post("/auth/complete", async (req: Request, res: Response) => {
  try {
    const { callback_result, email } = req.body;

    if (!callback_result || !email) {
      return res.status(400).json({ error: "Missing callback_result or email" });
    }

    // extract fid from Neynar redirect URL
    const params = new URL(callback_result).searchParams;
    const fid = params.get("fid") || "unknown-fid";

    // Save in Firestore
    await db.collection("users").doc(fid).set({
      fid,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, fid, email });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    
  }
});

// EXPORT EXPRESS APP
export const api = functions.onRequest(app);
