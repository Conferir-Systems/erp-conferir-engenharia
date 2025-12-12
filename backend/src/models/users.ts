export type User = {
  id: string
  email: string
  passwordHash: string
  userType: UserTypes
}

export type UserTypes = {
  id: string
  name: string
  description?: string
  permission: Permission[]
}

export type Permission = {
  id: string
  name: string
  module: string
}

export type TypeUserPermissions = {
  typeUserId: string
  permissionId: string
}

export type UserResponse = {
  id: string
  email: string
}

export type UserDatabaseRow = {
  id: string
  email: string
  password: string
}
