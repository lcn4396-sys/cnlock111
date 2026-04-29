package com.example.vote.service.impl;

import com.example.vote.entity.Category;
import com.example.vote.repository.CategoryRepository;
import com.example.vote.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> listEnabled() {
        return categoryRepository.findByStatusOrderBySortOrderAsc(1);
    }
}
