import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { exp } from "firebase/firestore/pipelines";

interface UserState {
    uid:string| null;
    email: string | null;
    isLoading: boolean;
}
const initialState: UserState = {
    uid: null,
    email: null,
    isLoading: true,
}

const userSlice= createSlice ({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.uid= action.payload.uid;
            state.email = action.payload.email;
        },
        clearUser: (state) => {
            state.uid = null;
            state.email= null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
},
    }
})

export const {setUser, clearUser, setLoading} = userSlice.actions;
export default userSlice.reducer