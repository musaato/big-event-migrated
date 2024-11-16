package com.musashi.mapper;

import com.musashi.pojo.Article;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface ArticleMapper {

    // newly add article
    @Insert("insert into article(title,content,cover_img,status,category_id,create_user,create_time,update_time)" +
            " values(#{title},#{content},#{coverImg},#{status},#{categoryId},#{createUser},#{createTime},#{updateTime})")
    void add(Article article);

    // fetch all Articles and paging
    // use dynamic sql statement, use Mapper configuration file under resources/com/musashi/mapper
    // "ArticleMapper.xml" and "ArticleMapper.java" interface must have same name
    // and same path under "java" and "resources" folder
    List<Article> list(Integer categoryId, String status, Integer userId);

    // update article by id
    @Update("update article set title=#{title},content=#{content},cover_img=#{coverImg},status=#{status},category_id=#{categoryId},update_time=#{updateTime}" +
            "where id=#{id}")
    void update(Article article);

    // get article detail by article id.
    @Select("select * from article where id=#{id}")
    Article findById(Integer id);

    // delete article by article id
    @Delete("delete from article where id=#{id}")
    void deleteById(Integer id);
}
