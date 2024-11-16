package com.musashi.exception;

// This class handles parameters validation exceptions.
import com.musashi.pojo.Result;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// @RestControllerAdvice Annotation indicates this class handle exceptions.
// All return values from methods within this class will be converted into JSON strings.
@RestControllerAdvice
public class GlobalExceptionHandler {

    // "Exception.class" means Handling all exceptions
    @ExceptionHandler(Exception.class)
    public Result handleException(Exception e){
       e.printStackTrace();
       return Result.error(StringUtils.hasLength(e.getMessage())? e.getMessage() : "Operational Error");
    }

}
