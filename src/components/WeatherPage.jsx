import React, { useState } from "react";

export const WeatherPage = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);

  const fetchLatLong = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2b2247e2b1d47ffbf92df4b79d448125`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("City Data", data);
      setWeather(data);
      return true;
    } catch (error) {
      console.error(
        "Error in fetching latitude and longitude details: ",
        error
      );
      return false;
    }
  };

  const fetchForecast = async () => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=2b2247e2b1d47ffbf92df4b79d448125`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.list);
      const requiredData = data.list.filter((singleData, index) => {
        return index % 4 === 0 && index % 8 !== 0;
      });
      console.log("City Forecast", requiredData);
      setForecast(requiredData);
      return true;
    } catch (error) {
      console.error("Error in fetching forecast: ", error);
    }
  };

  const convertFahrenheitToCelsius = (kelvin) => {
    return kelvin - 273.15;
  };

  const handleClick = async () => {
    if (city.length === 0) {
      console.log("City can't be empty");
    } else {
      await fetchLatLong();
      await fetchForecast();
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px"}}>
      <input
        placeholder="Enter city name"
        onChange={(e) => {
          setCity(e.target.value);
          setWeather({});
          setForecast([]);
        }}
        value={city}
        style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
      />
      <button
        onClick={handleClick}
        style={{
          padding: "10px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Get Details
      </button>
      {weather.cod === "404" ? (
        <h1>404: City Not Found</h1>
      ) : (
        <div>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "20px",
              marginTop: "20px",
            }}
          >
            Weather:{" "}
            {weather.weather?.[0]?.description.toUpperCase() ||
              "Description not available"}
          </p>
          <p>
            Temperature:{" "}
            {weather.main?.temp
              ? convertFahrenheitToCelsius(weather.main.temp).toFixed(2)
              : 0}{" "}
            Celsius
          </p>
          <p>Humidity: {weather.main?.humidity || 0} %</p>
          <p>Wind Speed: {weather.wind?.speed || 0} m/s</p>
          <ul style={{ listStyleType: "none"}}>
            {forecast.length > 0 ? (
              forecast.map((data, index) => (
                <li
                  key={index}
                  style={{
                    marginTop: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "10px",
                  }}
                >
                  <p style={{ fontWeight: "bold" }}>Day {index + 1}</p>
                  <p>
                    Weather:{" "}
                    {data.weather[0].description.toUpperCase() ||
                      "Description not available"}
                  </p>
                  <p>
                    Temperature:{" "}
                    {convertFahrenheitToCelsius(data.main.temp).toFixed(2)}
                  </p>
                </li>
              ))
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #ccc",
                }}
              >
                <strong>
                  <p>No forecast available</p>
                </strong>
              </div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
