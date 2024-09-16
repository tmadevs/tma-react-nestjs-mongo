import { config } from "~/config";

export function generateTelegramUrl(): string {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return `https://t.me/${config.botName}/dev`;
  }
  return `https://t.me/${config.botName}/onboarding`;
}

export function generateReferralTelegramUrl(id: string, text: string = "") {
  const encodedText = encodeURIComponent(text);
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return `https://t.me/share/url?text=${encodedText}&url=http://t.me/dev?startapp=${id}`;
  }
  return `https://t.me/share/url?text=${encodedText}&url=https://t.me/${config.botName}/onboarding?startapp=${id}`;
}

export function generateReferralUrl(id: string) {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return `https://t.me/${config.botName}/dev?startapp=${id}`;
  }
  return `https://t.me/${config.botName}/onboarding?startapp=${id}`;
}