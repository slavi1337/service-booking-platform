package is.symphony.service_booking_platform.controller;

import is.symphony.service_booking_platform.dto.ErrorResponseDto;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponseDto> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        if (ex.getMostSpecificCause().getMessage().contains("Duplicate entry") ||
                ex.getMostSpecificCause().getMessage().contains("uk_users_email")) {

            ErrorResponseDto errorResponse = new ErrorResponseDto("Email already exists.");
            return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        }

        ErrorResponseDto errorResponse = new ErrorResponseDto("Database error.");
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}