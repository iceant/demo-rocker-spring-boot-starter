package com.pointcx.demo.rocker.spring.boot.starter.controllers;

import com.fizzed.rocker.runtime.StringBuilderOutput;
import com.pointcx.demo.rocker.spring.boot.starter.fragment.WebFragment;
import com.pointcx.rocker.spring.boot.starter.RockerProperties;
import com.pointcx.rocker.spring.boot.starter.SpringRocker;
import com.pointcx.rocker.spring.boot.starter.reload.ResourceResolver;
import com.pointcx.rocker.spring.boot.starter.reload.SimpleResourceResolver;
import com.pointcx.rocker.spring.boot.starter.reload.SpringRockerReloadingBootstrap;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FragmentController {
    final ApplicationContext applicationContext;
    final RockerProperties properties;
    private SpringRockerReloadingBootstrap rockerBootstrap;
    private SpringRocker rocker;
    private ResourceResolver resourceResolver;

    public FragmentController(ApplicationContext applicationContext, RockerProperties properties) {
        this.applicationContext = applicationContext;
        this.properties = properties.clone();
        this.properties.setSuffix(null);
        this.resourceResolver = new SimpleResourceResolver(applicationContext, this.properties);

        rockerBootstrap=new SpringRockerReloadingBootstrap(this.properties, this.resourceResolver);

        this.rocker = new SpringRocker(rockerBootstrap);
    }


    @RequestMapping(path = {"/fragment/{name}"}, produces = {MediaType.APPLICATION_JSON_UTF8_VALUE})
    public Object fragment(@PathVariable("name") String fragmentName){
        String template = null;
        String control = null;
        String style = null;
        try {
            template = rocker.template("fragments/" + fragmentName + "/template.html").render(StringBuilderOutput.FACTORY).toString();
        }catch (Exception err){
            err.printStackTrace();
        }
        try {
            control = rocker.template("fragments/" + fragmentName + "/control.js").render(StringBuilderOutput.FACTORY).toString();
        }catch (Exception err){
            err.printStackTrace();
        }
        try {
            style = rocker.template("fragments/" + fragmentName + "/style.css").render(StringBuilderOutput.FACTORY).toString();
        }catch (Exception err){
            err.printStackTrace();
        }

        return new WebFragment(template, control, style);
    }
}
