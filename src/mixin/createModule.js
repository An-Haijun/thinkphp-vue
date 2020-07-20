export function createModule(options = {}) {
  // Vue.prototype.$plRouter = new Vue.prototype.$PlRouter({
  //   mode: 'history'
  // })
  // Element-ui 组件默认样式
  Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 2000 }
  Vue.mixin({
    components: {
      
    }
  })
  let vueOptions = {
    ...options
  }
  if (options.hasOwnProperty('el') && options.el) {
    vueOptions.el = options.el
  } else {
    vueOptions.el = '#app'
  }
  return new Vue(vueOptions)
  // .$mount(options.el ? options.el : '#app')
}