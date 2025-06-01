export async function handler(event) {
  try {
    const { pid, uid, caption } = JSON.parse(event.body);

    console.log("Received post data:", { pid, uid, caption });

    const USR_DB = process.env.USR_DB;
    if (!USR_DB) {
      throw new Error("Missing USR_DB environment variable");
    }

    const res = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/post/edit?pid=${pid}&uid=${uid}&caption=${encodeURIComponent(caption)}&auth=${USR_DB}`);

    const text = await res.text();

    if (!res.ok) {
      console.error("Cloudflare Worker returned non-OK status:", text);
      return {
        statusCode: res.status,
        body: text
      };
    }

    const data = JSON.parse(text);

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
