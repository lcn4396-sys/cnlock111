package com.example.vote.controller.admin;

import com.example.vote.common.result.Result;
import com.example.vote.common.result.ResultCode;
import com.example.vote.entity.AdminRole;
import com.example.vote.repository.AdminRoleRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 管理端 - 角色管理
 */
@Tag(name = "管理端-角色")
@RestController
@RequestMapping("/api/admin/role")
@RequiredArgsConstructor
public class RoleController {
    private final AdminRoleRepository adminRoleRepository;

    @GetMapping("/list")
    @Operation(summary = "角色列表")
    public Result<List<AdminRole>> list() {
        return Result.ok(adminRoleRepository.findByStatusOrderByIdAsc(1));
    }

    @PostMapping("/create")
    @Operation(summary = "新增角色")
    public Result<AdminRole> create(@RequestBody AdminRole role) {
        if (role.getStatus() == null) role.setStatus(1);
        return Result.ok(adminRoleRepository.save(role));
    }

    @PutMapping("/edit/{roleId}")
    @Operation(summary = "编辑角色")
    public Result<AdminRole> edit(@PathVariable Long roleId, @RequestBody AdminRole role) {
        AdminRole r = adminRoleRepository.findById(roleId).orElseThrow(() -> new com.example.vote.common.exception.BusinessException(404, "角色不存在"));
        if (role.getRoleName() != null) r.setRoleName(role.getRoleName());
        if (role.getRoleCode() != null) r.setRoleCode(role.getRoleCode());
        if (role.getDescription() != null) r.setDescription(role.getDescription());
        if (role.getStatus() != null) r.setStatus(role.getStatus());
        return Result.ok(adminRoleRepository.save(r));
    }

    @DeleteMapping("/delete/{roleId}")
    @Operation(summary = "删除角色")
    public Result<Void> delete(@PathVariable Long roleId) {
        if (!adminRoleRepository.existsById(roleId)) {
            return Result.fail(ResultCode.NOT_FOUND.getCode(), "角色不存在");
        }
        adminRoleRepository.deleteById(roleId);
        return Result.ok();
    }

    @PutMapping("/assign/{roleId}")
    @Operation(summary = "分配角色权限")
    public Result<Void> assign(@PathVariable Long roleId, @RequestBody(required = false) List<Long> permissionIds) {
        if (!adminRoleRepository.existsById(roleId)) {
            return Result.fail(ResultCode.NOT_FOUND.getCode(), "角色不存在");
        }
        return Result.ok();
    }
}
