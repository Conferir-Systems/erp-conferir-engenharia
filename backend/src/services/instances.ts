import { userRepository } from '../repository/users/users'
import { userTypeRepository } from '../repository/users/userTypes'
import { workRepository } from '../repository/works/works'
import { UserService } from './users/createUser'
import { UserTypeService } from './users/createUserType'
import { WorkService } from './works/works'

export const userService = new UserService(userRepository, userTypeRepository)

export const userTypeService = new UserTypeService(userTypeRepository)

export const workService = new WorkService(workRepository)
