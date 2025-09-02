import axios from "axios";

const judge0Client = axios.create({
  baseURL: process.env.JUDGE0_API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    "x-rapidapi-key": process.env.RAPIDAPI_KEY,
  },
  params: {
    base64_encoded: "true",
  },
});

export default judge0Client; 