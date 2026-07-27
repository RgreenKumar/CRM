package com.salescrm.config;

import com.salescrm.entity.*;
import com.salescrm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private PipelineStageRepository stageRepository;
    @Autowired
    private LeadRepository leadRepository;
    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private DealRepository dealRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SystemSettingRepository systemSettingRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    @SuppressWarnings("null")
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.execute("ALTER TABLE system_settings ALTER COLUMN setting_value TYPE TEXT");
            System.out.println("Altered system_settings table to use TEXT for setting_value");
        } catch (Exception e) {
            System.out.println("Could not alter system_settings table (might already be TEXT): " + e.getMessage());
        }

        try {
            // Update assigned manager to existing sales users
            jdbcTemplate.execute("UPDATE users SET manager = 'Sarah Smith' WHERE role = 'ROLE_SALES' AND manager IS NULL");
            System.out.println("Assigned manager to existing sales users");
            
            // Drop assigned_to column from contacts if it exists
            try {
                jdbcTemplate.execute("ALTER TABLE contacts DROP COLUMN assigned_to");
            } catch (Exception e) {}
            
        } catch (Exception e) {
            System.err.println("Failed to update existing data: " + e.getMessage());
        }

        if (stageRepository.count() == 0) {
            List<PipelineStage> initialStages = Arrays.asList(
                    createStage("Prospecting", "#3b82f6", 0),
                    createStage("Qualification", "#eab308", 1),
                    createStage("Proposal", "#8b5cf6", 2),
                    createStage("Negotiation", "#f97316", 3),
                    createStage("Won", "#22c55e", 4)
            );
            stageRepository.saveAll(initialStages);
            System.out.println("Default pipeline stages seeded into database.");
        } else {
            // Force update existing pastel colors to vibrant colors for current DB
            List<PipelineStage> stages = stageRepository.findAll();
            for(PipelineStage s : stages) {
                if ("#dbeafe".equals(s.getColor())) s.setColor("#3b82f6");
                if ("#fef3c7".equals(s.getColor())) s.setColor("#eab308");
                if ("#e0e7ff".equals(s.getColor())) s.setColor("#8b5cf6");
                if ("#ffedd5".equals(s.getColor())) s.setColor("#f97316");
                if ("#dcfce7".equals(s.getColor())) s.setColor("#22c55e");
                if ("Closed Won".equals(s.getName())) s.setName("Won");
            }
            stageRepository.saveAll(stages);
        }

        // Check and seed users (only seed essential admin accounts so we don't resurrect deleted test users)
        String encodedPassword = passwordEncoder.encode("password123");
        String[][] userData = {
            {"Vishnudharan H", "vishnudharanh@gmail.com", "ROLE_ADMIN", "Active"},
            {"John Doe", "john.doe@example.com", "ROLE_ADMIN", "Active"},
            {"Sarah Smith", "sarah.smith@example.com", "ROLE_MANAGER", "Active"},
            {"Mike Johnson", "mike.johnson@example.com", "ROLE_SALES", "Active"},
            {"Emily Davis", "emily.davis@example.com", "ROLE_SALES", "Inactive"},
            {"David Brown", "david.brown@example.com", "ROLE_SALES", "Active"}
        };

        for (String[] ud : userData) {
            User u = userRepository.findByEmail(ud[1]).orElse(null);
            if (u == null) {
                u = new User();
                u.setName(ud[0]);
                u.setEmail(ud[1]);
                u.setRole(ud[2]);
                u.setStatus(ud[3]);
                if ("vishnudharanh@gmail.com".equals(ud[1])) {
                    u.setPassword(passwordEncoder.encode("Vishnu@2007"));
                } else {
                    u.setPassword(encodedPassword);
                }
                userRepository.save(u);
            } else {
                // Update properties in case they changed
                if ("vishnudharanh@gmail.com".equals(ud[1])) {
                    u.setPassword(passwordEncoder.encode("Vishnu@2007"));
                }
                
                // Set manager for sales users if not already set
                if (ud[2].contains("SALES") && u.getManager() == null) {
                    u.setManager("Sarah Smith");
                }
                
                userRepository.save(u);
            }
        }
        
        // Delete the resurrected "Vishnudharan" ghost user if it exists to avoid confusion with "Vishnudharan H"
        User ghostUser = userRepository.findByEmail("vishnudharan@example.com").orElse(null);
        if (ghostUser != null) {
            userRepository.delete(ghostUser);
        }
        
        if (leadRepository.count() == 0) {
            Lead l1 = new Lead(); l1.setName("Rahul Kumar"); l1.setEmail("rahul@tech.com"); l1.setPhone("9876543210"); l1.setSource("Website"); l1.setStatus("New"); l1.setAssignedManager("Sarah Smith"); l1.setAssignedSalesperson("Mike Johnson"); leadRepository.save(l1);
            Lead l2 = new Lead(); l2.setName("Sophia Lee"); l2.setEmail("sophia@startup.io"); l2.setPhone("9123456789"); l2.setSource("Referral"); l2.setStatus("Contacted"); l2.setAssignedManager("Sarah Smith"); l2.setAssignedSalesperson("Mike Johnson"); leadRepository.save(l2);
            Lead l3 = new Lead(); l3.setName("Mark Evans"); l3.setEmail("mark@bigcorp.com"); l3.setPhone("9988776655"); l3.setSource("Cold Call"); l3.setStatus("Interested"); l3.setAssignedManager("Sarah Smith"); l3.setAssignedSalesperson("Sarah Smith"); leadRepository.save(l3);
            Lead l4 = new Lead(); l4.setName("Nisha Reddy"); l4.setEmail("nisha@enterprise.in"); l4.setPhone("8877665544"); l4.setSource("Social Media"); l4.setStatus("Qualified"); l4.setAssignedManager("Sarah Smith"); l4.setAssignedSalesperson("David Brown"); leadRepository.save(l4);
            Lead l5 = new Lead(); l5.setName("Tom Wright"); l5.setEmail("tom@solutions.net"); l5.setPhone("7766554433"); l5.setSource("Website"); l5.setStatus("Not Interested"); l5.setAssignedManager("Sarah Smith"); l5.setAssignedSalesperson("Sarah Smith"); leadRepository.save(l5);
        }

        if (contactRepository.count() == 0) {
            Contact c1 = new Contact(); c1.setName("Rahul Kumar"); c1.setEmail("rahul@tech.com"); c1.setPhone("9876543210"); c1.setCompany("Tech Solutions Pvt Ltd"); c1.setDesignation("CTO"); contactRepository.save(c1);
            Contact c2 = new Contact(); c2.setName("Sophia Lee"); c2.setEmail("sophia@startup.io"); c2.setPhone("9123456789"); c2.setCompany("StartupIO"); c2.setDesignation("CEO"); contactRepository.save(c2);
            Contact c3 = new Contact(); c3.setName("Nisha Reddy"); c3.setEmail("nisha@enterprise.in"); c3.setPhone("8877665544"); c3.setCompany("Enterprise India"); c3.setDesignation("Procurement Head"); contactRepository.save(c3);
        }

        if (systemSettingRepository.findById("companyName").isEmpty()) {
            systemSettingRepository.save(new SystemSetting("companyName", "Your Company"));
        }
        if (systemSettingRepository.findById("timeZone").isEmpty()) {
            systemSettingRepository.save(new SystemSetting("timeZone", "UTC+5:30 (India)"));
        }
        if (systemSettingRepository.findById("dateFormat").isEmpty()) {
            systemSettingRepository.save(new SystemSetting("dateFormat", "MM/DD/YYYY"));
        }
        if (systemSettingRepository.findById("currency").isEmpty()) {
            systemSettingRepository.save(new SystemSetting("currency", "{\"label\":\"INR - Indian Rupee\",\"symbol\":\"₹\"}"));
        }

        /*
        if (leadRepository.count() < 15) {
            // New leads for Indian Companies
            Lead l6 = new Lead(); l6.setName("Mukesh Ambani"); l6.setEmail("mukesh@ril.com"); l6.setPhone("9876500001"); l6.setSource("Referral"); l6.setStatus("New"); l6.setAssignedTo("Ravichandran"); leadRepository.save(l6);
            Lead l7 = new Lead(); l7.setName("Sashidhar Jagdishan"); l7.setEmail("sashidhar@hdfc.com"); l7.setPhone("9876500002"); l7.setSource("Website"); l7.setStatus("Qualified"); l7.setAssignedTo("Sarah Smith"); leadRepository.save(l7);
            Lead l8 = new Lead(); l8.setName("K. Krithivasan"); l8.setEmail("krithi@tcs.com"); l8.setPhone("9876500003"); l8.setSource("Cold Call"); l8.setStatus("Interested"); l8.setAssignedTo("Mike Johnson"); leadRepository.save(l8);
            Lead l9 = new Lead(); l9.setName("Gopal Vittal"); l9.setEmail("gopal@airtel.com"); l9.setPhone("9876500004"); l9.setSource("Social Media"); l9.setStatus("Contacted"); l9.setAssignedTo("Emily Davis"); leadRepository.save(l9);
            Lead l10 = new Lead(); l10.setName("Sandeep Bakhshi"); l10.setEmail("sandeep@icici.com"); l10.setPhone("9876500005"); l10.setSource("Website"); l10.setStatus("New"); l10.setAssignedTo("David Brown"); leadRepository.save(l10);
            Lead l11 = new Lead(); l11.setName("Dinesh Kumar Khara"); l11.setEmail("dinesh@sbi.co.in"); l11.setPhone("9876500006"); l11.setSource("Referral"); l11.setStatus("Interested"); l11.setAssignedTo("Ravichandran"); leadRepository.save(l11);
            Lead l12 = new Lead(); l12.setName("Salil Parekh"); l12.setEmail("salil@infosys.com"); l12.setPhone("9876500007"); l12.setSource("Cold Call"); l12.setStatus("Qualified"); l12.setAssignedTo("Sarah Smith"); leadRepository.save(l12);
            Lead l13 = new Lead(); l13.setName("Rohit Jawa"); l13.setEmail("rohit@hul.in"); l13.setPhone("9876500008"); l13.setSource("Website"); l13.setStatus("New"); l13.setAssignedTo("Mike Johnson"); leadRepository.save(l13);
            Lead l14 = new Lead(); l14.setName("Sanjiv Bajaj"); l14.setEmail("rajeev@bajaj.com"); l14.setPhone("9876500009"); l14.setSource("Social Media"); l14.setStatus("Contacted"); l14.setAssignedTo("Emily Davis"); leadRepository.save(l14);
            Lead l15 = new Lead(); l15.setName("Siddhartha Mohanty"); l15.setEmail("sid@lic.in"); l15.setPhone("9876500010"); l15.setSource("Referral"); l15.setStatus("Interested"); l15.setAssignedTo("David Brown"); leadRepository.save(l15);
        }

        if (contactRepository.count() < 13) {
            Contact c4 = new Contact(); c4.setName("Mukesh Ambani"); c4.setEmail("mukesh@ril.com"); c4.setPhone("9876500001"); c4.setCompany("Reliance Industries Limited"); c4.setDesignation("Chairman"); contactRepository.save(c4);
            Contact c5 = new Contact(); c5.setName("Sashidhar Jagdishan"); c5.setEmail("sashidhar@hdfc.com"); c5.setPhone("9876500002"); c5.setCompany("HDFC Bank"); c5.setDesignation("CEO"); contactRepository.save(c5);
            Contact c6 = new Contact(); c6.setName("K. Krithivasan"); c6.setEmail("krithi@tcs.com"); c6.setPhone("9876500003"); c6.setCompany("Tata Consultancy Services"); c6.setDesignation("CEO"); contactRepository.save(c6);
            Contact c7 = new Contact(); c7.setName("Gopal Vittal"); c7.setEmail("gopal@airtel.com"); c7.setPhone("9876500004"); c7.setCompany("Bharti Airtel"); c7.setDesignation("MD"); contactRepository.save(c7);
            Contact c8 = new Contact(); c8.setName("Sandeep Bakhshi"); c8.setEmail("sandeep@icici.com"); c8.setPhone("9876500005"); c8.setCompany("ICICI Bank"); c8.setDesignation("CEO"); contactRepository.save(c8);
            Contact c9 = new Contact(); c9.setName("Dinesh Kumar Khara"); c9.setEmail("dinesh@sbi.co.in"); c9.setPhone("9876500006"); c9.setCompany("State Bank of India"); c9.setDesignation("Chairman"); contactRepository.save(c9);
            Contact c10 = new Contact(); c10.setName("Salil Parekh"); c10.setEmail("salil@infosys.com"); c10.setPhone("9876500007"); c10.setCompany("Infosys"); c10.setDesignation("CEO"); contactRepository.save(c10);
            Contact c11 = new Contact(); c11.setName("Rohit Jawa"); c11.setEmail("rohit@hul.in"); c11.setPhone("9876500008"); c11.setCompany("Hindustan Unilever Limited"); c11.setDesignation("CEO"); contactRepository.save(c11);
            Contact c12 = new Contact(); c12.setName("Sanjiv Bajaj"); c12.setEmail("rajeev@bajaj.com"); c12.setPhone("9876500009"); c12.setCompany("Bajaj Finance"); c12.setDesignation("MD"); contactRepository.save(c12);
            Contact c13 = new Contact(); c13.setName("Siddhartha Mohanty"); c13.setEmail("sid@lic.in"); c13.setPhone("9876500010"); c13.setCompany("Life Insurance Corp (LIC)"); c13.setDesignation("Chairman"); contactRepository.save(c13);
        }
        */

        if (dealRepository.count() < 10) {
            if (dealRepository.count() == 0) {
                Deal d1 = new Deal(); d1.setTitle("Tech Solutions ERP Deal"); d1.setContact("Rahul Kumar"); d1.setValue("1,50,000"); d1.setStage("Won"); d1.setStatus("Won"); d1.setCloseDate("2026-05-30"); dealRepository.save(d1);
                Deal d2 = new Deal(); d2.setTitle("StartupIO SaaS Package"); d2.setContact("Sophia Lee"); d2.setValue("80,000"); d2.setStage("Negotiation"); d2.setStatus("Open"); d2.setCloseDate("2026-07-15"); dealRepository.save(d2);
                Deal d3 = new Deal(); d3.setTitle("Enterprise India Contract"); d3.setContact("Nisha Reddy"); d3.setValue("2,20,000"); d3.setStage("Proposal"); d3.setStatus("Open"); d3.setCloseDate("2026-08-01"); dealRepository.save(d3);
            }
            
            /*
            // Add extra deals
            Deal d4 = new Deal(); d4.setTitle("Website Revamp"); d4.setContact("Mark Evans"); d4.setValue("45,000"); d4.setStage("Won"); d4.setStatus("Won"); d4.setCloseDate("2026-06-10"); dealRepository.save(d4);
            Deal d5 = new Deal(); d5.setTitle("Cloud Migration"); d5.setContact("Tom Wright"); d5.setValue("1,10,000"); d5.setStage("Prospecting"); d5.setStatus("Open"); d5.setCloseDate("2026-09-20"); dealRepository.save(d5);
            Deal d6 = new Deal(); d6.setTitle("Mobile App Development"); d6.setContact("Rahul Kumar"); d6.setValue("3,00,000"); d6.setStage("Won"); d6.setStatus("Won"); d6.setCloseDate("2026-07-05"); dealRepository.save(d6);
            Deal d7 = new Deal(); d7.setTitle("SEO Optimization Retainer"); d7.setContact("Sophia Lee"); d7.setValue("25,000"); d7.setStage("Won"); d7.setStatus("Won"); d7.setCloseDate("2026-06-25"); dealRepository.save(d7);
            Deal d8 = new Deal(); d8.setTitle("CRM Implementation"); d8.setContact("Nisha Reddy"); d8.setValue("1,80,000"); d8.setStage("Qualification"); d8.setStatus("Open"); d8.setCloseDate("2026-10-10"); dealRepository.save(d8);
            Deal d9 = new Deal(); d9.setTitle("Data Analytics Dashboard"); d9.setContact("Mark Evans"); d9.setValue("95,000"); d9.setStage("Negotiation"); d9.setStatus("Open"); d9.setCloseDate("2026-08-15"); dealRepository.save(d9);
            Deal d10 = new Deal(); d10.setTitle("Security Audit"); d10.setContact("Tom Wright"); d10.setValue("60,000"); d10.setStage("Won"); d10.setStatus("Won"); d10.setCloseDate("2026-07-20"); dealRepository.save(d10);
            */
        }

        /*
        if (dealRepository.count() < 20) {
            Deal d11 = new Deal(); d11.setTitle("RIL Jio Infrastructure"); d11.setContact("Mukesh Ambani"); d11.setValue("5,00,000"); d11.setStage("Proposal"); d11.setStatus("Open"); d11.setCloseDate("2026-09-01"); dealRepository.save(d11);
            Deal d12 = new Deal(); d12.setTitle("HDFC Loan Software"); d12.setContact("Sashidhar Jagdishan"); d12.setValue("1,20,000"); d12.setStage("Won"); d12.setStatus("Won"); d12.setCloseDate("2026-06-15"); dealRepository.save(d12);
            Deal d13 = new Deal(); d13.setTitle("TCS Cloud Consulting"); d13.setContact("K. Krithivasan"); d13.setValue("2,50,000"); d13.setStage("Negotiation"); d13.setStatus("Open"); d13.setCloseDate("2026-08-20"); dealRepository.save(d13);
            Deal d14 = new Deal(); d14.setTitle("Airtel 5G Rollout"); d14.setContact("Gopal Vittal"); d14.setValue("4,00,000"); d14.setStage("Won"); d14.setStatus("Won"); d14.setCloseDate("2026-07-10"); dealRepository.save(d14);
            Deal d15 = new Deal(); d15.setTitle("ICICI Security Upgrades"); d15.setContact("Sandeep Bakhshi"); d15.setValue("90,000"); d15.setStage("Qualification"); d15.setStatus("Open"); d15.setCloseDate("2026-10-05"); dealRepository.save(d15);
            Deal d16 = new Deal(); d16.setTitle("SBI Rural Expansion"); d16.setContact("Dinesh Kumar Khara"); d16.setValue("3,50,000"); d16.setStage("Won"); d16.setStatus("Won"); d16.setCloseDate("2026-05-20"); dealRepository.save(d16);
            Deal d17 = new Deal(); d17.setTitle("Infosys AI Integration"); d17.setContact("Salil Parekh"); d17.setValue("1,80,000"); d17.setStage("Prospecting"); d17.setStatus("Open"); d17.setCloseDate("2026-11-01"); dealRepository.save(d17);
            Deal d18 = new Deal(); d18.setTitle("HUL Supply Chain"); d18.setContact("Rohit Jawa"); d18.setValue("2,10,000"); d18.setStage("Won"); d18.setStatus("Won"); d18.setCloseDate("2026-06-30"); dealRepository.save(d18);
            Deal d19 = new Deal(); d19.setTitle("Bajaj FinTech Portal"); d19.setContact("Sanjiv Bajaj"); d19.setValue("1,40,000"); d19.setStage("Proposal"); d19.setStatus("Open"); d19.setCloseDate("2026-09-15"); dealRepository.save(d19);
            Deal d20 = new Deal(); d20.setTitle("LIC Policy Management"); d20.setContact("Siddhartha Mohanty"); d20.setValue("2,80,000"); d20.setStage("Won"); d20.setStatus("Won"); d20.setCloseDate("2026-08-10"); dealRepository.save(d20);
        }
        */

        if (taskRepository.count() == 0) {
            Task t1 = new Task(); t1.setTitle("Follow up with Rahul"); t1.setAssignedTo("Mike Johnson"); t1.setDueDate("2026-06-20"); t1.setPriority("High"); t1.setStatus("Pending"); taskRepository.save(t1);
            Task t2 = new Task(); t2.setTitle("Send proposal to Sophia"); t2.setAssignedTo("Mike Johnson"); t2.setDueDate("2026-06-18"); t2.setPriority("Medium"); t2.setStatus("In Progress"); taskRepository.save(t2);
            Task t3 = new Task(); t3.setTitle("Demo call with Mark"); t3.setAssignedTo("Sarah Smith"); t3.setDueDate("2026-06-22"); t3.setPriority("High"); t3.setStatus("Pending"); taskRepository.save(t3);
            Task t4 = new Task(); t4.setTitle("Contract review Nisha"); t4.setAssignedTo("David Brown"); t4.setDueDate("2026-06-25"); t4.setPriority("Low"); t4.setStatus("Done"); taskRepository.save(t4);
            Task t5 = new Task(); t5.setTitle("send proposal to rahul"); t5.setAssignedTo("David Brown"); t5.setDueDate("2026-06-22"); t5.setPriority("Medium"); t5.setStatus("Pending"); taskRepository.save(t5);
        }
        
        // Clean up any orphaned assignments in existing DB
        List<User> allUsers = userRepository.findAll();
        List<String> validNames = allUsers.stream().map(User::getName).toList();
        
        List<Task> allTasks = taskRepository.findAll();
        for (Task t : allTasks) {
            if (t.getAssignedTo() != null && !t.getAssignedTo().equals("Unassigned") && !validNames.contains(t.getAssignedTo())) {
                t.setAssignedTo("Unassigned");
                taskRepository.save(t);
            }
        }
        
        List<Lead> allLeads = leadRepository.findAll();
        for (Lead l : allLeads) {
            boolean changed = false;
            if (l.getAssignedManager() != null && !l.getAssignedManager().equals("Unassigned") && !validNames.contains(l.getAssignedManager())) {
                l.setAssignedManager("Unassigned");
                changed = true;
            }
            if (l.getAssignedSalesperson() != null && !l.getAssignedSalesperson().equals("Unassigned") && !validNames.contains(l.getAssignedSalesperson())) {
                l.setAssignedSalesperson("");
                changed = true;
            }
            if (changed) {
                leadRepository.save(l);
            }
        }
    }

    private PipelineStage createStage(String name, String color, int sortOrder) {
        PipelineStage stage = new PipelineStage();
        stage.setName(name);
        stage.setColor(color);
        stage.setSortOrder(sortOrder);
        return stage;
    }
}
