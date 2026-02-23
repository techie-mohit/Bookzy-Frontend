// ================= REDUX STORE SETUP =================

// configureStore Redux Toolkit ka helper function hai
// Ye Redux store create karta hai with:
// - reducers
// - middleware
// - devtools support
// - better default configuration
import { configureStore } from "@reduxjs/toolkit";


// setupListeners RTK Query ka utility function hai
// Ye automatic refetch enable karta hai jab:
// - browser tab focus hota hai
// - internet reconnect hota hai
import { setupListeners } from "@reduxjs/toolkit/query";


// ================= REDUX PERSIST SETUP =================

// storage redux-persist ka storage engine hai
// Default: browser localStorage use hota hai
// Isse Redux state browser refresh ke baad bhi save rehta hai
import storage from "redux-persist/lib/storage";

import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE
} from "redux-persist";


// ================= SLICE REDUCERS =================

// Ye reducers app ke different parts ka state manage karte hain

// User authentication and profile state
import userReducer from "./slice/userSlice";

// Shopping cart state
import cartReducer from "./slice/cartSlice";

// Wishlist state
import wishlistReducer from "./slice/wishlistSlice";

// Checkout state
import checkoutReducer from "./slice/checkoutSlice";


// ================= RTK QUERY API SLICE =================

// Isme sab API endpoints defined hain
// Ye automatically caching, refetching, and hooks generate karta hai
import { api } from "./api";
import { adminApi } from "./adminApi";


// ================= PERSIST CONFIGURATION =================

// persistConfig define karta hai ki kaunsa state localStorage me save hoga


// USER PERSIST CONFIG
const userPersistConfig = {
  key: 'user',         // localStorage key name
  storage,             // storage engine (localStorage)

  // whitelist = sirf ye fields persist hongi
  whitelist: [
    'user',
    'isEmailVerified',
    'isLoggedIn'
  ]
};


// CART PERSIST CONFIG
const cartPersistConfig = {
  key: 'cart',
  storage,

  // sirf cart items persist honge
  whitelist: [
    'items'
  ]
};


// WISHLIST PERSIST CONFIG
const wishlistPersistConfig = {
  key: 'wishlist',
  storage
};


// CHECKOUT PERSIST CONFIG
const checkoutPersistConfig = {
  key: 'checkout',
  storage
};


// ================= CREATE PERSISTED REDUCERS =================

// persistReducer reducer ko wrap karta hai
// Ye automatically state ko:
// - localStorage me save karega
// - refresh ke baad restore karega

const persistedUserReducer =
  persistReducer(userPersistConfig, userReducer);

const persistedCartReducer =
  persistReducer(cartPersistConfig, cartReducer);

const persistedWishlistReducer =
  persistReducer(wishlistPersistConfig, wishlistReducer);

const persistedCheckoutReducer =
  persistReducer(checkoutPersistConfig, checkoutReducer);



// ================= CREATE REDUX STORE =================

export const store = configureStore({

  reducer: {

    // RTK Query reducer
    // Ye cache, queries, mutations store karta hai
    [api.reducerPath]: api.reducer,
    [adminApi.reducerPath]: adminApi.reducer,


    // Persisted reducers
    user: persistedUserReducer,
    cart: persistedCartReducer,
    wishlist: persistedWishlistReducer,
    checkout: persistedCheckoutReducer
  },


  // ================= MIDDLEWARE =================

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({

      // redux-persist actions ignore kiye gaye
      // kyuki ye non-serializable values use karte hain
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ],
      },

    }).concat(api.middleware) 
    .concat(adminApi.middleware) // RTK Query middleware add kiya
    // Ye handle karta hai:
    // - caching
    // - invalidation
    // - refetch
    // - polling
});



// ================= RTK QUERY LISTENERS =================

// Ye enable karta hai automatic refetch jab:
// - tab focus hota hai
// - internet reconnect hota hai
setupListeners(store.dispatch);



// ================= CREATE PERSISTOR =================

// persistor redux-persist ka controller hai
// Ye manage karta hai:
// - state save karna
// - state restore karna

export const persistor = persistStore(store);



// ================= TYPESCRIPT TYPES =================

// RootState = Redux store ka complete state type
// Isse type-safe selectors ban sakte hain

export type RootState =
  ReturnType<typeof store.getState>;


// AppDispatch = dispatch function ka type
// Isse type-safe dispatch possible hota hai

export type AppDispatch =
  typeof store.dispatch;
