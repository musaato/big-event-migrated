package com.musashi.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// return result object by paging
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageBean <T>{
    private Long total; // total records
    private List<T> items; // current page record items
}
