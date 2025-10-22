package com.example.BankOnline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorResponseDto {
    private int status;
    private String error;
    private String message;
}
