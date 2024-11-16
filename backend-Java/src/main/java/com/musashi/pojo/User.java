package com.musashi.pojo;

// To encapsulate data fetched from database User table
// Using Lombok will generate setter,getter and toSting methods during compilation.
// Need to import dependency in pom file. then add @Data annotation above class definition.
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import java.time.LocalDateTime;

@Data  // lombok will generate setter,getter and toSting methods.
       // when annotation is added, then recompile project in maven. And check User.class in "target" folder.
public class User {
    @NotNull // indicates request data must be not null, trigger when User object annotate @Validated
    private Integer id; // user id
    // username validation is added in UserController register() & login() parameters
    private String username;

    @JsonIgnore // indicates SpringMVC ignore password  when converting properties into JSON string(response data).
    private String password;

    @NotEmpty // indicates can't be null or empty, trigger when User object annotates @Validated
    @Pattern(regexp = "^\\S{1,14}$") // validate requested User object and used in update() in UserMapper SQL statement.
    private String nickname;

    @Email  // must match email pattern, trigger when User object annotate @Validated
    private String email;

    private String userPic;// user avatar image url
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")  // convert date format fetched from Database into preferred response format(Json) to client
    private LocalDateTime createTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")  // convert date format fetched from Database into preferred response format(Json) to client
    private LocalDateTime updateTime;
}
