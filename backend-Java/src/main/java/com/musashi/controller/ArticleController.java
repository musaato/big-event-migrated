package com.musashi.controller;

// For Article Management

import com.musashi.pojo.Article;
import com.musashi.pojo.PageBean;
import com.musashi.pojo.Result;
import com.musashi.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/article")  // when accessing other interfaces, need to validate user is legal or not(login validation)
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    // add article.  localhost:8080/article
    @PostMapping
    public Result add(@RequestBody @Validated(Article.Add.class) Article article){
       articleService.add(article);
       return  Result.success();
    }

    // fetch all Articles and paging.
    // localhost:8080/article?pageNum=1&pageSize=3&categoryId=3&status=drafted
    @GetMapping
    public Result<PageBean<Article>> list(
            Integer pageNum,
            Integer pageSize,
            @RequestParam(required = false)  Integer categoryId,
            @RequestParam(required = false)String status

    ){
        PageBean<Article> pb = articleService.list(pageNum,pageSize,categoryId,status);
        return Result.success(pb);
    }

    // update article by article ID.localhost:8080/article
    @PutMapping
    public Result update(@RequestBody @Validated(Article.Update.class) Article article){
        articleService.update(article);
        return Result.success();

    }

    // Get article detail by article ID. localhost:8080/article/detail?id=3
    @GetMapping("/detail")
    public Result<Article> detail(Integer id){
        Article article = articleService.findById(id);
        return Result.success(article);


    }

    // delete article by article ID
    @DeleteMapping // localhost:8080/article?id=5
    public Result delete(Integer id){
        articleService.deleteById(id);
        return Result.success();
    }


}
