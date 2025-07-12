package com.moneywise.controller;

import com.moneywise.dto.LoginDto;
import com.moneywise.dto.UserDto;
import com.moneywise.model.User;
import com.moneywise.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(
            @Validated(UserDto.Registration.class) @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.createUser(userDto));
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@Valid @RequestBody LoginDto loginDto) {
        if (loginDto.getUsername() == null || loginDto.getUsername().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        try {
            User user = userService.getUserByUsername(loginDto.getUsername());
            if (user != null && user.getPassword().equals(loginDto.getPassword())) { // In a real app, use proper password comparison
                return ResponseEntity.ok(user);
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @Validated(UserDto.Registration.class) @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateUser(id, userDto));
    }
}
