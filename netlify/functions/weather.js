export async function handler(event) {
  console.log("Received event:", event);

  const API_KEY = process.env.API_KEY;

  const body = JSON.parse(event.body);
  const cityName = body.cityName;
  const units = body.units;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=${units}&appid=${API_KEY}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenWeather API error:", response.status, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Failed to fetch weather data", details: errorText }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", details: err.message }),
    };
  }
}