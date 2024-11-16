package com.musashi.validation;

import com.musashi.anno.Status;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

// ConstraintValidator<RegulationsForWhichAnnotation,DataTypeNeedToBeValidated(drafted/published)>
public class StatusValidation implements ConstraintValidator<Status,String> {
    /**
     *
     * @param value: Data NeedTo Be Validated
     * @param context:
     * @return false: validation failed; true: passed.
     */
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {

        if(value==null){
           return false;
        }
        if(value.equals("drafted")||value.equals("published")){
            return true;
        }
        return false;
    }


}
