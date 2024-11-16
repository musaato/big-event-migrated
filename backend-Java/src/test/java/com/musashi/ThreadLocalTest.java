package com.musashi;

import org.junit.jupiter.api.Test;

// To test ThreadLocal-isolation.
public class ThreadLocalTest {

    @Test
    public void testThreadLocalSetAndGet(){
      // generate a ThreadLocal object.
        ThreadLocal tl = new ThreadLocal();

      // start 2 threads. ThreadLocal-isolation.
        new Thread(()->{
            tl.set("spider");
            System.out.println(Thread.currentThread().getName()+": "+tl.get());
            //System.out.println("The thread object is :" + Thread.currentThread());// output like this "Thread[#31,Blue,5,main]"
            System.out.println(Thread.currentThread().getName()+": "+tl.get());
            System.out.println(Thread.currentThread().getName()+": "+tl.get());
            },"Blue").start();

        new Thread(()->{
            tl.set("huffman");
            System.out.println(Thread.currentThread().getName()+": "+tl.get());
            System.out.println(Thread.currentThread().getName()+": "+tl.get());
            System.out.println(Thread.currentThread().getName()+": "+tl.get());
        },"Yellow").start();

    }

}
