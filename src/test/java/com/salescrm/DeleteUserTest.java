package com.salescrm;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootTest
public class DeleteUserTest {
    @Autowired
    JdbcTemplate jdbcTemplate;
    
    @Test
    public void deleteUser() {
        jdbcTemplate.update("DELETE FROM users WHERE email = 'vishnudharanh@gmail.com'");
        System.out.println("USER DELETED SUCCESSFULLY.");
    }
}
