package is.symphony.service_booking_platform.controller;

import is.symphony.service_booking_platform.dto.ErrorResponseDto;
import is.symphony.service_booking_platform.exception.BookingException;
import is.symphony.service_booking_platform.exception.ResourceNotFoundException;

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

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleResourceNotFound(ResourceNotFoundException ex) {
        return new ResponseEntity<>(new ErrorResponseDto(ex.getMessage()), HttpStatus.NOT_FOUND); // 404
    }

    @ExceptionHandler(BookingException.class)
    public ResponseEntity<ErrorResponseDto> handleBookingConflict(BookingException ex) {
        return new ResponseEntity<>(new ErrorResponseDto(ex.getMessage()), HttpStatus.CONFLICT); // 409
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ErrorResponseDto> handleSecurityException(SecurityException ex) {
        return new ResponseEntity<>(new ErrorResponseDto(ex.getMessage()), HttpStatus.FORBIDDEN); // 403
    }

}