const POSTS_PER_PAGE = 50;

type Type = (UserType | UserDTO | AuthUserType);

export const GetUserAvatarURL = (user: Type) => {
  if (!user.avatar || user.avatar.length === 0)
    return "https://eliteunitedcrew.org/pic/default_avatar.gif";
  return `https://eliteunitedcrew.org/${user.avatar}`;
}

export const GetUserProfileHref = (user: Type) => {
  if (!user)
    return "#";
  return `/profile/id/${user.id}`;
}

export const GetUserUsername = (user: Type) => {
  if (!user || !user.username)
    return "Nepoznat korisnik";
  return user.username;
}

export const GetUserProfileByUsernameHref = (username: string) => {
  if (!username)
    return "#";
  return `/profile/username/${username}`;
}

export const IsUserStaff = (user?: AuthUserType) => {
  if (user === undefined)
    return false;

  // 12 => Saradnik
  // 13 => Moderator
  // 14 => Senior Moderator
  // 15 => Administrator
  // 16 => Site Admin
  // 17 => roBOT
  // 28 => Root
  return (user.class_id >= 12);
}

export const GetLastTopicPage = (post_count: number) => {
  if (post_count === 0)
    return 1;
  return Math.ceil(post_count / POSTS_PER_PAGE);
}
