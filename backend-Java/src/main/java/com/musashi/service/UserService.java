package com.musashi.service;

import com.musashi.pojo.User;

public interface UserService {

    // match user by username
    User findByUserName(String username);

    // sign up user
    void register(String username, String password);

    // update user info
    void update(User user);

    // update user avatar
    // invoked by updateAvatar() in userController class
    void updateAvatar(String avatarUrl);

    // update user password
    void updatePwd(String newPwd);
}
