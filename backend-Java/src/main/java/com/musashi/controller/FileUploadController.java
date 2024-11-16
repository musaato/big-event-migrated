package com.musashi.controller;
// for uploading file manipulations, which capable to interact  upload/download/delete file with Amazon S3
import com.musashi.pojo.Result;
import com.musashi.utils.S3Util;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/file")
public class FileUploadController {

    // upload file
    @PostMapping("/upload")
    public Result<String> uploadFile(MultipartFile file){  //throwsIOException {
        // fetch original file name
        // store file to local storage
        String originalFilename = file.getOriginalFilename();

        // use UUID to concatenate file name to
        // validate original file name to be distinctive to prevent file overriding
        // subtract file extension by last "." in file name. e.g. output ".jpg"
        String fileName = UUID.randomUUID()+originalFilename.substring(originalFilename.lastIndexOf("."));

        // file.transferTo(new File("\\big-event-EN\\files\\"+fileName));
        String objectUrl = S3Util.uploadFile(file,fileName); // returns an uploaded object url
        return Result.success(objectUrl); // return image url links cloud server
    }

    // download file
    @GetMapping("/download") //localhost:8080/file/download?fileName=60728777-e9a6-466a-a64d-84425cf10d56.jpg
    public Result<String> downloadFile(String fileName){
       String result = S3Util.downloadFile(fileName);
        return Result.success(result);

    }

   // delete file
    @DeleteMapping("/delete") // deleteFile(String FileName)
    public Result<String> deleteFile(String fileName){ // localhost:8080/file/delete?fileName=a5f9cbea-3c41-4e3a-bd65-25f8b3546ad2.jpg
      String result = S3Util.deleteFile(fileName);
      return Result.success(result);
    }


}
