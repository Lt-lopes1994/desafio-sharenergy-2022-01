const axios = require("axios");

export default axios.create({
  baseURL: "https://api.spaceflightnewsapi.net/v3",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});
