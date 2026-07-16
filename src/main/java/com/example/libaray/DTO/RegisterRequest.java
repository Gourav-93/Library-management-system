package com.example.libaray.DTO;

import com.example.libaray.Entity.Role;

import lombok.Data;

@Data
public class RegisterRequest 
{

    private String name;
    private String email;
    private String password;
    private Role role;
    
}
