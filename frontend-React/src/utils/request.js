// axios encapsulates http requests & responses

import axios from "axios"
import { message } from "antd"
import { getToken } from "./token"
import router from "@/router"

const http = axios.create({
    // baseURL: "http://localhost:8080",
    // equals http://localhost:3000/api below
    baseURL: "/api",
    timeout: 5000
})

// add request interceptors
http.interceptors.request.use((config) => {
    // console.log("config in request interceptor ", config)
    const token = getToken()
    if (token) {
        //config.headers.Authorization = `Bearer ${token}`
        config.headers.Authorization = `${token}`
    }
    return config
}, (error) => {
    // console.log("error in request interceptor ", error)
    return Promise.reject(error)
})

// response interceptors
http.interceptors.response.use((response) => {
    /*  const statusCode = response.status;
        console.log("response status code: ", statusCode) */

    // Successful responses(2xx) will trigger this method.
    // handle response data
    const res = response.data
    if (res.code === 0) { // 0 success, 1 error
        return res
    }

    // when code is 1(failed)
    // console.log("response interceptor error result: ", res)
    message.error(res.message ? res.message : "service error")

    // set asynchronous action status to "failed"
    return Promise.reject(res)

}, (error) => {
    // Non-successful responses will trigger this method
    if (error.response.status === 401) {
        // console.log("error object: ", error)
        message.error("please sign in.")
        // redirect to sign in page
        router.navigate("/login") 
    }
    else {
        message.error("service error")
    } 
    //return Promise.reject(error)
}
)

// set alias as request in /utils/index.js
export { http }