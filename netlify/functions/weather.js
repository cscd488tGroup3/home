export async function handler(event) {
    console.log("Received event:", event);

    const API_KEY = process.env.API_KEY;

    const body = JSON.parse(event.body);
    const cityName = body.cityName;
    const units = body.units;

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${units}&appid=${API_KEY}`);

    if (response.ok) {
        return response;
    } else {
        throw new Error("Query failed.");
    }
}