package com.pointcx.demo.rocker.spring.boot.starter.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class SecurityController {
    @RequestMapping(path = {"/login"})
    public ModelAndView login(){
        ModelAndView view = new ModelAndView("security/login");
        return view;
    }
}
