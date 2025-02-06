const { steam } = require("./config");

module.exports = {
    level: {
        start: 500,
        next: 0.235,
    },
    level_send_coins: 5,
    level_receive_coins: 5,
    rain: {
        start: 1.00,
        cooldown_start: 1 * 60,
        timeout_interval: { min: 10 * 60, max: 30 * 60 }
    },
    multiplier_wager_withdraw: 3 / 4,
    interval_amount: {
        coinflip: { min: 0.01, max: 1000.00 },
        plinko: { min: 0.01, max: 1000.00 },
        send_coins: { min: 0.01, max: 100.00 },
        tip_rain: { min: 0.01, max: 500.00 },
        withdraw_crypto: { min: 2.00, max: 500.00 },
        deposit_item: { min: 0.01, max: 2000.00 },
        withdraw_item: { min: 0.01, max: 2000.00 },
        deposit_p2p: { min: 0.01, max: 500.00 },
        deposit_steam: { min: 0.01, max: 500.00 },
        withdraw_steam: { min: 0.01, max: 500.00 }
    },
    rewards_amount: {
        steam: 0.50,
        google: 0.50,
        discord: 0.50,
        facebook: 0.50,
        refferal_code: 1.00,
        daily_start: 0.20,
        daily_step: 0.02
    },
    rewards_requirements: {
        code_length: { min: 6, max: 20 },
        bonus_uses: { min: 1, max: 500 },
        bonus_amount: { min: 0.01, max: 10.00 }
    },
    affiliates_requirements: [0.00, 200.00, 500.00, 750.00, 1000.00, 2000.00, 3500.00, 5000.00, 7500.00, 10000.00],
    affiliates_commission: {
        deposit: 1,
        bet: 2
    },
    daily_requirements: {
        amount: 5.00,
        time: 7 * 24 * 60 * 60
    },
    join_referral: {
        code_length: 64,
        usage_length: { min: 4, max: 20 }
    },
    deposit_bonuses: {
        code_length: { min: 6, max: 12 },
    },
    dailycases:{
        time: 24
    },
    items: {
        prices: {
            steamUrl: 'https://steamwebapi.com/steam/api/items',
            apikey: {
                key: 'BKFSXJO1E03XD1U8'
            },
            cooldown_load: 24 * 60 * 60
        }
    },
    interval_items: {
        deposit: { min: 1, max: 20 },
        withdraw: { min: 1, max: 20 },
        p2p: { min: 1, max: 20 }
    },
    admin: {
        casecreator_requirements: {
            name_length: { min: 4, max: 20 },
            items_length: { min: 2, max: 50 },

            unboxing: {
                offset: { min: -10, max: 10 }
            },
            dailycases: {
                level: { min: 0, max: 100 }
            }
        },
        gamebots_requirements: {
            name_length: { min: 4, max: 20 }
        }
    }
}