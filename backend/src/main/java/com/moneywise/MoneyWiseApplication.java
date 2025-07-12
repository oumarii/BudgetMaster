package com.moneywise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication
public class MoneyWiseApplication {
    public static void main(String[] args) {
        SpringApplication.run(MoneyWiseApplication.class, args);
    }
}
