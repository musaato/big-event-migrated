package com.musashi.interceptors;

import com.musashi.utils.JwtUtil;
import com.musashi.utils.ThreadLocalUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;

@Component // Inject LoginInterceptor object into IoC container, and will be @Autowired to "WebConfig"
public class LoginInterceptor implements HandlerInterceptor {

    @Autowired // use injected StringRedisTemplate object in IoC container, fetch token from redis.
    private StringRedisTemplate stringRedisTemplate;

    @Override // everything is included in HttpServletRequest.
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // validate JWT token, then register in config/WebConfig
        String token = request.getHeader("Authorization");
        try {
            // fetch token from redis to match request token.
            ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();
            String redisToken = operations.get(token);// get redis token by request token.
            if(redisToken==null){
               // if redisToken doesn't exist, throw exception, goes to catch block
               throw new RuntimeException();
            }  //if redisToken exists in redis,then it's a valid request token.


            Map<String, Object> claims = JwtUtil.parseToken(token);
            // check ThreadLocalUtil class in utils folder
            // store business data into ThreadLocal, for controllers, business and DAO use.
            // set claims into ThreadLocal
            ThreadLocalUtil.set(claims); // usage: UserController

            return true; // validated and let pass
        } catch (Exception e) {
            // fail. set http response status code 401
            response.setStatus(401);
            return false; // block access
        }
    }

    // when request is done, remove ThreadLocal.
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // remove data stored in ThreadLocal
        ThreadLocalUtil.remove(); // prevent Memory leak
    }
}
