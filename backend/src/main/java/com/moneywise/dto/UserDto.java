package com.moneywise.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Email is required", groups = Registration.class)
    @Email(message = "Invalid email format", groups = Registration.class)
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;

    // Validation groups
    public interface Registration {}
}
