/**
 * INAVIST Official Default Profile Avatar
 * Standardized system profile picture
 */

export const DEFAULT_AVATAR = {
  id: "default-avatar",
  title: "Default Traveler",
  image: "/default-avatar.png",
  bgGradient: "linear-gradient(135deg, #29B6F6 0%, #1976D2 100%)"
};

export const NON_HUMAN_AVATARS = [DEFAULT_AVATAR];

export const getAvatarById = () => DEFAULT_AVATAR;

export const AVATAR_CATEGORIES = [];
