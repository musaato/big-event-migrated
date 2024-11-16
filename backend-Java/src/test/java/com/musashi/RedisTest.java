package com.musashi;

// To test Redis


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.concurrent.TimeUnit;

// if @SpringBootTest annotation added to test class,
// before doing unit test, will initialize Spring container first.
// instantiating starter object(e.g. StringRedisTemplate)
@SpringBootTest

public class RedisTest {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Test
    public void testSet(){
        // call "StringRedisTemplate" object to store a key-value pair into Redis.
        // object along redis starter will be injected into IoC container as application starts

        ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();
        // store key-value
        operations.set("username","musashi");
        operations.set("id","1",15, TimeUnit.SECONDS); // set "id" key life cycle to 15 seconds.

    }

    @Test
    public void testGet(){
        // get key-value from redis
        ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();
        System.out.println(operations.get("username"));

    }

}
