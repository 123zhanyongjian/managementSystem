import store from '@/store'
import vue from 'vue'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
vue.directive('hasPermiss', { inserted: (el, { value }) => {
  console.log(store.state.user.btnPer + value, store.state.user.userBtnPermisson)
  if (!store.state.user.userBtnPermisson.some(ite => ite === store.state.user.btnPer + value)) {
    el.remove()
  }
} })

// export default function checkPermission(value) {
//   if (value && value instanceof Array && value.length > 0) {
//     const roles = store.getters && store.getters.roles
//     const permissionRoles = value

//     const hasPermission = roles.some(role => {
//       return permissionRoles.includes(role)
//     })
//     return hasPermission
//   } else {
//     console.error(`need roles! Like v-permission="['admin','editor']"`)
//     return false
//   }
// }
