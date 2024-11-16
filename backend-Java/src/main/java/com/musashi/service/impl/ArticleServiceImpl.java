package com.musashi.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.musashi.mapper.ArticleMapper;
import com.musashi.pojo.Article;
import com.musashi.pojo.PageBean;
import com.musashi.service.ArticleService;
import com.musashi.utils.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleMapper articleMapper;

    // newly add article
    @Override
    public void add(Article article) {
        // add createTime and updateTime to Article object for newly-created record
        article.setCreateTime(LocalDateTime.now());
        article.setUpdateTime(LocalDateTime.now());
        // get signed in user id, and set it as Create-user
        Map<String,Object> map = ThreadLocalUtil.get();
        Integer userId = (Integer) map.get("id");
        article.setCreateUser(userId);
        articleMapper.add(article);
    }

    // fetch all Articles and paging
    @Override
    public PageBean<Article> list(Integer pageNum, Integer pageSize, Integer categoryId, String status) {
        // generate PageBean object
        PageBean<Article> pb = new PageBean<>();

        // paging query by using MyBatis PageHelper(import in pom.xml)
        // will add sql statements of pageNum and pageSize to Mapper sql. no need to pass to mapper list()
        PageHelper.startPage(pageNum,pageSize);

        // fetch all articles by userId and call mapper
        Map<String,Object> map = ThreadLocalUtil.get(); // get userId from requestBody token
        Integer userId = (Integer) map.get("id");
        List<Article> as =articleMapper.list(categoryId,status,userId);
        // Page class offers method that can fetch article total and current page data after PageHelper paging query.
        // if we don't cast down, super-class(List<>) object can't call distinctive subclass(Page<>) methods.
        Page<Article> p = (Page<Article>) as;

        // load data into PageBean object
        pb.setTotal(p.getTotal());
        pb.setItems(p.getResult());
        return pb;
    }

    // update article
    @Override
    public void update(Article article) {
        article.setUpdateTime(LocalDateTime.now());
        articleMapper.update(article);

    }

    // get article detail by article ID.
    @Override
    public Article findById(Integer id) {
        Article article = articleMapper.findById(id);
        return article;

    }

    // delete article by article ID
    @Override
    public void deleteById(Integer id) {
      articleMapper.deleteById(id);
    }
}
