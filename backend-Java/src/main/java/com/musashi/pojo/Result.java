package com.musashi.pojo;


//统一响应结果 unify response results

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // without getter & setter, Spring doesn't know how to convert "Result" instance into JSON string, which been responded to client.
@NoArgsConstructor // add No arguments constructor  by using lombok.
@AllArgsConstructor // add all arguments constructor  by using lombok.
public class Result<T> {
    private Integer code; // service status code   0-success  1-failed
    private String message; // prompt message
    private T data; // response data ,generics T(Object, String,Bean Object, Mapper API)

    // respond success action result(response data attached)
    public static <E> Result<E> success(E data) {
       return new Result<>(0, "Done successfully", data);
    }

    // respond success action result
    // Use Lombok to generate constructor method
    public static Result success() {
        // for adding user or article, no data return.
       return new Result(0, "Done successfully", null);
    }

    // respond failed action error result
    public static Result error(String message) {
       return new Result(1, message, null);
    }
}
