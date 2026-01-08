package com.nefara.server.exeptions;

import org.springframework.http.HttpStatus;

public class ErrorExeption extends RuntimeException{
    
    private HttpStatus status;

    public ErrorExeption(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus () {
        return status;
    }
}
