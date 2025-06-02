export async function handler(event) {
  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': 'session=; Path=/; HttpOnly; Max-Age=0; Secure; SameSite=Lax',
    },
    body: JSON.stringify({ success: true }),
  };
}
