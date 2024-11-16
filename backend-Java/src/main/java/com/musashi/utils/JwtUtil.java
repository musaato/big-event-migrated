package com.musashi.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import java.util.Date;
import java.util.Map;

public class JwtUtil {

    private static final String KEY = "musashi";

    // receive service data then generate and return JWT
    // encapsulate entity class object "User" into Map
    public static String genToken(Map<String, Object> claims) {
        return JWT.create()
                .withClaim("claims", claims)
                .withExpiresAt(new Date(System.currentTimeMillis()+1000*3600*24*10)) // expired in 10 days
                .sign(Algorithm.HMAC256(KEY));
    }

    // receive and validate token, then return service data
    // check testParse() in JwtTest in test package
    public static Map<String, Object> parseToken(String token) {
        return JWT.require(Algorithm.HMAC256(KEY))
                .build()
                .verify(token)
                .getClaim("claims")
                .asMap();
    }

}
