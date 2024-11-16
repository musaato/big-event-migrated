package com.musashi.utils;


import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Md5Util {
    /**
     * default password strings combinations, convert bytes into hex.
     */
    protected static char hexDigits[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

    protected static MessageDigest messagedigest = null;

    static {
        try {
            messagedigest = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException nsaex) {
            System.err.println(Md5Util.class.getName() + "initialization failed，MessageDigest doesn't support MD5Util.");
            nsaex.printStackTrace();
        }
    }

    /**
     * generate md5 checksum of string
     *
     * @param
     * @return
     */
    // convert password in UserServiceImpl register() into Byte array
    public static String getMD5String(String s) {
        return getMD5String(s.getBytes());
    }

    /**
     * validate whether md5 checksum of string matches one already existed
     *
     * @param password  string need to be validated
     * @param md5PwdStr existed md5
     * @return
     */
    public static boolean checkPassword(String password, String md5PwdStr) {
        String s = getMD5String(password);
        return s.equals(md5PwdStr);
    }


    // static method  encrypts password.
    public static String getMD5String(byte[] bytes) {
        messagedigest.update(bytes);
        return bufferToHex(messagedigest.digest());
    }

    // byte bytes[] is C type array, byte[] bytes is Java array.
    private static String bufferToHex(byte bytes[]) {
        return bufferToHex(bytes, 0, bytes.length);
    }

    private static String bufferToHex(byte bytes[], int m, int n) {
        StringBuffer stringbuffer = new StringBuffer(2 * n);
        int k = m + n;
        for (int l = m; l < k; l++) {
            appendHexPair(bytes[l], stringbuffer);
        }
        return stringbuffer.toString();
    }

    private static void appendHexPair(byte bt, StringBuffer stringbuffer) {
        char c0 = hexDigits[(bt & 0xf0) >> 4];// slice high 4 digits of string
        char c1 = hexDigits[bt & 0xf];// slice low 4 digits of string
        stringbuffer.append(c0);
        stringbuffer.append(c1);
    }

}
