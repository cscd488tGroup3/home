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

    // Delete from all relevant tables/APIs
    const endpoints = [
      `https://astro-d1-integration.ecrawford4.workers.dev/api/delete?uid=${username}&auth=${process.env.USR_DB_W}`,
      `https://astro-d1-integration.ecrawford4.workers.dev/api/admin/delete?uid=${username}&auth=${process.env.USR_DB_W}`,
      `https://astro-d1-integration.ecrawford4.workers.dev/api/priv/delete?uid=${username}&auth=${process.env.USR_DB_W}`,
    ];

    // Run all deletes in parallel
    const results = await Promise.all(
      endpoints.map((url) => fetch(url, { method: "DELETE" }))
    );

    // Check if all deletes succeeded
    if (results.every((res) => res.status === 200)) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Account deleted" }),
      };
    } else {
      const errors = await Promise.all(results.map((res) => res.text()));
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to delete account", errors }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error", error: err.message }),
    };
  }
};