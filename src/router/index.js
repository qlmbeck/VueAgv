import Vue from 'vue'
import Router from 'vue-router'
import Agv from '@/components/Agv'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Agv',
      component: Agv
    }
  ]
})
