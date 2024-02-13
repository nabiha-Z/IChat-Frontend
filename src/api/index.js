import axios from "axios";
import Cookies from "js-cookie";

import {
  ALLUSERS,
  AUTHORIZEUSER,
  BASE_URL,
  CONVERSATION,
  LOGINURL,
  LOGOUTURL,
  NEWCONVERSATIONURL,
  OAUTH,
  REGISTERURL,
  USERCHATSURL,
} from "./urls";

const API = axios.create({ baseURL: BASE_URL });
API.interceptors.request.use((req) => {
  if (Cookies.get("token")) {
    req.headers.authorization = `Bearer ${Cookies.get("token")}`;
  }
  return req;
});

export const signup = (userdata) => API.post(REGISTERURL, userdata);
export const signin = (userdata) => API.post(LOGINURL, userdata);
export const oauth = (userdata) => API.post(OAUTH, userdata);
export const signout = () => API.get(LOGOUTURL);
export const authorizeUser = () => API.get(AUTHORIZEUSER);
export const fetchUsers = () => API.get(ALLUSERS);
export const fetchUserChats = () => API.get(USERCHATSURL);
export const fetchConversation = (rid) => API.get(CONVERSATION(rid));
export const createConversation = (userdata) =>
  API.post(NEWCONVERSATIONURL, userdata);
