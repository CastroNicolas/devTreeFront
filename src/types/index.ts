export type User = {
  handle: string;
  name: string;
  _id: string;
  email: string;
  description: string;
  image: string;
  links: string;
};
export type UserHandle = Pick<
  User,
  "description" | "image" | "links" | "name" | "handle"
> & {
  password: string;
};
export type RegisterForm = Pick<User, "handle" | "name" | "email"> & {
  password: string;
  password_confirmation: string;
};

export type LoginForm = Pick<User, "email"> & {
  password: string;
};

export type ProfileForm = Pick<User, "handle" | "description">;

export type SocialNetwork = {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
};

export type DevTreeLink = Pick<SocialNetwork, "name" | "url" | "enabled">;
