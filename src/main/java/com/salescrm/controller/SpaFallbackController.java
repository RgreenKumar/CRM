package com.salescrm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaFallbackController {
    
    // Catch all routes that do not contain a period (like .js, .css, etc.)
    // and aren't api routes, and forward them to the React index.html
    @RequestMapping(value = {
        "/", 
        "/login", 
        "/signup", 
        "/verify-email", 
        "/otp", 
        "/create-password",
        "/dashboard",
        "/dashboard/**"
    })
    public String redirect() {
        return "forward:/index.html";
    }
}
