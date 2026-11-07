import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isInitialized: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setCredentials: (state,action)=>{
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
            state.isAuthenticated = true
        },
        logout: (state)=>{
            state.user = null
            state.accessToken = null
            state.isAuthenticated = false
        },
        updateAccessToken: (state,action)=>{
            state.accessToken = action.payload
        },
        setAuthInitialized: (state)=>{
            state.isInitialized = true
        }
    }

})

export const {setCredentials , logout , updateAccessToken, setAuthInitialized} = authSlice.actions
export default authSlice.reducer