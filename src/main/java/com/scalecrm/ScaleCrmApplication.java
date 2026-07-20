package com.scalecrm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@SpringBootApplication
@Controller
public class ScaleCrmApplication implements ErrorController {

	public static void main(String[] args) {
		SpringApplication.run(ScaleCrmApplication.class, args);
	}

	// Forward all unmapped requests (like React Router routes) to the index.html
	@RequestMapping("/error")
	public String handleError() {
		return "forward:/index.html";
	}
}
