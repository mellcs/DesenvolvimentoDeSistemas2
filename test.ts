import { api } from "./client";

async function testApi() {
  try {
    const res = await api.get(`/events/${process.env.EVENT_ID}`);
    console.log(res.data);
  } catch (err: any) {
    console.error(err.response?.data || err.message);
  }
}

testApi();
