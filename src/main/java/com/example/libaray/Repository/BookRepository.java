package com.example.libaray.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.libaray.Entity.Book;

public interface BookRepository extends JpaRepository<Book,Long>{
    
}
