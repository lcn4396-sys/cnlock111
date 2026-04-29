package com.example.vote.controller.mini;

import com.example.vote.common.result.Result;
import com.example.vote.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.vote.entity.Category;

import java.util.Collections;
import java.util.List;

/**
 * 小程序 - 分类
 */
@Tag(name = "小程序-分类")
@RestController
@RequestMapping("/api/mini/category")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @Operation(summary = "分类列表")
    @GetMapping("/list")
    public Result<List<Category>> list() {
        try {
            return Result.ok(categoryService.listEnabled());
        } catch (Exception e) {
            return Result.ok(Collections.emptyList());
        }
    }
}
