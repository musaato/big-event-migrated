package com.musashi.mapper;

import com.musashi.pojo.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface UserMapper {

    // add findByUserName()
    @Select("select * from user where username=#{username}")
    User findByUserName(String username);

    // newly add user. call now() of database to get current time
    @Insert("insert into user(username,password,create_time,update_time)" +
            "values(#{username},#{password},now(),now())")
    void add(String username, String password);

    // update user info passed from UserServiceImpl
    @Update("update user set nickname=#{nickname},email=#{email},update_time=#{updateTime}"+
              "where id=#{id}")
    void update(User user);

    // update user avatar, update_time will use sql now() function
    @Update("update user set user_pic=#{avatarUrl}, update_time= now() where id = #{id}")
    void updateAvatar(String avatarUrl, Integer id);


    // update user password
    @Update("update user set password=#{newPwd}, update_time= now() where id = #{id}")
    void updatePwd(String newPwd, Integer id);
}
