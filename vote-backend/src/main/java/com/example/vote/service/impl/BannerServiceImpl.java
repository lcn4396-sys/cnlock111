package com.example.vote.service.impl;

import com.example.vote.entity.Banner;
import com.example.vote.repository.BannerRepository;
import com.example.vote.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {
    private final BannerRepository bannerRepository;

    @Override
    public List<Banner> listEnabled() {
        return bannerRepository.findByStatusOrderBySortOrderAsc(1);
    }
}
