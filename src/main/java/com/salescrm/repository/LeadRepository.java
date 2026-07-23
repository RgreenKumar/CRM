package com.salescrm.repository;

import com.salescrm.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByEmail(String email);
    List<Lead> findByAssignedTo(String assignedTo);
}
