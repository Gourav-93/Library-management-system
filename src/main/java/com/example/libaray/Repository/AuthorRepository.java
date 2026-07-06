package com.example.libaray.Repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.libaray.Entity.Author;


public interface AuthorRepository extends JpaRepository<Author,Long> {
    
}
