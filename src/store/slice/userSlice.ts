// ✅ redux-toolkit ke functions import kiye
// createSlice => Redux state slice banane ke liye helper function
// PayloadAction => type-safe action payload define karne ke liye (TypeScript support)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


// ✅ UserState interface
// Ye batata hai ki hamare user slice ka state kaisa dikhega
// Iska use TypeScript type checking ke liye hota hai
interface UserState {
    user : any | null;               // User object ya null (agar user logged in nahi hai)
    isEmailVerified : boolean;       // User ki email verify hai ya nahi (true/false)
    isLoginDialogOpen : boolean;     // Login dialog open hai ya nahi (UI ke liye)
    isLoggedIn : boolean;            // User logged in hai ya nahi
}

// ✅ initialState object
// Ye hamare user slice ka initial/default state hai
// Redux store start hote hi ye values set hongi
const initialState : UserState = {
    user: null,                       // Default: koi user logged in nahi
    isEmailVerified: false,           // Default: email verify nahi
    isLoginDialogOpen: false,         // Default: login dialog close
    isLoggedIn: false                  // Default: user logged out
}


// ✅ userSlice banana using createSlice
// createSlice Redux Toolkit ka function hai jo reducer + actions + slice sab bana deta hai
const userSlice = createSlice ({
    // name: slice ka unique name jo Redux DevTools mein bhi dikhega
    name: 'user',                     

    // initialState: jo state se start hoga
    initialState,                     

    // reducers: yahan hum sare actions define karte hain
    reducers:{                        

        // ✅ setUser reducer
        // Ye action user object ko state mein store karega
        // Jab user login kare ya profile load ho, tab is action ko dispatch karte hain
        setUser : (state, action:PayloadAction<any>)=>{
            // action.payload mein new user data aayega
            state.user = action.payload; 
        },

        // ✅ setEmailVerified reducer
        // Ye user ki email verification status ko update karega
        // Jab user email verify kare, is action ko dispatch karte hain
        setEmailVerified :(state, action:PayloadAction<any>)=>{
            // action.payload mein true/false aayega
            state.isEmailVerified = action.payload; 
        },

        // ✅ logout reducer
        // Jab user logout kare, sab user related state ko reset karega
        logout:(state)=>{
            state.user = null;                  // User data hata do
            state.isEmailVerified = false;      // Email verification status bhi hata do
            state.isLoggedIn = false;           // User ko logged out mark karo
        },

        // ✅ toggleLoginDialog reducer
        // UI ke liye - login dialog ko open/close toggle karta hai
        toggleLoginDialog: (state)=>{
            // Current state ka ulta kar do (true->false, false->true)
            state.isLoginDialogOpen = !state.isLoginDialogOpen; 
        },

        // ✅ authStatus reducer
        // User ko logged in mark karega
        // Ye sirf isLoggedIn flag ko true karega
        authStatus:(state)=>{
            state.isLoggedIn = true; 
        }

    }
});


// ✅ Redux Toolkit slice automatically actions generate karta hai
// In actions ko export karte hain taaki components mein dispatch kiya ja sake
export const { setUser, setEmailVerified, logout, toggleLoginDialog, authStatus } = userSlice.actions;


// ✅ Slice ka reducer export karte hain
// Is reducer ko store mein combineReducers ke through use kiya jaata hai
export default userSlice.reducer;
