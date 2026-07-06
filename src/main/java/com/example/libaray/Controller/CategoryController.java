package com.example.libaray.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.libaray.Entity.Category;
import com.example.libaray.Repository.CategoryRepository;


@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    CategoryRepository categoryRepository;

    @PostMapping
    public Category add(@RequestBody Category category){
        return categoryRepository.save(category);
    }

    @GetMapping
    public List<Category> getAll(){
        return categoryRepository.findAll();
    }
}