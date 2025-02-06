const crypto = require('crypto');
const config = require('../config');

const getSiteAlerts = () => {
    if(new Date().getDay() === 0 || new Date().getDay() === 6) {
        return config.settings.server.alerts.concat(config.chat.message_double_xp);
    }
    return config.settings.server.alerts;
}

const getSiteNotifies = () => {
    return config.settings.server.notifies;
}

const getFormatAmount = amount => roundedToFixed(amount, 2);

const getFormatAmountString = (amount) => {
	return getFormatAmount(amount).toFixed(2);
}

const roundedToFixed = (number, decimals) => {
    if(isNaN(Number(number))) return 0;

	number = Number((Number(number).toFixed(5)));

	let number_string = number.toString();
	let decimals_string = 0;

	if(number_string.split('.')[1] !== undefined)
        decimals_string = number_string.split('.')[1].length;

	while(decimals_string - decimals > 0) {
		number_string = number_string.slice(0, -1);
		
		decimals_string--;
	}

	return Number(number_string);
};

const isJsonString = (string) => {
    try {
        JSON.parse(string);
    } catch (e) {
        return false;
    }
    return true;
}

const getFeeFromCommission = (amount, commission) => {
    return roundedToFixed(amount * commission / 100, 5);
}

const getXpByAmount = (amount) => {
    let xp = parseInt(getFormatAmount(amount) * 100);

    if(new Date().getDay() == 0 || new Date().getDay() == 6)
        xp *= 2;

    return xp;
}

const calculateLevel = (xp) => {
    let start = 0;
	let next = config.rewards.level.start;
	
	let level = 0;
	
	for(let i = 1; next <= xp && level < 100; i++){
		start = next;
		next += parseInt(next * config.rewards.level.next * (1.00 - 0.0095 * level));
		
		level++;
	}
	
	return {
		level: level,
		start: 0,
		next: next - start,
		have: ((xp > next) ? next : xp) - start
	};
};

const time = () => {
    return parseInt(new Date().getTime()/1000);
}

const countDecimals = (value) => {
    if (Math.floor(value) !== value)
        return value.toString().split('.')[1].length || 0;

    return 0;
}

const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getColorByQuality = (quality) => {
    return {
		'consumer_grade': '#b0c3d9',
		'mil_spec_grade': '#4b69ff',
		'industrial_grade': '#5e98d9',
		'restricted': '#8847ff',
		'classified': '#d32ce6',
		'covert': '#eb4b4b',
		'base_grade': '#b0c3d9',
		'extraordinary': '#eb4b4b',
		'high_grade': '#4b69ff',
		'remarkable': '#8847ff',
		'exotic': '#d32ce6',
		'contraband': '#e4ae39',
		'distinguished': '#4b69ff',
		'exceptional': '#8847ff',
		'superior': '#d32ce6',
		'master': '#eb4b4b'
	}[quality];
}

const getTimeString = (string) => {
	let timeRestriction = 0;

	if(string == 'permanent')
		timeRestriction = -1;
	else {
		const reg = /^([0-9]*)([a-zA-Z]*)/.exec(string);

		if(reg[2] == "minutes")
			timeRestriction = parseInt(time() + (reg[1] * 60));
		else if(reg[2] == "hours")
			timeRestriction = parseInt(time() + (reg[1] * 60 * 60));
		else if(reg[2] == "days")
			timeRestriction = parseInt(time() + (reg[1] * 60 * 60 * 24));
		else if(reg[2] == "months")
			timeRestriction = parseInt(time() + (reg[1] * 60 * 60 * 24 * 30));
		else if(reg[2] == "years")
			timeRestriction = parseInt(time() + (reg[1] * 60 * 60 * 24 * 30 * 12));
	}

	return timeRestriction;
}

const makeDate = (date) => {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const hours = date.getHours();
	const typeTime = hours < 12 ? "AM" : "PM";
	const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
	const formattedMinutes = date.getMinutes().toString().padStart(2, '0');

	return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()} ${formattedHours}: ${formattedMinutes} ${typeTime}`
}

const getFormatSeconds = (time) => {
	const secondsInDay = 24 * 60 * 60;
	const secondsInHour = 60 * 60;
	const secondsInMinute = 60;

	const days = Math.floor(time / secondsInDay);
	time -= days * secondsInDay;

	const hours = Math.floor(time / secondsInHour);
	time -= hours * secondsInHour;

	const minutes = Math.floor(time / secondsInMinute);
	const seconds = time - minutes * secondsInMinute;

	return {
		days: String(days).padStart(2, "0"),
		hours: String(hours).padStart(2, "0"),
		minutes: String(minutes).padStart(2, "0"),
		seconds: String(seconds).padStart(2, "0")
	}
}

module.exports = {
    getFormatAmount,
    roundedToFixed,
    calculateLevel,
    getSiteAlerts,
    getSiteNotifies,
    time,
	getTimeString,
	makeDate,
	getFormatSeconds,
    isJsonString,
    getFeeFromCommission,
    getXpByAmount,
    getFormatAmountString,
    countDecimals,
	getRandomInt,
    getColorByQuality
};
