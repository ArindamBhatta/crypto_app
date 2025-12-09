import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load .env ONLY IN EMULATOR
if (process.env.FUNCTIONS_EMULATOR) {
  console.log("🔥 Emulator detected. Loading .env…");
  dotenv.config();
}

admin.initializeApp();
const db = admin.firestore();

// Get Neynar Key
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

console.log("🔑 NEYNAR_API_KEY:", NEYNAR_API_KEY ? "LOADED" : "NOT FOUND");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

/**
 * 1️⃣ GET AUTH URL FROM NEYNAR
 */
app.get("/auth/url", async (req: Request, res: Response) => {
  try {
    console.log("➡️ Request: GET /auth/url");

    const url = "https://api.neynar.com/v2/farcaster/user/authorize"; // ✅ Correct endpoint

    const r = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": NEYNAR_API_KEY || ""
      }
    });

    const txt = await r.text();
    console.log("📩 Neynar Response:", txt);

    if (!r.ok) {
      return res.status(500).json({
        error: "Neynar request failed",
        details: txt
      });
    }

    const json = JSON.parse(txt);
    res.json(json);

  } catch (err: any) {
    console.error("🔥 Error in /auth/url:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 2️⃣ COMPLETE SIGN-IN — SAVE USER
 */
app.post("/auth/complete", async (req: Request, res: Response) => {
  try {
    const { callback_result, email } = req.body;

    if (!callback_result || !email) {
      return res.status(400).json({
        error: "Missing callback_result or email"
      });
    }

    const params = new URL(callback_result).searchParams;
    const fid = params.get("fid");

    if (!fid) {
      return res.status(400).json({ error: "Invalid callback_result: missing fid" });
    }

    await db.collection("users").doc(fid).set({
      fid,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, fid, email });

  } catch (err: any) {
    console.error("🔥 Error in /auth/complete:", err);
    res.status(500).json({ error: err.message });
  }
});

// Export express app
export const api = functions.onRequest(app);
