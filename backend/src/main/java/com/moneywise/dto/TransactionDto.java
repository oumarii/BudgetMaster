package com.moneywise.dto;

import com.moneywise.model.Transaction.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionDto {
    private Long id;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Transaction type is required")
    private TransactionType type;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    @NotNull(message = "Category is required")
    private String category;
    
    private String description;
    
    @NotNull(message = "Transaction date is required")
    private LocalDate transactionDate;
}
