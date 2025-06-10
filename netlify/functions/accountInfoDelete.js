const fetch = require("node-fetch");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const { username } = JSON.parse(event.body || "{}");

    if (!username || username === "Guest") {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid username" }),
      };
    }

    const apiUrl = `https://astro-d1-integration.ecrawford4.workers.dev/api/delete?uid=${username}&auth=${process.env.USR_DB_W}`;
    const res = await fetch(apiUrl, { method: "DELETE" });

    if (res.status === 200) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Account deleted" }),
      };
    } else {
      const errorText = await res.text();
      return {
        statusCode: res.status,
        body: JSON.stringify({ message: "Failed to delete account", error: errorText }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error", error: err.message }),
    };
  }
};