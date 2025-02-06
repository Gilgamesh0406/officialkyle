const log4js = require('log4js');

const updateLogs = async () => {
    const { default: dateFormat } = await import ('dateformat');
    const date = dateFormat(new Date(), 'dd.MM.yyyy');

    log4js.configure({
        appenders: {
            out: { type: 'console' },
            app: { type: 'file', filename: `logs/${date}.log` }
        },
        categories: {
            default: { appenders: ['out', 'app'], level: 'all' }
        }
    });

    setTimeout(updateLogs, 24 * 3600 * 1000);
};

updateLogs();
const logger = log4js.getLogger();

module.exports = logger;
