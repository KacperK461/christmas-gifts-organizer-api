import { GroupDocument } from '../models/Group';
import { UserDocument } from '../models/User';

export const formatGroup = async (group: GroupDocument) => {
  const populatedGroup = await group.populate<{ members: { user: UserDocument }[] }>({
    path: 'members.user',
    select: 'id name email',
  });

  return {
    id: populatedGroup.id,
    name: populatedGroup.name,
    members: populatedGroup.members.map(({ user }) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    }),
  };
};
