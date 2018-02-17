// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import $ from 'jquery'
import '../node_modules/_bootstrap@4.0.0@bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/_bootstrap@4.0.0@bootstrap/dist/js/bootstrap.min.js'
import '../node_modules/_datatables-bootstrap3-plugin@0.5.0@datatables-bootstrap3-plugin/example/css/datatables-bootstrap3.css'
import '../node_modules/_datatables-bootstrap3-plugin@0.5.0@datatables-bootstrap3-plugin/example/js/datatables-bootstrap3.js'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
