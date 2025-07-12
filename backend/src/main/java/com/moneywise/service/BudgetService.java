package com.moneywise.service;

import com.moneywise.dto.BudgetDto;
import com.moneywise.model.Budget;
import com.moneywise.model.User;
import com.moneywise.repository.BudgetRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {
    @Autowired
    private BudgetRepository budgetRepository;
    
    @Autowired
    private UserService userService;

    public Budget createBudget(BudgetDto budgetDto) {
        User user = userService.getUserById(budgetDto.getUserId());
        
        Budget budget = new Budget();
        budget.setUser(user);
        budget.setCategory(budgetDto.getCategory());
        budget.setAmount(budgetDto.getAmount());

        return budgetRepository.save(budget);
    }

    public Budget getBudgetById(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Budget not found"));
    }

    public List<Budget> getUserBudgets(Long userId) {
        User user = userService.getUserById(userId);
        return budgetRepository.findByUser(user);
    }

    public Budget getUserBudgetByCategory(Long userId, String category) {
        User user = userService.getUserById(userId);
        return budgetRepository.findByUserAndCategory(user, category)
                .orElseThrow(() -> new EntityNotFoundException("Budget not found for category: " + category));
    }

    public Budget updateBudget(Long id, BudgetDto budgetDto) {
        Budget budget = getBudgetById(id);
        budget.setCategory(budgetDto.getCategory());
        budget.setAmount(budgetDto.getAmount());
        
        return budgetRepository.save(budget);
    }

    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }
}
