package com.musashi.pojo;
// to encapsulate data fetched from database Category table
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.groups.Default;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class Category {
    //@NotNull // added since need @Validated in update() parameter in CategoryController
    @NotNull(groups =Update.class) // enable @Validated in Update.class below
    private Integer id;// article category ID (primary key)

    @NotEmpty // @Validated in add(),update() in CategoryController
    //@NotEmpty(groups = {Update.class,Add.class}) // replace by interface Add & Update below
    @Pattern(regexp = "^\\S{1,32}$")
    private String categoryName;// article category name

    @NotEmpty // @Validated in add(),update() in CategoryController
    @Pattern(regexp = "^\\S{1,32}$")
    private String categoryAlias;// article category alias

    private Integer createUser;// creator user id

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")  // convert date format fetched from Database into preferred response format(Json) to client
    private LocalDateTime createTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

    // if you don't assign @Validated group,then all annotated attributes belong to Default group
    // add(@RequestBody @Validated(Category.Add.class) Category category)in CategoryController
    public  interface Add extends Default{

    }

    // update(@RequestBody @Validated(Category.Update.class) in CategoryController
    public   interface Update extends Default{

    }
}
