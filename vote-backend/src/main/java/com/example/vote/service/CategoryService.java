package com.example.vote.service;

import com.example.vote.entity.Category;

import java.util.List;

public interface CategoryService {
    List<Category> listEnabled();
}
