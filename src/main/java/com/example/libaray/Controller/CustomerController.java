package com.example.libaray.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.libaray.Entity.Customer;
import com.example.libaray.Repository.CustomerRepository;



@RestController
@RequestMapping("/customers")
public class CustomerController {

    @Autowired
    CustomerRepository customerRepository;

    @PostMapping
    public Customer add(@RequestBody Customer customer){
        return customerRepository.save(customer);
    }

    @GetMapping
    public List<Customer> getAll(){
        return customerRepository.findAll();
    }
}