
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other libraries. It is a great starting point when
 * building robust, powerful web applications using React and Laravel.
 */

require('./bootstrap');
 
import React from "react";
import ReactDOM ,{ render } from "react-dom";
import App  from "./components/App"
 

render(<App/>,document.getElementById("app"));