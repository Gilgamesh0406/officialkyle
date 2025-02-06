import { toast } from "react-toastify";
import { CaseBattleType } from "./types";

export function roundedToFixed(
  number: number | string,
  decimals: number
): number {
  // Check if the input is a valid number
  if (isNaN(Number(number))) return 0;

  // Convert the input to a number and fix to 5 decimal places
  number = Number(Number(number).toFixed(5));

  // Convert the number to a string for manipulation
  let numberString = number.toString();
  let decimalsStringLength = 0;

  // Check if there's a decimal part and get its length
  const decimalPart = numberString.split(".")[1];
  if (decimalPart !== undefined) {
    decimalsStringLength = decimalPart.length;
  }

  // Adjust the number string to the desired number of decimals
  while (decimalsStringLength - decimals > 0) {
    numberString = numberString.slice(0, -1);
    decimalsStringLength--;
  }

  // Convert the final string back to a number
  return Number(numberString);
}

export function getFormatAmount(amount: number | string): number {
  return roundedToFixed(Number(amount), 2);
}

export function getFormatAmountString(amount: number | string): string {
  return getFormatAmount(amount).toFixed(2);
}

export function getNumberFromString(amount: string | number): number {
  const trimmedAmount = amount.toString().trim();
  if (trimmedAmount.length <= 0) return 0;
  if (isNaN(Number(trimmedAmount))) return 0;

  return Number(trimmedAmount);
}

export function stringEscape(input: string): string {
  return input.toString().replace(/"/g, "&quot;");
}

export function stringUnescape(input: string): string {
  return input.toString().replace(/(&quot;)/g, '"');
}

// Function to generate a random code and set it to the input field
export function generateCode(length: number): string {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

// Function to format time in seconds to an object containing days, hours, minutes, and seconds
export function getFormatSeconds(time: number): {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
} {
  let days = Math.floor(time / (24 * 60 * 60)).toString();
  let hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60)).toString();
  let minutes = Math.floor((time % (60 * 60)) / 60).toString();
  let seconds = Math.floor(time % 60).toString();

  if (days.length < 2) days = "0".concat(days);
  if (hours.length < 2) hours = "0".concat(hours);
  if (minutes.length < 2) minutes = "0".concat(minutes);
  if (seconds.length < 2) seconds = "0".concat(seconds);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

// Function to convert a hex color code to an RGB object
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Function to capitalize the first letter of a string
export function capitalizeText(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Function to get the current Unix timestamp in seconds
export function time(): number {
  return Math.floor(Date.now() / 1000);
}

// Function to calculate fee from commission and amount
const getFeeFromCommission = (amount: number, commission: number): number => {
  return roundedToFixed((amount * commission) / 100, 5);
};

// Function to calculate profit from amount, multiplier and commission(percent)
// For PoC, commission is set statically inside this function, should be fetched from BE or socket
export function getProfitFromAmount(
  amount: number,
  multiplier: number
): number {
  const commission = 5; // percent
  const formattedAmount = getFormatAmount(amount * multiplier);
  const profit =
    getFormatAmount(
      formattedAmount - getFeeFromCommission(formattedAmount, commission)
    ) - amount;
  return getFormatAmount(profit);
}

export function timeAgo(timestamp: number): string {
  const now = Date.now();
  const difference = now - timestamp;

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return years === 1 ? "1 year ago" : `${years} years ago`;
  } else if (months > 0) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else if (weeks > 0) {
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  } else if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  }
}

export const handleCopy = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.info("Successfully copied to clipboard.");
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
};

export const formatTimeFromStringTimestamp = (input: string) => {
  const timestamp = parseInt(input);

  // Convert the timestamp to milliseconds
  const date = new Date(timestamp * 1000);

  // Define options for formatting the date
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  // Format the date according to the options
  const formattedDate = date.toLocaleDateString("en-GB", options);
  return formattedDate;
};

export const getWinnings = (casebattle: CaseBattleType, position: number) => {
  const total = casebattle.players.reduce((acc, val) => acc + val.total, 0);
  if (casebattle.mode === 3) {
    return position % 2 === 0
      ? getFormatAmount(total / 2)
      : getFormatAmount(total - total / 2);
  }
  return total;
};

export const getPlayersCountForCaseBattle = (mode: number) => {
  return [2, 3, 4, 4][mode];
};

export function deepMerge<T extends Record<string, any>>(
  target: any,
  ...sources: Partial<any>[]
): T {
  if (!sources.length) return target;

  const source = sources.shift();

  if (source === undefined) return target;

  if (Array.isArray(target) && Array.isArray(source)) {
    target = [...target, ...source] as any;
  } else if (typeof target === "object" && typeof source === "object") {
    for (const key in source) {
      if (source[key] !== undefined) {
        if (typeof source[key] === "object" && !Array.isArray(source[key])) {
          if (!target[key]) {
            target[key] = {} as any;
          }
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  }

  return deepMerge(target, ...sources);
}

export function playSound(sound: string) {
  const audio = new Audio("/audio/" + sound + ".wav");
  audio.play();
}

export function underDevelopment() {
  toast.warn("This feature is still under development!");
}

export function convertBigIntToString(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  }
  if (obj !== null && typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      if (typeof obj[key] == "bigint") newObj[key] = obj[key].toString();
      else newObj[key] = convertBigIntToString(obj[key]);
    }
    return newObj;
  }
  return obj;
}

export function getRankName(rank: number): string {
  return ["User", "Moderator", "Admin"][rank];
}
