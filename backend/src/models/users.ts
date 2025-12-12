export type User = {
  id: string
  email: string
  passwordHash: string
}

export type UserDatabaseRow = {
  id: string
  email: string
  password: string
}
