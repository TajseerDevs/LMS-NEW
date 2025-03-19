import axios from "axios"


export const axiosObj = axios.create({
  
  baseURL: "http://localhost:5500/api/v1",

});