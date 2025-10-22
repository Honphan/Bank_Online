package com.example.BankOnline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponseDto {
    private String message;
    private int status;
    private String token;
    private Object data;
}
