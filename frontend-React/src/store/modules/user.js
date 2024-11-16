// manage states related to user

import { createSlice } from "@reduxjs/toolkit"
import { setToken as _setToken, getToken, removeToken } from "@/utils"
import { userSignInService, userSignUpService, userInfoService } from "@/api/user"
//import qs from "qs"

const userStore = createSlice({
    name: "user",
    // to set states fetched from backend or stored in local(logged-in).
    initialState: {
        // if exists in local storage get it, otherwise undefined
        token: getToken() || '',
        userInfo: {}

    },

    // methods that modify states in store
    reducers: {
        setToken(state, action) {
            state.token = action.payload
            // set token in local storage
            _setToken(action.payload)
        },
        setUserInfo(state, action) { // used in fetchUserInfo below
            state.userInfo = action.payload
        },
        clearUserInfo(state) {
            // clear token in redux
            state.token = ''
            // clear user info data in redux
            state.userInfo = {}
            // clear local token
            removeToken()
        }
    }
})

// actionCreator
const { setToken, setUserInfo, clearUserInfo } = userStore.actions

// reducer function
const userReducer = userStore.reducer

// encapsulated asynchronous method that fetch token by logging in.
const fetchLogin = (loginForm) => {
    // const path = "/user/login/username=" + username + "&password=" + password
    return async (dispatch) => {

        try {
            // 1st way to send request
            // UrlSearchParams converts  application/json form to application/x-www-form-urlencoded form
            const res = await userSignInService(loginForm)

            //-----------------------------------
            // 2nd way to send request
            // const res = await request.post(path)
            // const res = await request.post("/user/login", loginForm) // loginForm is an application/json object

            /* console.log("begin fetchLogin try block ")
            const res = await request.post("/user/login", qs.stringify(
                loginForm
            ), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            },) */
            //---------------------------------

            // set response token data into redux. 
            if (res.data) {
                dispatch(setToken(res.data))
                // console.log("token set.")
            }

            if (res.code === 0) { // 0 success, 1 error
                return res
            }

        } catch (error) {
            return Promise.reject(error)
        }
    }
}


const fetchSignUp = (signUpForm) => {

    return async () => {

        //UrlSearchParams converts application/json to application/x-www-form-urlencoded
        try {
            const res = await userSignUpService(signUpForm)
            return res

        } catch (error) {
            return Promise.reject(error)
        }
        // backend doesn't generate token after signup. No need to store token and user info to local or redux.
    }

}

// asynchronous method fetch user info.
const fetchUserInfo = () => {

    return async (dispatch) => {

        try {
            // 1. send asynchronous request
            const res = await userInfoService()
            // console.log("userInfo Object: ", res)
            // 2. submit synchronous action to store token
            dispatch(setUserInfo(res.data))// data: {id,email,username, nickname,userPic, createTime, updateTime}
        } catch (error) {
            return Promise.reject(error)
        }

    }
}

export { setToken, fetchLogin, fetchSignUp, fetchUserInfo, clearUserInfo }

export default userReducer