package com.swagger_mvp.swagger_mvp;

import jakarta.validation.constraints.NotNull;

public class Post {
    @NotNull
    public int userId;

    @NotNull
    public int id;

    @NotNull
    public String title;

    @NotNull
    public String body;
}
