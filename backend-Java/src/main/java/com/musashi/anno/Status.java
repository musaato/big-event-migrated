package com.musashi.anno;

import com.musashi.validation.StatusValidation;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented // indicates this annotation class can be archived in help document
// @Target indicates this annotation can be used at what kind of method, field and so on.
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME) // indicates this annotation can be remained during which period
@Constraint(validatedBy = {StatusValidation.class}) // StatusValidation.class offers validation regulations

public @interface Status {

    // prompt message when validation failed.
    String message() default "value of status either be drafted or published";
    // assign group
    Class<?>[] groups() default {};
    // fetch additional info about Status annotation
    Class<? extends Payload>[] payload() default {};
}
