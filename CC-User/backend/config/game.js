module.exports = {
    winning_to_chat: 50000.00,
    eos_getChainInfo_url: 'https://eos.greymass.com/v1/chain/get_info',
    eos_getBlock_url: 'https://eos.greymass.com/v1/chain/get_block',
    eos_future: 1,
    commissions: {
        coinflip: 5,
        unboxing: 0,
        casebattle: 0,
        plinko: 5
    },
    games: {
        coinflip: {
            cancel: true,
            timer_cancel: 1 * 60 * 60,
            timer_wait_start: 3,
            timer_delete: 1 * 60,
            max_game_count: 5
        },
        unboxing: {
            cases_length: { min: 1, max: 5 }
        },
        casebattle: {
            interval_cases: { min: 1, max: 20 },
            timer_countdown: 3,
            timer_wait_start: 1,
            timer_delete: 1 * 60,
            max_game_count: 5
            // cashback: 1
        },
        plinko: {
            results: {
                low: [7.1, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 7.1],
                medium: [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58],
                high: [420, 56, 18, 5, 1.9, 0.3, 0.2, 0.2, 0.2, 0.3, 1.9, 5, 18, 56, 420]
            }
        }
    }
};