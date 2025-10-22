package com.example.BankOnline.dto;

public class ResponeDto {
    private String message;
    private int status;

    public ResponeDto() {
    }

    public ResponeDto(String message, int status) {
        this.message = message;
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}

