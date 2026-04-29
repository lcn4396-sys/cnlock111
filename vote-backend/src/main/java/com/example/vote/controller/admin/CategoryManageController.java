package com.example.vote.controller.admin;

import com.example.vote.common.result.Result;
import com.example.vote.common.result.ResultCode;
import com.example.vote.entity.Category;
import com.example.vote.repository.CategoryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 管理端 - 分类管理
 */
@Tag(name = "管理端-分类管理")
@RestController
@RequestMapping("/api/admin/category")
@RequiredArgsConstructor
public class CategoryManageController {
    private final CategoryRepository categoryRepository;

    @GetMapping("/list")
    @Operation(summary = "分类列表")
    public Result<List<Category>> list() {
        return Result.ok(categoryRepository.findAll());
    }

    @PostMapping("/create")
    @Operation(summary = "新增分类")
    public Result<Category> create(@RequestBody Category category) {
        if (category.getSortOrder() == null) category.setSortOrder(0);
        if (category.getStatus() == null) category.setStatus(1);
        return Result.ok(categoryRepository.save(category));
    }

    @PutMapping("/edit/{categoryId}")
    @Operation(summary = "编辑分类")
    public Result<Category> edit(@PathVariable Long categoryId, @RequestBody Category category) {
        Category c = categoryRepository.findById(categoryId).orElseThrow(() -> new com.example.vote.common.exception.BusinessException(404, "分类不存在"));
        if (category.getName() != null) c.setName(category.getName());
        if (category.getDescription() != null) c.setDescription(category.getDescription());
        if (category.getSortOrder() != null) c.setSortOrder(category.getSortOrder());
        if (category.getStatus() != null) c.setStatus(category.getStatus());
        return Result.ok(categoryRepository.save(c));
    }

    @DeleteMapping("/delete/{categoryId}")
    @Operation(summary = "删除分类")
    public Result<Void> delete(@PathVariable Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            return Result.fail(ResultCode.NOT_FOUND.getCode(), "分类不存在");
        }
        categoryRepository.deleteById(categoryId);
        return Result.ok();
    }

    @PutMapping("/status/{categoryId}")
    @Operation(summary = "分类启用/禁用")
    public Result<Category> status(@PathVariable Long categoryId, @RequestParam Integer status) {
        Category c = categoryRepository.findById(categoryId).orElseThrow(() -> new com.example.vote.common.exception.BusinessException(404, "分类不存在"));
        c.setStatus(status);
        return Result.ok(categoryRepository.save(c));
    }

    @PutMapping("/order")
    @Operation(summary = "分类排序调整")
    public Result<Void> order(@RequestBody List<Category> categories) {
        for (Category c : categories) {
            if (c.getId() != null && c.getSortOrder() != null) {
                categoryRepository.findById(c.getId()).ifPresent(existing -> {
                    existing.setSortOrder(c.getSortOrder());
                    categoryRepository.save(existing);
                });
            }
        }
        return Result.ok();
    }
}
