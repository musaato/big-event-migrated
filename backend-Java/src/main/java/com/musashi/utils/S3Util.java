package com.musashi.utils;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

// Manipulate file object storage in AWS S3
//@Slf4j // enable log.error
public class S3Util {

//    @Value("${application.bucket.name}")
//    private String bucketName;

    private static final AmazonS3 s3Client = S3Client.S3Inst();
    private static final String BUCKETNAME = S3Client.getBucketName();
    private static final String ENDPOINT = S3Client.getEndpoint();
    private static String url = "";

    /*    private File convertMultiPartFileToFile(MultipartFile file) {
            File convertedFile = new File(file.getOriginalFilename()); // create a File object with same name with original file name
            try (FileOutputStream fos = new FileOutputStream(convertedFile)) { //create a FileOutputStream object that can  write bytes into convertedFile
                fos.write(file.getBytes()); // FileOutputStream object fos writes the bytes of the MultipartFile (file) to the convertedFile.
            } catch (IOException e) {
                log.error("Error converting multipartFile to file", e);
                //System.out.println( "Error converting multipartFile to file"+ e);
            }
            return convertedFile; // uploaded file is converted to a regular file
        }*/
    public static String uploadFile(MultipartFile file, String fileName) {

        File fileObj = new File(file.getOriginalFilename()); // create a File object with same name with original file name
        try (FileOutputStream fos = new FileOutputStream(fileObj)) { //create a FileOutputStream object that can  write bytes into convertedFile
            fos.write(file.getBytes()); // FileOutputStream object fos writes the bytes of the MultipartFile (file) to the convertedFile.
        } catch (IOException e) {
           // log.error("Error converting multipartFile to file", e); //@Slf4j // enable log.error
            System.out.println( "Error converting multipartFile to file "+ e);
        }

        // File fileObj = convertMultiPartFileToFile(file); // uploaded file is converted to a regular file
        // String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        s3Client.putObject(new PutObjectRequest(BUCKETNAME, fileName, fileObj));
        fileObj.delete(); // After successful upload, the fileObj (temporary converted file) will be deleted to clean up resources.

        // url https://s3-object-storage.s3.ap-northeast-1.amazonaws.com/TestFile.txt
        url = "https://" + BUCKETNAME + ".s3." + ENDPOINT + ".amazonaws.com/" + fileName;
        //return "File uploaded : " + fileName + ". URL: " + url;
        return  url;
    }


    // download file
    public static String downloadFile(String fileName) {
        S3Object s3Object = s3Client.getObject(BUCKETNAME, fileName);
        S3ObjectInputStream inputStream = s3Object.getObjectContent();
        String filePath = "D:\\Downloads\\"+fileName; // Specify the output file path
        try {
            byte[] content = IOUtils.toByteArray(inputStream);
            FileOutputStream fos = new FileOutputStream(filePath);
            fos.write(content);
            fos.close();

            /*BufferedOutputStream bos = new BufferedOutputStream(fos);
            bos.write(content); // Write the byte array to the stream
            bos.close(); // Close the stream when action done*/

        } catch (IOException e) {
            e.printStackTrace();
        }
        return "File "+fileName+" downloaded at "+filePath;
    }

    // delete file
    public static String deleteFile(String fileName) {
        s3Client.deleteObject(BUCKETNAME, fileName);
        return fileName + " has been removed.";
    }

}

class S3Client{
    private static final String ACCESS_KEY_ID="*****";
    private static final String SECRET_ACCESS_KEY="*****";

    private static final String BUCKET_NAME ="s3-object-storage";
    private static final String ENDPOINT ="ap-northeast-1";
    public static AmazonS3 S3Inst() {
        AWSCredentials awsCredentials = new BasicAWSCredentials(ACCESS_KEY_ID, SECRET_ACCESS_KEY);
        return AmazonS3ClientBuilder
                .standard()
                .withRegion(ENDPOINT)
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .build();
    }

    public static String getBucketName(){
        return BUCKET_NAME;
    }
    public static String getEndpoint(){
        return ENDPOINT;
    }
}