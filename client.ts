import axios from "axios";

export const api = axios.create({
  baseURL: "http://172.16.3.106:5044",
  headers: {
    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJldmVudC1jaGVjaGVja2luLWFwaSIsInN1YiI6Im9wZXJhdG9yIiwiZXZlbnRJZCI6ImV2dF8xMjMiLCJpYXQiOjE3MjQ4ODAwMDAsImV4cCI6MTk5OTk5OTk5OX0.8b7cRrJq1u8hQWmF2Z0k3yV5aN4pX6sT9uE1L3cB7Dg`,
    "Content-Type": "application/json",
  },
});
