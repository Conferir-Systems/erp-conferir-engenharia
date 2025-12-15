import { MOCK_USER_TYPE_ADMIN } from './userTypes.mocks'
import { User } from '../../../types/users/users'

export const MOCK_USER_ADMIN: User = {
  id: '9ee534d9-fa4d-446b-939f-3b83a8fa2da2',
  firstName: 'Mauricío',
  lastName: 'Vieira',
  email: 'mauricio@mail.com',
  passwordHash:
    '$argon2id$v=19$m=65536,t=3,p=4$vrtPYWHpYaMiAYvebR4htg$9WhppOesu2sIgQLpWaSFqqGvF1z8/1Aw7RL/wRaTXBo',
  userType: MOCK_USER_TYPE_ADMIN.id,
}
