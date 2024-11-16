package com.musashi.pojo;

// to encapsulate data fetched from database Article table
import com.fasterxml.jackson.annotation.JsonFormat;
import com.musashi.anno.Status;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.groups.Default;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;
@Data
public class Article {

    @NotNull(groups = Update.class)
    private Integer id; // article id

    @NotEmpty
    @Pattern(regexp = "^.{1,30}$") // limit any character under 30, space included. Modified from string only to any character usable.
    private String title; // article title

    @NotEmpty
    //@Pattern(regexp = "^\\S{1,10000}$")
    @Pattern(regexp = "^.{1,10000}$")
    private String content; // article content

    @NotEmpty
    @URL
    private String coverImg; // article cover image url

    // apply user-defined validation in anno/Status annotation
    @NotEmpty
    @Status // anno.Status
    private String status; // only has "published" or "drafted"

    @NotNull
    private Integer categoryId; // article category id

    private Integer createUser; // creator user id
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")  // convert date format fetched from Database into preferred format respond(Json) to client
    private LocalDateTime createTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")  // convert date format fetched from Database into preferred format respond(Json) to client
    private LocalDateTime updateTime;

    public interface Add extends Default{

    }

    public interface Update extends Default{

    }
}
