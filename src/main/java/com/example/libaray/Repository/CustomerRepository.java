package com.example.libaray.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.libaray.Entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer,Long> {
    
}
    