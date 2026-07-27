package com.salescrm.repository;

import com.salescrm.entity.Deal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DealRepository extends JpaRepository<Deal, Long> {
    List<Deal> findByContact(String contact);
}
