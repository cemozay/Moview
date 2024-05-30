import { Timestamp } from "firebase/firestore";

export const baseImagePath = (size: string, path: string) => {
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const formatTimestamp = (timestamp: Timestamp | undefined) => {
  if (!timestamp) return "";
  const now = new Date();
  const date = timestamp.toDate();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInHours = diffInSeconds / 3600;
  const diffInDays = diffInSeconds / 86400;
  const diffInWeeks = diffInSeconds / (86400 * 7);
  const diffInMonths = diffInSeconds / (86400 * 30);

  if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)} days ago`;
  } else if (diffInWeeks < 4) {
    return `${Math.floor(diffInWeeks)} weeks ago`;
  } else {
    return `${Math.floor(diffInMonths)} months ago`;
  }
};
