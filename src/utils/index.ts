export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const isValidURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const validateSocialUrl = (
  url: string,
  socialNetwork: string
): boolean => {
  const socialPatterns: { [key: string]: RegExp } = {
    facebook: /^https?:\/\/(www\.)?facebook\.com\/[\w.-]+\/?$/,
    github: /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/,
    instagram: /^https?:\/\/(www\.)?instagram\.com\/[\w.-]+\/?$/,
    x: /^https?:\/\/(www\.)?(?:twitter\.com|x\.com)\/[\w-]+\/?$/,
    youtube:
      /^https?:\/\/(www\.)?youtube\.com\/(c|channel|user|@)?([\w-]+)\/?$/,
    tiktok: /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/?$/,
    twitch: /^https?:\/\/(www\.)?twitch\.tv\/[\w-]+\/?$/,
    linkedin: /^https?:\/\/(www\.)?linkedin\.com\/(?:in|company)\/[\w-]+\/?$/,
  };

  const pattern = socialPatterns[socialNetwork.toLowerCase()];
  if (!pattern) {
    return false;
  }

  return pattern.test(url);
};
