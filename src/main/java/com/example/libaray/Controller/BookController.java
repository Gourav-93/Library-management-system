package com.example.libaray.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.libaray.Entity.Book;
import com.example.libaray.Repository.BookRepository;


@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    BookRepository bookRepository;

    @GetMapping
    public List<Book> getAll(){
        return bookRepository.findAll();
    }

    @GetMapping("/{id}")
    public Book getById(@PathVariable Long id){
        return bookRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Book add(@RequestBody Book book){
        return bookRepository.save(book);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){

        bookRepository.deleteById(id);

        return "Deleted";
    }

}