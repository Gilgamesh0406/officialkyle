module.exports = {
    name: 'crazycargo.gg',
    abbreviation: 'crazycargo',
    url: 'https://crazycargo.gg',
    root: '/',
    frontend: '../html-frontend',
    access_secrets: ['ib2PCJ'],
    ranks_name: {
        '0': 'member',
        '1': 'admin',
        '2': 'moderator',
        '3': 'helper',
        '4': 'veteran',
        '5': 'pro',
        '6': 'youtuber',
        '7': 'streamer',
        '8': 'developer',
        '100': 'owner'
    },
    banip_excluded: ['owner'],
    ban_excluded: ['owner'],
    banplay_excluded: ['owner'],
    bantrade_excluded: ['owner'],
    mute_excluded: ['owner'],
    pause_excluded: ['owner', 'admin', 'moderator'],
    maintenance_excluded: ['owner', 'developer', 'admin', 'moderator', 'helper'],
    bonus_allowed: ['owner', 'admin'],
    playoffline_allowed: ['owner'],
    tradeoffline_allowed: ['owner'],
    profile_allowed: ['owner', 'admin'],
    refillshop_allowed: ['owner'],
    gamebots_allowed: ['owner'],
    flood: {
        time: 100 * 10e5, // IN NANOSECONDS
        count: 5
    },
    recaptcha: {
        private_key: "6Leb2awpAAAAAJTSH5fiZNtuQ-GdZ-WT2qxNn7Wt",
        url: 'https://www.google.com/recaptcha/api/siteverify'
    },
    server_port: 2053
};