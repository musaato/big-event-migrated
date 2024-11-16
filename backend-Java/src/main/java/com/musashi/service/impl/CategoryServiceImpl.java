package com.musashi.service.impl;

import com.musashi.mapper.CategoryMapper;
import com.musashi.pojo.Category;
import com.musashi.service.CategoryService;
import com.musashi.utils.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;
    @Override
    public void add(Category category) {
        // add attributes(CreateTime,update time, userId) to Category object
        category.setCreateTime(LocalDateTime.now());
        category.setUpdateTime(LocalDateTime.now());

        // fetch user id in Map object by using ThreadLocal.get()
        Map<String,Object> map =ThreadLocalUtil.get();
        Integer userId = (Integer) map.get("id");
        category.setCreateUser(userId);

        categoryMapper.add(category);
    }

    // fetch all categories by userId
    @Override
    public List<Category> list() {
        // query by user id
        Map<String,Object> map =ThreadLocalUtil.get();
        Integer userId = (Integer) map.get("id");
        return categoryMapper.list(userId);
    }

    // fetch category detail by category ID
    @Override
    public Category findById(Integer id) {
        Category cate = categoryMapper.findById(id);
        return cate;
    }

    // update article category
    @Override
    public void update(Category category) {
      // add update time attribute to Category object
      category.setUpdateTime(LocalDateTime.now());
      categoryMapper.update(category);

    }

    // delete article category by category ID
    @Override
    public void delete(Integer id) {
      categoryMapper.delete(id);
    }
}
