'use client';
import Cookies from 'js-cookie';

interface ProfileSetting {
  type: 'cookie' | 'save';
  value: string;
}

interface ProfileSettings {
  [key: string]: ProfileSetting;
}

const profileSettings: ProfileSettings = {
  sounds: { type: 'cookie', value: '1' },
  channel: { type: 'cookie', value: 'en' },
  chat: { type: 'cookie', value: '0' },
  cart: { type: 'cookie', value: '0' },
  terms: { type: 'cookie', value: '0' },
  anonymous: { type: 'save', value: '0' },
  private: { type: 'save', value: '0' },
  game: { type: 'cookie', value: 'coinflip' },
};

function saveProfileSettings() {
  const settings: { [key: string]: string } = {};

  Object.keys(profileSettings).forEach((key) => {
    if (profileSettings[key].type === 'cookie') {
      settings[key] = profileSettings[key].value;
    }
  });

  Cookies.set('settings', JSON.stringify(settings));
}

function loadProfileSettings() {
  const settings = JSON.parse(Cookies.get('settings') || '{}');
  // console.log("loading settings", settings);
  if (!settings) {
    saveProfileSettings();
    return;
  }

  Object.keys(settings).forEach((key) => {
    if (profileSettings[key]) {
      profileSettings[key].value = settings[key];
    }
  });

  Object.keys(profileSettings).forEach((key) => {
    if (settings[key] === undefined && profileSettings[key].type === 'cookie') {
      saveProfileSettings();
    }
  });
}

function changeProfileSetting(setting: string, value: string) {
  if (profileSettings[setting] === undefined) return;

  profileSettings[setting].value = value;

  saveProfileSettings();
}

function getProfileSettingValue(setting: string): string | undefined {
  if (profileSettings[setting] === undefined) return undefined;

  return profileSettings[setting].value;
}

export { loadProfileSettings, changeProfileSetting, getProfileSettingValue };
