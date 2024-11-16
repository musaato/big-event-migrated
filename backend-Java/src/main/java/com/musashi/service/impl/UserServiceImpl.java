package com.musashi.service.impl;

import com.musashi.mapper.UserMapper;
import com.musashi.pojo.User;
import com.musashi.service.UserService;
import com.musashi.utils.Md5Util;
import com.musashi.utils.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;

@Service // inject objects within this class into IoC container
public class UserServiceImpl implements UserService {
    // inject userMapper object from IoC container
    @Autowired
    private UserMapper userMapper;

    // override methods in UserService
    @Override
    public User findByUserName(String username) {
    // call Mapper interface to access database to fetch user data.
      User user =  userMapper.findByUserName(username);
        return user;
    }

    @Override
    public void register(String username, String password) {
     // can't call method in UserMapper,
     // since we must encrypt password first, then call method in UserMapper.
     //  Use MD5 in Md5Util encrypt password.
        String md5String = Md5Util.getMD5String(password);
        // add user
        userMapper.add(username,md5String);

    }

    // update user info passed from UserController
    @Override
    public void update(User user) {
        user.setUpdateTime(LocalDateTime.now()); // set update time
        userMapper.update(user);
    }

    // update user avatar
    @Override
    public void updateAvatar(String avatarUrl) {
        // fetch user ID from token stored in ThreadLocal
        Map<String,Object> map = ThreadLocalUtil.get();
        Integer id = (Integer) map.get("id");
        userMapper.updateAvatar(avatarUrl,id); // add update time by SQL now() time function
    }

    // update user password
    @Override
    public void updatePwd(String newPwd) {
        // update by user ID
        Map<String,Object> map = ThreadLocalUtil.get();
        Integer id = (Integer) map.get("id");
        userMapper.updatePwd(Md5Util.getMD5String(newPwd),id);// encrypt new password then pass to Mapper
    }
}
