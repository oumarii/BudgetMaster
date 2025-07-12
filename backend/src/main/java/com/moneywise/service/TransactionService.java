package com.moneywise.service;

import com.moneywise.dto.TransactionDto;
import com.moneywise.model.Transaction;
import com.moneywise.model.User;
import com.moneywise.repository.TransactionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private UserService userService;

    public Transaction createTransaction(TransactionDto transactionDto) {
        User user = userService.getUserById(transactionDto.getUserId());
        
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setType(transactionDto.getType());
        transaction.setAmount(transactionDto.getAmount());
        transaction.setCategory(transactionDto.getCategory());
        transaction.setDescription(transactionDto.getDescription());
        transaction.setTransactionDate(transactionDto.getTransactionDate());

        return transactionRepository.save(transaction);
    }

    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found"));
    }

    public List<Transaction> getUserTransactions(Long userId) {
        User user = userService.getUserById(userId);
        return transactionRepository.findByUser(user);
    }

    public List<Transaction> getUserTransactionsByType(Long userId, Transaction.TransactionType type) {
        User user = userService.getUserById(userId);
        return transactionRepository.findByUserAndType(user, type);
    }

    public List<Transaction> getUserTransactionsByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        User user = userService.getUserById(userId);
        return transactionRepository.findByUserAndTransactionDateBetween(user, startDate, endDate);
    }

    public Transaction updateTransaction(Long id, TransactionDto transactionDto) {
        Transaction transaction = getTransactionById(id);
        transaction.setType(transactionDto.getType());
        transaction.setAmount(transactionDto.getAmount());
        transaction.setCategory(transactionDto.getCategory());
        transaction.setDescription(transactionDto.getDescription());
        transaction.setTransactionDate(transactionDto.getTransactionDate());
        
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
