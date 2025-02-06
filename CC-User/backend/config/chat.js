module.exports = {
    max_messages: 40,
    cooldown_massage: 1,
    channels: ['en', 'ro', 'fr', 'ru', 'de'],
    support: {
        active: false,
        message: 'If you find bugs contact us as soon as possible to solve them! With all due respect, the VGOWitch team.',
        cooldown: 24 * 60 * 60
    },
    greeting: {
        active: true,
        message: 'Please contact us if you need help. We don\'t resolve issues in the chat. Type /help for chat commands. With all due respect, the VGOWitch team.',
    },
    message_double_xp: 'Weekly Double XP! Get double XP betting on our games until Sunday at 23:59PM GTM.',
    commandsList: {
        'ignore': 'userid',
	    'unignore': 'userid',
	    'ignorelist': 'none',
	    'mute': 'userid',
	    'unmute': 'userid',
	    'deletemessage': 'id',
	    'cleanchat': 'none',
	    'chatmode': 'none',
	    'tiprain': 'none',
	    'lastrain': 'none',
	    'rollrain': 'none',
	    'online': 'none',
    },
    commandsRank : {
        0: ['ignore', 'unignore', 'ignorelist', 'tiprain', 'lastrain'],
	    1: ['ignore', 'unignore', 'ignorelist', 'mute', 'unmute', 'deletemessage', 'cleanchat', 'chatmode', 'tiprain', 'lastrain', 'rollrain', 'online'],
	    2: ['ignore', 'unignore', 'ignorelist', 'mute', 'deletemessage', 'cleanchat', 'chatmode', 'tiprain', 'lastrain', 'rollrain', 'online'],
	    3: ['ignore', 'unignore', 'ignorelist', 'tiprain', 'lastrain'],
	    4: ['ignore', 'unignore', 'ignorelist', 'tiprain', 'lastrain'],
	    5: ['ignore', 'unignore', 'ignorelist', 'tiprain', 'lastrain'],
	    6: ['ignore', 'unignore', 'ignorelist', 'tiprain', 'lastrain'],
	    7: ['ignore', 'unignore', 'ignorelist', 'tiprain', 'lastrain'],
	    8: ['ignore', 'unignore', 'ignorelist', 'mute', 'unmute', 'deletemessage', 'cleanchat', 'chatmode', 'tiprain', 'lastrain', 'rollrain', 'online'],
	    100: ['ignore', 'unignore', 'ignorelist', 'mute', 'unmute', 'deletemessage', 'cleanchat', 'chatmode', 'tiprain', 'lastrain', 'rollrain', 'online']
    }
};