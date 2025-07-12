package com.moneywise.controller;

import com.moneywise.dto.BudgetDto;
import com.moneywise.model.Budget;
import com.moneywise.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "http://localhost:3000")
public class BudgetController {
    @Autowired
    private BudgetService budgetService;

    @PostMapping
    public ResponseEntity<Budget> createBudget(@Valid @RequestBody BudgetDto budgetDto) {
        return ResponseEntity.ok(budgetService.createBudget(budgetDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Budget> getBudget(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudgetById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Budget>> getUserBudgets(@PathVariable Long userId) {
        return ResponseEntity.ok(budgetService.getUserBudgets(userId));
    }

    @GetMapping("/user/{userId}/category/{category}")
    public ResponseEntity<Budget> getUserBudgetByCategory(
            @PathVariable Long userId,
            @PathVariable String category) {
        return ResponseEntity.ok(budgetService.getUserBudgetByCategory(userId, category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(
            @PathVariable Long id,
            @Valid @RequestBody BudgetDto budgetDto) {
        return ResponseEntity.ok(budgetService.updateBudget(id, budgetDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok().build();
    }
}
