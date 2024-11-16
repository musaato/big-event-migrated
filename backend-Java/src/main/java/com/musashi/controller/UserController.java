package com.musashi.controller;

import com.musashi.pojo.Result;
import com.musashi.pojo.User;
import com.musashi.service.UserService;
import com.musashi.utils.JwtUtil;
import com.musashi.utils.Md5Util;
import com.musashi.utils.ThreadLocalUtil;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.URL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Validated // for User object username & password string validation within this class, collaborates with "@Pattern" annotation.
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired // use injected StringRedisTemplate object in IoC container, store user-sent token to redis by login()
    private StringRedisTemplate stringRedisTemplate;

    // sign up method
    @PostMapping("/register")
    public Result register(@Pattern(regexp = "^\\S{5,16}$") String username, @Pattern(regexp = "^\\S{5,16}$") String password){
        // check if username exists
           User user = userService.findByUserName(username);
        // if username not exist then sign up
        if(user==null){
            // userName is not occupied, then sign up user
            userService.register(username,password);
            return Result.success();
        }else {
            // userName is occupied, return user exists prompt
           return Result.error("Username is taken");
        }
    }

    // sign in method
    @PostMapping("/login")
    public Result<String> login(@Pattern(regexp = "^\\S{5,16}$") String username, @Pattern(regexp = "^\\S{5,16}$") String password){
        // query database by "username"
        User loginUser = userService.findByUserName(username);
        // check whether the user exist or not
        if(loginUser==null){
            return Result.error("Username is not found.");
        }
        // if user exist, validate password.
        // Since loginUser.password is encrypted, need to encrypt password posted to match 2 passwords.
        if(Md5Util.getMD5String(password).equals(loginUser.getPassword())){
            // sign in successfully
            // generate JWT token
            Map<String,Object> claims = new HashMap<>();
            claims.put("id", loginUser.getId());
            claims.put("username", loginUser.getUsername());
            String token = JwtUtil.genToken(claims);

            // store token to redis
            ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();
            operations.set(token,token,10, TimeUnit.DAYS); // set redis token-token as key-value, and assign expire time equals token expire time(10 days).
            // LoginInterceptor fetches request token from second time, need to be matched with redis token.

            return Result.success(token); // generate JWT token later
        }
        return Result.error("Wrong password.");
    }

    // fetch user detail info. get JWT token from request header
    @GetMapping("/userInfo")
    // parameter commented and switch to ThreadLocal to fetch data from Interceptor
    public Result<User> userInfo(/*@RequestHeader(name = "Authorization") String token*/){
      // query user by username
      // token commented and switch to ThreadLocal to fetch data from Interceptor
      // check preHandle() in LoginInterceptor class.
        /* Map<String, Object> map = JwtUtil.parseToken(token);
        String username =(String) map.get("username"); // cast user object down to String */

        Map<String,Object> map= ThreadLocalUtil.get(); // fetch token set by LoginInterceptor class
        String username = (String)map.get("username");

        User user = userService.findByUserName(username); // userService is global variable autowired above
        return Result.success(user);
    }

    // get request data to update user info
    // trigger User attributes validation(@NotNull..) when User object annotated @Validated
    @PutMapping("/update")  // @RequestBody indicates Spring MVC will read request body and pass it to user parameter
    public Result update(@RequestBody @Validated User user){ // User object to store request data
         userService.update(user);
         return Result.success();
    }

    // update user avatar
    @PatchMapping("/updateAvatar") // "patch" only update part of data
    // @URL annotation will validate avatarUrl string.
    public Result updateAvatar(@RequestParam @URL String avatarUrl){ // get request parameter and store into avatarUrl
       userService.updateAvatar(avatarUrl);
       return  Result.success();
    }

    // update user password
    // define Map collection to receive old password, new password.
    // MVC framework will convert JSON object into Map object automatically.
    @PatchMapping("/updatePwd") // @RequestBody indicates Spring MVC to read request body and pass it to Map parameters
    public Result updatePwd(@RequestBody Map<String,String> params, @RequestHeader("Authorization") String token){ // "token" added for redis token
       // validate parameters manually, since @Validated not capable to handle Map class
        String oldPwd= params.get("old_pwd");
        String newPwd = params.get("new_pwd");
        String rePwd = params.get("re_pwd");
        // 1. not null and empty
        if(!StringUtils.hasLength((oldPwd))||!StringUtils.hasLength((newPwd))||!StringUtils.hasLength((rePwd))){
            return Result.error("invalid parameters"); // if one of parameters is empty, failed.
        }
        // 2.validate old password
        // 2.1 call userService to fetch password by user id
        Map<String,Object> map = ThreadLocalUtil.get();
        String username = (String) map.get("username");
        User loginUser = userService.findByUserName(username);
        loginUser.getPassword();
        // 2.2 encrypt client-passed password  to match fetched password from Database
        if(!loginUser.getPassword().equals(Md5Util.getMD5String(oldPwd))){
            return Result.error("Wrong original password");
        }
        // 2.3 validate newPwd equals rePwd
        if (!newPwd.equals(rePwd)){
            return Result.error("New passwords inconsistent ");
        }
        // 3. invoke service layer to update password
        userService.updatePwd(newPwd);

        // if update password successfully, need to delete and revoke original token stored in redis.
        ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();
        operations.getOperations().delete(token); // delete token stored in redis

        return Result.success();
    }

}
