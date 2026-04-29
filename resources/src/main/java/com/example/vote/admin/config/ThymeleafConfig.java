package com.example.vote.admin.config;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.thymeleaf.extras.springsecurity5.dialect.SpringSecurityDialect;
import org.thymeleaf.spring5.SpringTemplateEngine;

/**
 * 注册 Thymeleaf 的 Spring Security 方言，使模板中 sec:authorize、sec:authentication 等生效
 */
@Configuration
public class ThymeleafConfig {

    @Bean
    public BeanPostProcessor thymeleafSecurityDialectPostProcessor() {
        return new BeanPostProcessor() {
            @Override
            public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
                if (bean instanceof SpringTemplateEngine) {
                    ((SpringTemplateEngine) bean).addDialect(new SpringSecurityDialect());
                }
                return bean;
            }
        };
    }
}
