package com.changgou.goods.pojo;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Table(name="tb_album")
@Data
public class Album implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;//编号

    @Column(name = "title")
    private String title;//相册名称

    @Column(name = "image")
    private String image;//相册封面

    @Column(name = "image_items")
    private String imageItems;//图片列表

    //get...set...toString..
}