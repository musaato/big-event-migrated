package com.musashi.service;

import com.musashi.pojo.Category;

import java.util.List;

public interface CategoryService {

    // newly add Category
    void add(Category category);

    // fetch all article categories by userId
    List<Category> list();

    // fetch article category detail by category ID
    Category findById(Integer id);

    // update article category
    void update(Category category);

    // delete article category by category ID
    void delete(Integer id);
}
