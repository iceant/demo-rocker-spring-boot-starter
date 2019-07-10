package com.pointcx.demo.rocker.spring.boot.starter.fragment;

import java.io.Serializable;

public class WebFragment implements Serializable {
    private String template;
    private String control;
    private String style;

    public WebFragment() {
    }

    public WebFragment(String template, String control, String style) {
        this.template = template;
        this.control = control;
        this.style = style;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public String getControl() {
        return control;
    }

    public void setControl(String control) {
        this.control = control;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }
}
