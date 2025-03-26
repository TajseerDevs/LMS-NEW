import axios from "axios"


export const axiosObj = axios.create({
  
  baseURL: "http://10.10.30.40:5500/api/v1",

});