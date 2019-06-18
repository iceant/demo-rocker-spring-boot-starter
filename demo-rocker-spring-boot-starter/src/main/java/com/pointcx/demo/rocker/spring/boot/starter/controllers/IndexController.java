package com.pointcx.demo.rocker.spring.boot.starter.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class IndexController {
    @RequestMapping(path = {"", "/", "/index", "/home"})
    public ModelAndView index(){
        ModelAndView view = new ModelAndView("index");
        return view;
    }
}
