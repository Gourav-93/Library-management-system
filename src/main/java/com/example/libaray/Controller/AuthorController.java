package com.example.libaray.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.libaray.Entity.Author;
import com.example.libaray.Repository.AuthorRepository;



@RestController
@RequestMapping("/authors")
public class AuthorController {

    @Autowired
    AuthorRepository authorRepository;

    @PostMapping
    public Author add(@RequestBody Author author){
        return authorRepository.save(author);
    }

    @GetMapping
    public List<Author> getAll(){
        return authorRepository.findAll();
    }
}