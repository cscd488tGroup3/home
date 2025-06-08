export async function handler(event) {
  try {
    const { cid, uid, editComment } = JSON.parse(event.body);

    console.log("Received comment data:", { cid, uid, editComment });

    const USR_DB = process.env.USR_DB;
    if (!USR_DB) {
      throw new Error("Missing USR_DB environment variable");
    }

    console.log("Auth check passed! Preparing to update comment...");

    const res = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/comment/edit?cid=${cid}&uid=${uid}&content=${encodeURIComponent(editComment)}&auth=${USR_DB}`);

    const text = await res.text();

    console.log(text);

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
