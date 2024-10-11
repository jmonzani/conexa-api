import { UserProfileDto } from 'src/users/dto/user-profile.dto';

export const ACCESS_DENIED = { status: 403, description: 'Access denied.' };

export const USER_PROFILE_SUCCES = {
  status: 200,
  description: 'Found current logged in user.',
  type: UserProfileDto,
};
