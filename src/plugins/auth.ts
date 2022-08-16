import useUserStore from '../store/modules/user'

function authPermission(permission:string | Array<string>) {
  const all_permission = "*:*:*";
  const permissions = useUserStore().permissions
  if (permission && permission.length > 0) {
    return permissions.some((v:string) => {
      return all_permission === v || v === permission
    })
  } else {
    return false
  }
}

function authRole(role:string | Array<string>) {
  const super_admin = "admin";
  const roles = useUserStore().roles
  if (role && role.length > 0) {
    return roles.some((v:string) => {
      return super_admin === v || v === role
    })
  } else {
    return false
  }
}

export default {
  // 验证用户是否具备某权限
  hasPermi(permission:Array<string>) {
    return authPermission(permission);
  },
  // 验证用户是否含有指定权限，只需包含其中一个
  hasPermiOr(permissions:Array<string>) {
    return permissions.some(item => {
      return authPermission(item)
    })
  },
  // 验证用户是否含有指定权限，必须全部拥有
  hasPermiAnd(permissions:Array<string>) {
    return permissions.every(item => {
      return authPermission(item)
    })
  },
  // 验证用户是否具备某角色
  hasRole(role:Array<string>) {
    return authRole(role);
  },
  // 验证用户是否含有指定角色，只需包含其中一个
  hasRoleOr(roles:Array<string>) {
    return roles.some(item => {
      return authRole(item)
    })
  },
  // 验证用户是否含有指定角色，必须全部拥有
  hasRoleAnd(roles:Array<string>) {
    return roles.every(item => {
      return authRole(item)
    })
  }
}
