package com.musashi;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.junit.jupiter.api.Test;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

// To generate JWT
// Will throw exception when falsifying JWT header,payload or signature(secret key).
// Also throw token expired exception when it's expired.
public class JwtTest {

    @Test // indicates it's a test method below
    public void testGen(){ // test generate JWT
        Map<String, Object> claims = new HashMap<>();
        claims.put("id",2);
        claims.put("username","musashi");
      // generate JWT. in method chaining.
        String token =JWT.create()
                .withClaim("user",claims) // add payload, using Map collection since user has a lot of attributes(id,name..)
                .withExpiresAt(new Date(System.currentTimeMillis()+1000*3600*12)) // add expire date
                .sign(Algorithm.HMAC256("toshinori")); // assign algorithm and config secret key

        System.out.println(token);
    }

/*    @Test
    public void testParse(){ // test parse JWT
        // set a string variable to simulate token passed by user request.
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
                "eyJ1c2VyIjp7ImlkIjoyLCJ1c2VybmFtZSI6Im11c2FzaGkifSwiZXhwIjoxNzE5MzQ5NTE5fQ." +
                "KHKBF-YGzjVphlKJXElavcU89nrsSw5Rb0kd2CrCqC4";
        // call API to validate this token
        JWTVerifier jwtVerifier = JWT.require(Algorithm.HMAC256("musashi")).build();// require and build a JWT validator
        // verify token and generate(decode) a JWT object has been parsed
        DecodedJWT decodedJWT = jwtVerifier.verify(token);
        Map<String, Claim> claims = decodedJWT.getClaims();// fetch all payload

        // output {exp=1719349519, user={"id":2,"username":"miyamoto"}}
        //System.out.println("Gotten claims "+claims);

        // output {"id":2,"username":"miyamoto"}
        System.out.println(claims.get("user")); // if got the right user, then parse successfully.

    }*/

}
