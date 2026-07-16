package com.example.libaray.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.libaray.Entity.Author;
import com.example.libaray.Repository.AuthorRepository;

@RestController
@RequestMapping("/authors")
public class AuthorController {

    @Autowired
    private AuthorRepository authorRepository;

    @PostMapping
    public Author add(@RequestBody Author author) {
        return authorRepository.save(author);
    }

    @GetMapping
    public List<Author> getAll() {
        return authorRepository.findAll();
    }

    @GetMapping("/{id}")
    public Author getById(@PathVariable Long id) {
        return authorRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        authorRepository.deleteById(id);
        return "Author Deleted Successfully";
    }
}