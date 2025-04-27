
import axios from "axios";
import { BASE_URL } from "../config";

export async function getServers(category?: number) {
  const url = `${BASE_URL}/servers/select/`;
  const route = category ? `${url}?category=${category}` : url;
  const resp = await axios.get(route);
  return resp.data;
}
