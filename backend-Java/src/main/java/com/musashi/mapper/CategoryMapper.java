package com.musashi.mapper;

import com.musashi.pojo.Category;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface CategoryMapper {


    // add article category
    @Insert("insert into category(category_name,category_alias,create_user,create_time,update_time)" +
            " values(#{categoryName},#{categoryAlias},#{createUser},#{createTime},#{updateTime}) ")
    void add(Category category);

    // query all article categories by userId
    @Select("select * from category where create_user=#{userId}")
    List<Category> list(Integer userId);

    // fetch category detail by category ID
    @Select("select * from category where id =#{id}")
    Category findById(Integer id);

    // update article category
    @Update("update category set category_name=#{categoryName},category_alias=#{categoryAlias},update_time=#{updateTime} " +
            "where id =#{id}")
    void update(Category category);

    // delete article category by category ID
    @Delete("delete from category where id=#{id}")
    void delete(Integer id);
}
