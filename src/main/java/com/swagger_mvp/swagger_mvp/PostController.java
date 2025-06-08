package com.swagger_mvp.swagger_mvp;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@Tag(name = "Посты")
public class PostController {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String JSONPLACEHOLDER_URL = "https://jsonplaceholder.typicode.com/posts";

    @GetMapping
    public List<Post> getPosts() {
        Post[] posts = restTemplate.getForObject(JSONPLACEHOLDER_URL, Post[].class);
        return Arrays.asList(posts);
    }

    @GetMapping("/{id}")
    public Post getPostById(@PathVariable int id) {
        return restTemplate.getForObject(JSONPLACEHOLDER_URL + "/" + id, Post.class);
    }
}
