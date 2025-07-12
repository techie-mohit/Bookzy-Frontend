// ✅ redux-toolkit/query se do important utilities import kiye hain:
// 1️⃣ createApi - RTK Query ka main function jo API service banata hai
// 2️⃣ fetchBaseQuery - ek built-in baseQuery function jo simple fetch request banata hai
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';


// Ye Redux store mein ek RTK Query API slice banata hai
export const api = createApi({

    // ✅ baseQuery:
    // Ye batata hai ki sab endpoints ki request kaise jayegi
    // fetchBaseQuery ek simplified fetch wrapper hai
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,         // Sab requests isi base URL se jayengi
        credentials: 'include',    // Cookies ko request mein bhejne ke liye
                                   // Useful for authentication (e.g., sessions)
    }),

    // ✅ tagTypes:
    // Ye ek optional config hai
    // RTK Query cache invalidation ke liye tags define karta hai
    // Example mein 'User' tag define kiya hai
    // Iska use refetch/invalidating cache ke liye hota hai
    tagTypes:['User'],

    // ✅ endpoints:
    // Ye function hai jo sab endpoints define karega
    // Builder pattern use karke queries aur mutations banate hain
    // Filhal ye empty hai => koi endpoint nahi define kiya
    endpoints :(builder)=>({
        // ⚠️ abhi yahan koi endpoint nahi likha
        // future mein builder.query ya builder.mutation se endpoints banayenge
    })

})
