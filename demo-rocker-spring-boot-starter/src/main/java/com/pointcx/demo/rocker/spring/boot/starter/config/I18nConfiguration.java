package com.pointcx.demo.rocker.spring.boot.starter.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

import java.util.Locale;

@Configuration
public class I18nConfiguration implements WebMvcConfigurer {
    @Bean
    public LocaleResolver localeResolver() {
        AcceptHeaderLocaleResolver resolver = new AcceptHeaderLocaleResolver();
        resolver.setDefaultLocale(Locale.ENGLISH);
        return resolver;
    }

    @Value("${spring.messages.basename}")
    String messageSourceBasename;

    @Value("${spring.messages.encoding}")
    String messageSourceEncoding;


    @Bean(name = "messageSource")
    public MessageSource defaultMessageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setDefaultEncoding(messageSourceEncoding);
        messageSource.setBasename(messageSourceBasename);
        messageSource.setFallbackToSystemLocale(false);
        return messageSource;
    }
}
