import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import create from '@/pages/create'
import edit from '@/pages/edit'
import control from '@/pages/control'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/create',
      name: 'create',
      component: create
    },
    {
      path: '/edit/:key',
      name: 'edit',
      component: edit
    },
    {
      path: '/control',
      name: 'control',
      component: control
    }
  ]
})
