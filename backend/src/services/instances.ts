/**
 * Service instances with dependency injection
 * This file creates and exports singleton instances of services
 * with their dependencies injected
 */

import { userRepository } from '../repository/users/users'
import { userTypeRepository } from '../repository/users/userTypes'
import { workRepository } from '../repository/works/works'
import { UserService } from './users/createUser'
import { UserTypeService } from './users/createUserType'
import { WorkService } from './works/works'

// Create UserService instance with injected dependencies
export const userService = new UserService(userRepository, userTypeRepository)

// Create UserTypeService instance with injected dependencies
export const userTypeService = new UserTypeService(userTypeRepository)

// Create WorkService instance with injected dependencies
export const workService = new WorkService(workRepository)
