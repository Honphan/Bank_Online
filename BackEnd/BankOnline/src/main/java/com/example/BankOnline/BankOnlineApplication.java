package com.example.BankOnline;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class BankOnlineApplication {
    public static void main(String[] args) {
        // Chạy ứng dụng Spring Boot và nhận lại đối tượng ApplicationContext.
        // Đối tượng này chứa toàn bộ thông tin về môi trường ứng dụng đang chạy.
        ConfigurableApplicationContext applicationContext = SpringApplication.run(BankOnlineApplication.class, args);

        // Từ ApplicationContext, chúng ta lấy ra Environment bean.
        Environment env = applicationContext.getEnvironment();

        // Environment cho phép chúng ta đọc các thuộc tính cấu hình.
        // 'local.server.port' là thuộc tính đặc biệt, chứa port thực tế mà server đang chạy.
        String port = env.getProperty("local.server.port");
        System.out.println("http://localhost:" + port);

    }
}
