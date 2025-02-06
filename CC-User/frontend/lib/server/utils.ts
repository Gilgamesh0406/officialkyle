import { createHash } from 'crypto';

export interface Browser {
  name: string;
  version: string;
}

export interface OS {
  name: string;
  version: string;
}

export interface UserDevice {
  browser: Browser;
  platform: string;
  os: OS;
  device: string;
  mobile: boolean;
}

export function hashSha256(seed: string): string {
  return createHash('sha256').update(seed).digest('hex');
}

export const serializeData = (data: any) => {
  const serializedData = JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
  return serializedData;
};

export function generateHexCode(length: number): string {
  const possible = 'abcdef0123456789';
  let text = '';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export const getUserAgent = (): string => {
  // Simulate retrieving user agent
  return 'User-Agent-String';
};

export const getDevice = () => {
  const device = require('crypto')
    .createHash('sha256')
    .update(getUserAgent())
    .digest('hex');
  return device;
};

export const getUserIp = (): string => {
  // Simulate retrieving user IP
  return '192.168.1.1';
};

export const getUserLocation = (ip: string): string => {
  // Simulate retrieving user location
  return 'Location based on IP';
};

// Helper function to generate email message
export const generateEmailMessage = (securityCode: string): string => {
  return `
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #333;
        }
        .greeting {
        text-align: left;
    }
     .main {
            text-align: center;
        }
        .container {
            width: 80%;
            margin: auto;
        }
        .logo {
            display: block;
            margin: auto;
            width: 200px; /* Adjust as needed */
        }
        .middle {
            background-color: #360303;
            color: #fff;
            padding: 20px;
            border-radius: 10px;
        }
        h1, p {
            text-align: center;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.8em;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://crazycargo.gg/template/img/testlogo.png?v=1712813557" alt="Logo" class="logo"> <!-- Replace with your logo URL -->
        <div class="middle">
            <h3 class="middle">CrazyCargo Security Code:</h3>
            <h2 class="middle">${securityCode}</h2>
            <p class="middle">If you didn\'t request this code, please go to your <a href="https://crazycargo.gg/profile">Profile</a> page and change your password right away.</a></p>
            <p class="middle">For assistance, please <a href="https://crazycargo.gg/support">contact us</a></p>
        </div>
        <p class="footer">This email message was auto-generated. Please do not respond. If you need additional help, please visit <a href="https://crazycargo.gg/support">Support</a>.</p>
    </div>
</body>
</html>`;
};

export function calculateLevel(xp: number): {
  level: number;
  start: number;
  next: number;
  have: number;
} {
  // Assuming these are defined elsewhere in the TypeScript code
  const level_start: number = 500;
  const level_next: number = 0.235;

  let start: number = 0;
  let next: number = level_start;

  let level: number = 0;

  for (let i = 1; next <= xp && level < 100; i++) {
    start = next;
    next += Math.floor(next * level_next * (1.0 - 0.0095 * level));

    level++;
  }

  return {
    level: level,
    start: 0,
    next: next - start,
    have: (xp > next ? next : xp) - start,
  };
}

export function getUserDevice(userAgent: string): UserDevice {
  const browser: Browser = { name: '', version: '' };
  let platform: string = 'Unknown';
  const os: OS = { name: '', version: '' };
  let device: string = 'Unknown';

  // Is Mobile
  const mobile: boolean = /Mobile/i.test(userAgent);

  // Browser
  if (/MSIE/i.test(userAgent) && !/Opera/i.test(userAgent)) {
    browser.name = 'Internet Explorer';
    const matches = userAgent.match(/MSIE (\d+(\.\d+)?)/i);
    if (matches) browser.version = matches[1].trim();
  } else if (/Firefox/i.test(userAgent)) {
    browser.name = 'Mozilla Firefox';
    const matches = userAgent.match(/Firefox\/(\d+(\.\d+)?)/i);
    if (matches) browser.version = matches[1].trim();
  } else if (/Chrome/i.test(userAgent)) {
    if (userAgent.includes('Brave')) browser.name = 'Brave Browser';
    else if (userAgent.includes('HuaweiBrowser'))
      browser.name = 'Huawei Browser';
    else if (userAgent.includes('Edg')) browser.name = 'Microsoft Edge';
    else if (userAgent.includes('YaBrowser')) browser.name = 'Yandex Browser';
    else if (userAgent.includes('UCBrowser')) browser.name = 'UC Browser';
    else if (userAgent.includes('SamsungBrowser'))
      browser.name = 'Samsung Browser';
    else if (userAgent.includes('OPR') || userAgent.includes('Opera'))
      browser.name = 'Opera';
    else browser.name = 'Google Chrome';

    const matches = userAgent.match(/Chrome\/(\d+(\.\d+)?)/i);
    if (matches) browser.version = matches[1].trim();
  } else if (/Safari/i.test(userAgent)) {
    browser.name = 'Apple Safari';
    const matches = userAgent.match(/Version\/(\d+(\.\d+)?)/i);
    if (matches) browser.version = matches[1].trim();
  } else if (/Opera/i.test(userAgent)) {
    browser.name = 'Opera';
    const matches = userAgent.match(/Opera\/(\d+(\.\d+)?)/i);
    if (matches) browser.version = matches[1].trim();
  }

  // Platform & OS
  if (/Windows/i.test(userAgent)) {
    platform = 'Windows';
    os.name = 'Windows';

    const phoneMatches = userAgent.match(
      /Phone (OS )?([\d\.]+)(;\s+([^\)]+)\))?/i
    );
    if (phoneMatches) {
      os.name = 'Windows Phone';
      if (phoneMatches[2]) os.version = phoneMatches[2].trim();
      if (phoneMatches[4]) {
        const deviceParts = phoneMatches[4].split(';');
        if (deviceParts[0]) device = deviceParts[0].trim();
      }
    } else {
      const ntMatches = userAgent.match(/NT ([\d\.]+)(;\s+([^\)]+)\))?/i);
      if (ntMatches) {
        const arrayVersions: { [key: string]: string } = {
          '10.0': '10',
          '6.3': '8.1',
          '6.2': '8',
          '6.1': '7',
          '6.0': 'Vista',
          '5.1': 'XP',
          '5.0': '2000',
        };
        if (ntMatches[1] && ntMatches[1].trim() in arrayVersions) {
          os.version = arrayVersions[ntMatches[1].trim()];
        }
        if (ntMatches[3]) {
          const deviceParts = ntMatches[3].split(';');
          if (deviceParts[0]) device = deviceParts[0].trim();
        }
      }
    }
  } else if (/iPhone/i.test(userAgent)) {
    platform = 'iOS';
    os.name = 'iPhone';
    const matches = userAgent.match(/iPhone OS ([\d\.]+)(;\s+([^\)]+)\))?/i);
    if (matches) {
      if (matches[1]) os.version = matches[1].trim();
      if (matches[3]) {
        const deviceParts = matches[3].split(';');
        if (deviceParts[0]) device = deviceParts[0].trim();
      }
    }
  } else if (/iPad/i.test(userAgent)) {
    platform = 'iOS';
    os.name = 'iPad';
    const matches = userAgent.match(/CPU OS ([\d\.]+)(;\s+([^\)]+)\))?/i);
    if (matches) {
      if (matches[1]) os.version = matches[1].trim();
      if (matches[3]) {
        const deviceParts = matches[3].split(';');
        if (deviceParts[0]) device = deviceParts[0].trim();
      }
    }
  } else if (/Macintosh/i.test(userAgent)) {
    platform = 'Mac OS X';
    os.name = 'Macintosh';
    const matches = userAgent.match(/Mac OS X ([\d\.]+)(;\s+([^\)]+)\))?/i);
    if (matches) {
      if (matches[1]) os.version = matches[1].trim();
      if (matches[3]) {
        const deviceParts = matches[3].split(';');
        if (deviceParts[0]) device = deviceParts[0].trim();
      }
    }
  } else if (/Android/i.test(userAgent)) {
    platform = 'Android';
    os.name = /Mobile/i.test(userAgent) ? 'Android Phone' : 'Android Tablet';
    const matches = userAgent.match(/Android ([\d\.]+)(;\s+([^\)]+)\))?/i);
    if (matches) {
      if (matches[1]) os.version = matches[1].trim();
      if (matches[3]) {
        const deviceParts = matches[3].split(';');
        if (deviceParts[0]) device = deviceParts[0].trim();
      }
    }
  } else if (/Linux/i.test(userAgent)) {
    platform = 'Linux';
    if (/Ubuntu/i.test(userAgent)) {
      os.name = 'Ubuntu';
      const matches = userAgent.match(/Ubuntu\/([\d\.]+)(;\s+([^\)]+)\))?/i);
      if (matches) {
        if (matches[1]) os.version = matches[1].trim();
        if (matches[3]) {
          const deviceParts = matches[3].split(';');
          if (deviceParts[0]) device = deviceParts[0].trim();
        }
      }
    }
  }

  return {
    browser,
    platform,
    os,
    device,
    mobile,
  };
}
