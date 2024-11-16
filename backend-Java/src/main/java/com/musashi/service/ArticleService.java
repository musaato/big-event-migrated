package com.musashi.service;

import com.musashi.pojo.Article;
import com.musashi.pojo.PageBean;

public interface ArticleService {

    // newly add article
    void add(Article article);

    // fetch all Articles and paging
    PageBean<Article> list(Integer pageNum, Integer pageSize, Integer categoryId, String status);

    // update article
    void update(Article article);

    // get article detail by article ID.
    Article findById(Integer id);

    // delete article by article ID
    void deleteById(Integer id);
}
