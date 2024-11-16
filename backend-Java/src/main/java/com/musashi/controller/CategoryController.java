package com.musashi.controller;
// for article category use
import com.musashi.pojo.Category;
import com.musashi.pojo.Result;
import com.musashi.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category") // same link for mapping requests, add() by POST method, list() query by GET method.
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // add Category
    // @Validated "categoryName" and "categoryAlias"  are "Not empty" in controller,
    // whether Database exists not null constraint
    @PostMapping // add() by POST method. localhost:8080/category
    // public Result add(@RequestBody @Validated Category category){
    // switch to interface Add in Category class
    // @RequestBody indicates Spring MVC will convert request JSON into Category object
    public Result add(@RequestBody @Validated(Category.Add.class) Category category){
        categoryService.add(category);
        return Result.success();
    }

    // fetch all categories by userId
    @GetMapping //  query by GET method. localhost:8080/category
    public Result<List<Category>> list(){ // Category objects stored in List
        List<Category>  cate =categoryService.list();
        return Result.success(cate);
    }

    // fetch category detail by category ID
    // pass category id to detail()
    @GetMapping("/detail") // localhost:8080/category/detail?id=2
    public Result<Category> detail(Integer id){ // spring converts object(Category) into JSON string automatically.
        Category cate = categoryService.findById(id);
        return Result.success(cate);
    }

    // update article category
    // @Validated all attributes with validate annotations(@NotNull & @NotEmpty)
    @PutMapping // localhost:8080/category
    // public Result update(@RequestBody @Validated Category category){
    // switch to interface Update in Category class
    public Result update(@RequestBody @Validated(Category.Update.class) Category category){
        categoryService.update(category);
        return Result.success();
    }

    // delete article category by category ID
    @DeleteMapping // localhost:8080/category?id=2
    public Result delete(Integer id){
       categoryService.delete(id);
       return Result.success();
    }
}
