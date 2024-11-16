// use redux to store states in store across modules, such as token.

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./modules/user";

export default configureStore({
    reducer: {
        user: userReducer
    }
})