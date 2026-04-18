const axios = require("axios");
const db = require("../config/db");

const STRAVA_API_BASE = "https://www.strava.com/api/v3";
const STRAVA_OAUTH_BASE = "https://www.strava.com/oauth/token";

// Exchange authorization code for tokens
const exchangeCodeForTokens = async (code) => {
  try {
    const response = await axios.post(STRAVA_OAUTH_BASE, {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    });

    return response.data;
  } catch (err) {
    throw new Error(`Strava token exchange failed: ${err.message}`);
  }
};

// Refresh expired access token
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(STRAVA_OAUTH_BASE, {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

    return response.data;
  } catch (err) {
    throw new Error(`Token refresh failed: ${err.message}`);
  }
};

// Get valid access token (refresh if expired)
const getValidAccessToken = async (userId) => {
  try {
    const conn = await db.getConnection();
    const [profiles] = await conn.query(
      "SELECT access_token, refresh_token, expires_at FROM strava_profiles WHERE user_id = ?",
      [userId]
    );
    conn.release();

    if (!profiles.length) {
      throw new Error("Strava profile not found");
    }

    const profile = profiles[0];
    const now = Math.floor(Date.now() / 1000);

    if (profile.expires_at > now) {
      return profile.access_token;
    }

    // Token expired, refresh it
    const newTokenData = await refreshAccessToken(profile.refresh_token);

    const conn2 = await db.getConnection();
    await conn2.query(
      "UPDATE strava_profiles SET access_token = ?, refresh_token = ?, expires_at = ? WHERE user_id = ?",
      [
        newTokenData.access_token,
        newTokenData.refresh_token,
        newTokenData.expires_at,
        userId,
      ]
    );
    conn2.release();

    return newTokenData.access_token;
  } catch (err) {
    throw new Error(`Failed to get valid access token: ${err.message}`);
  }
};

// Fetch athlete activities from Strava
const fetchAthleteActivities = async (accessToken, page = 1, perPage = 30) => {
  try {
    const response = await axios.get(`${STRAVA_API_BASE}/athlete/activities`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { page, per_page: perPage },
    });

    return response.data;
  } catch (err) {
    throw new Error(`Failed to fetch activities: ${err.message}`);
  }
};

// Sync Strava activities to database (filter runs only)
const syncActivities = async (userId) => {
  try {
    const accessToken = await getValidAccessToken(userId);
    const activities = await fetchAthleteActivities(accessToken);

    const conn = await db.getConnection();
    let syncedCount = 0;

    for (const activity of activities) {
      // Only sync "Run" type activities
      if (activity.type !== "Run") continue;

      const distanceKm = (activity.distance / 1000).toFixed(2);

      try {
        await conn.query(
          `INSERT INTO activities (user_id, strava_activity_id, distance, moving_time, start_date_local, activity_type)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            userId,
            activity.id,
            distanceKm,
            activity.moving_time,
            activity.start_date_local,
            activity.type,
          ]
        );
        syncedCount++;
      } catch (insertErr) {
        // Duplicate entry, skip
        if (insertErr.code !== "ER_DUP_ENTRY") {
          throw insertErr;
        }
      }
    }

    conn.release();
    return { message: `Synced ${syncedCount} activities`, count: syncedCount };
  } catch (err) {
    throw new Error(`Activity sync failed: ${err.message}`);
  }
};

module.exports = {
  exchangeCodeForTokens,
  refreshAccessToken,
  getValidAccessToken,
  fetchAthleteActivities,
  syncActivities,
};
