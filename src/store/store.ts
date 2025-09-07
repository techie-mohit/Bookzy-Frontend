// ✅ Redux Toolkit se configureStore import kiya hai
// configureStore => Redux store banane ka helper function
import { configureStore } from "@reduxjs/toolkit";

// ✅ RTK Query ke setupListeners utility import kiya
// Ye focus/reconnect pe auto-refetch enable karta hai
import { setupListeners } from "@reduxjs/toolkit/query";

// ✅ redux-persist ka storage import kiya
// Default: browser localStorage use hota hai for persistence
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

// ✅ Apna user slice reducer import kiya
// User authentication aur profile ke state ko manage karta hai
import userReducer from "./slice/userSlice";
import cartReducer from "./slice/cartSlice";
import wishlistReducer from "./slice/wishlistSlice";
import checkoutReducer from "./slice/checkoutSlice";

// ✅ RTK Query API slice import kiya
// Isme sab API endpoints aur auto-generated hooks hote hain
import { api } from "./api";

// ⚠️ Ye line actually zarurat nahi hai - koi use nahi ho raha
// You can safely delete it if you want
import { set } from "react-hook-form";


// ✅ redux-persist ke liye configuration banaya
// Batata hai ki user slice ka kaunsa data persist hoga
const userPersistConfig = {
  key: 'user',            // localStorage mein is key se save hoga
  storage,                // Storage backend (localStorage)
  whiteList: [            // sirf in fields ko save karna hai
    'user',
    'isEmailVerified',
    'isLoggedIn'
  ]
}

const cartPersistConfig = {
  key: 'cart',            // localStorage mein is key se save hoga
  storage,                // Storage backend (localStorage)
  whiteList: [            // sirf in fields ko save karna hai
    'items'
  ]
}


const wishlistPersistConfig = {
  key: 'wishlist',
  storage
}


const checkoutPersistConfig = {
  key: 'checkout',
  storage
}





// ✅ userReducer ko persistReducer ke saath wrap kiya
// Ye user slice ko automatically localStorage mein save/rehydrate karega
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer);
const persistedCheckoutReducer = persistReducer(checkoutPersistConfig, checkoutReducer);


// ✅ Redux Store banaya
export const store = configureStore({
  reducer: {
    // ✅ RTK Query ke reducer ko store mein add kiya
    [api.reducerPath]: api.reducer,       // e.g. "api": RTK Query state

    // ✅ User slice with persistence
    user: persistedUserReducer,       // e.g. "user": Auth data, saved in storage
    cart: persistedCartReducer,       // e.g. "cart": Cart data, saved in storage
    wishlist: persistedWishlistReducer, // e.g. "wishlist": Wishlist data, saved in storage
    checkout: persistedCheckoutReducer // e.g. "checkout": Checkout data, saved in storage
  },

  // ✅ Middleware setup
  // getDefaultMiddleware mein persist ke actions ignore kiye
  // RTK Query ka middleware bhi add kiya
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),            // RTK Query features (caching, invalidation, polling)
});


// ✅ SetupListeners call kiya
// RTK Query ke auto-refetch on focus/reconnect ke liye
setupListeners(store.dispatch);


// ✅ Persistor banaya
// Redux Persist ke liye store ka persistor object
// Ye localStorage se state restore karega
export const persistor = persistStore(store);


// ✅ Redux state aur dispatch ke TypeScript types define kiye
// Type-safe hooks banane ke liye use hote hain
export type RootState = ReturnType<typeof store.getState>;   // store.getState() ka return type
export type AppDispatch = typeof store.dispatch;             // store.dispatch ka type
