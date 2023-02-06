import { EventDocument } from '../models/Event';
import { GroupDocument } from '../models/Group';
import { UserDocument } from '../models/User';
import { wishlistDocumentWithIds } from '../models/Wishlist';

export const formatUser = (user: UserDocument) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

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

export const formatEvent = (event: EventDocument) => {
  return {
    id: event.id,
    name: event.name,
    date: event.date,
    group: event.group,
  };
};

export const formatUserWishlist = (wishlist: wishlistDocumentWithIds) => {
  return {
    id: wishlist.id,
    event: wishlist.event,
    user: wishlist.user,
    products: wishlist.products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
      };
    }),
  };
};

export const formatWishlist = (wishlist: wishlistDocumentWithIds) => {
  return {
    id: wishlist.id,
    event: wishlist.event,
    user: wishlist.user,
    products: wishlist.products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        fulfilled: product.isClosed,
        contributions: product.contributions.map((contribution) => {
          return {
            user: contribution.user,
            amount: contribution.amount,
          };
        }),
      };
    }),
  };
};
