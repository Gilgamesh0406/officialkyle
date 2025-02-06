'use strict';

var USER = null;
var SOCKET = null;

var RECAPTCHA = null;

var BALANCE = 0;

var offers_currencyValues = {};

var games_intervalAmounts = {};

//AUDIO
var audio_Unboxing_rolling = new Audio(
  ROOT + 'template/audio/unboxing_rolling.wav'
);
var audio_casebattle_rolling = new Audio(
  ROOT + 'template/audio/casebattle_rolling.wav'
);
var audio_plinko_end = new Audio(ROOT + 'template/audio/plinko_end.wav');

audio_Unboxing_rolling.volume = 0.75;
audio_casebattle_rolling.volume = 0.75;
audio_plinko_end.volume = 0.75;

//PROFILE SETTINGS

var profile_settings = {
  sounds: {
    type: 'cookie',
    value: '1',
  },
  channel: {
    type: 'cookie',
    value: 'en',
  },
  chat: {
    type: 'cookie',
    value: '0',
  },
  cart: {
    type: 'cookie',
    value: '0',
  },
  terms: {
    type: 'cookie',
    value: '0',
  },
  anonymous: {
    type: 'save',
    value: '0',
  },
  private: {
    type: 'save',
    value: '0',
  },
  game: {
    type: 'cookie',
    value: 'coinflip',
  },
};

function play_sound(sound) {
  sound.load();
  var play_promise = sound.play();

  if (play_promise !== undefined) {
    play_promise
      .then(function () {})
      .catch(function (err) {
        sound.pause();
      });
  }
}

function profile_settingsChange(setting, value) {
  if (profile_settings[setting] === undefined) return;

  profile_settings[setting].value = value;

  profile_settingsSave();
  profile_settingsAssign(setting, value);
}

function profile_settingsLoad() {
  var settings = JSON.parse(getCookie('settings'));

  if (!settings) return profile_settingsSave();

  var props1 = Object.keys(settings);
  props1.forEach(function (item) {
    if (profile_settings[item] !== undefined) {
      profile_settings[item].value = settings[item];
    }
  });

  var new_settings = false;

  var props2 = Object.keys(profile_settings);
  props2.forEach(function (item) {
    profile_settingsAssign(item, profile_settings[item].value);

    if (settings[item] === undefined && profile_settings[item].type == 'cookie')
      new_settings = true;
  });

  if (new_settings) return profile_settingsSave();
}

function profile_settingsAssign(setting, value) {
  if (
    setting == 'sounds' ||
    setting == 'anonymous' ||
    setting == 'terms' ||
    setting == 'private'
  )
    $('.change-setting[data-setting="' + setting + '"]').prop(
      'checked',
      value == '1'
    );
  if (setting == 'game') {
    $('.change-setting[data-setting="' + setting + '"]').val(value);

    var $field = $('.change-setting[data-setting="' + setting + '"]').closest(
      '.dropdown_field'
    );
    changeDropdownFieldElement($field);

    $('#favorite_game .main-game').addClass('hidden');
    $('#favorite_game .main-game[data-game="' + value + '"]').removeClass(
      'hidden'
    );
  }

  switch (setting) {
    case 'sounds':
      $('#profile_setting_sounds').prop('checked', value == '1');

      audio_Unboxing_rolling.volume = value == '1' ? 0.75 : 0;
      audio_casebattle_rolling.volume = value == '1' ? 0.75 : 0;
      audio_plinko_end.volume = value == '1' ? 0.75 : 0;

      break;

    case 'channel':
      $('.flag').removeClass('active');
      $('.flag[data-channel=' + value + ']').addClass('active');
      $('#chat_message').attr('placeholder', 'Chat...');

      break;

    case 'chat':
      resize_pullout('chat', value == '1');

      break;

    case 'cart':
      resize_pullout('cart', value == '1');

      break;

    case 'terms':
      $('#profile_setting_terms').prop('checked', value == '0');
      updateSocialLogins();
      break;

    case 'anonymous':
      break;

    case 'private':
      break;

    case 'game':
      break;
  }
}
function profile_settingsSave() {
  var settings = {};

  var props = Object.keys(profile_settings);

  props.forEach(function (item) {
    if (profile_settings[item].type == 'cookie') {
      settings[item] = profile_settings[item].value;
    }
  });

  setCookie('settings', JSON.stringify(settings));

  profile_settingsLoad();
}

function profile_settingsGet(setting) {
  if (profile_settings[setting] === undefined) return '';

  return profile_settings[setting].value;
}

/* SOCKET */

$(document).ready(function () {
  profile_settingsLoad();

  connect_socket();

  if (LOGGED && !INITIALIZED) $('#modal_auth_initializing').modal('show');

  //EXCLUSION
  $('.self_exclision').on('click', function () {
    var exclusion = $(this).data('exclusion');

    confirm_action(function (confirmed) {
      if (!confirmed) return;

      requestRecaptcha(function (render) {
        send_request_socket({
          type: 'account',
          command: 'exclusion',
          exclusion: exclusion,
          recaptcha: render,
        });
      });
    });
  });

  //REMOVE SESSION
  $('.remove_session').on('click', function () {
    var session = $(this).data('session');

    confirm_action(function (confirmed) {
      if (!confirmed) return;

      send_request_socket({
        type: 'account',
        command: 'remove_session',
        session: session,
      });
    });
  });

  //PULLOUT
  $('.pullout_view').on('click', function () {
    var pullout = $(this).data('pullout');

    var hide = $('.pullout[data-pullout="' + pullout + '"]').hasClass('active');

    if (pullout == 'menu') resize_pullout(pullout, hide);
    else profile_settingsChange(pullout, hide ? '1' : '0');
  });

  var last_width = $(window).width();
  $(window).resize(function () {
    if (last_width != $(window).width()) {
      last_width = $(window).width();

      resize_pullout('manu', true);
      resize_pullout('chat', profile_settings['chat'].value == '1');

      resize_pullout('cart', profile_settings['cart'].value == '1');
    }
  });

  //PROFILE SETTINGS
  $('.change-setting').on('change', function () {
    var setting = $(this).data('setting');

    if (profile_settings[setting].type == 'cookie') {
      if (setting == 'game')
        return profile_settingsChange(setting, $(this).val());

      profile_settingsChange(
        setting,
        profile_settings[setting].value == '1' ? '0' : '1'
      );
    } else {
      profile_settings[setting].value =
        profile_settings[setting].value == '1' ? '0' : '1';

      send_request_socket({
        type: 'account',
        command: 'profile_settings',
        data: {
          setting: setting,
          value: profile_settings[setting].value,
        },
      });

      profile_settingsAssign(setting, profile_settings[setting].value);
    }
  });

  //SWITCH PANELS
  $(document).on('click', '.switch_panel', function () {
    var id = $(this).data('id');
    var panel = $(this).data('panel');

    $('.switch_panel[data-id="' + id + '"]').removeClass('active');
    $(this).addClass('active');

    $('.switch_content[data-id="' + id + '"]').addClass('hidden');
    $(
      '.switch_content[data-id="' + id + '"][data-panel="' + panel + '"]'
    ).removeClass('hidden');
  });

  //SAVE TRADELINK
  $(document).on('click', '#save_steam_tradelink', function () {
    var tradelink = $('#steam_tradelink').val();

    requestRecaptcha(function (render) {
      send_request_socket({
        type: 'account',
        command: 'save_tradelink',
        tradelink: tradelink,
        recaptcha: render,
      });
    });
  });

  //SAVE APIKEY
  $(document).on('click', '#save_steam_apikey', function () {
    var apikey = $('#steam_apikey').val();

    requestRecaptcha(function (render) {
      send_request_socket({
        type: 'account',
        command: 'save_apikey',
        apikey: apikey,
        recaptcha: render,
      });
    });
  });

  //AFFILIATES
  $(document).on(
    'click',
    '#collect_affiliates_referral_available',
    function () {
      requestRecaptcha(function (render) {
        send_request_socket({
          type: 'affiliates',
          command: 'collect',
          recaptcha: render,
        });
      });
    }
  );

  //REWARDS
  $(document).on('click', '#collect_reward_bind', function () {
    var bind = $(this).data('bind');

    requestRecaptcha(function (render) {
      send_request_socket({
        type: 'rewards',
        command: 'bind',
        data: {
          bind: bind,
        },
        recaptcha: render,
      });
    });
  });

  $(document).on('click', '#collect_reward_referral_redeem', function () {
    var code = $('#referral_redeem_code').val();

    requestRecaptcha(function (render) {
      send_request_socket({
        type: 'rewards',
        command: 'referral_redeem',
        data: {
          code: code,
        },
        recaptcha: render,
      });
    });
  });

  $(document).on('click', '#collect_reward_referral_create', function () {
    var code = $('#referral_create_code').val();

    requestRecaptcha(function (render) {
      send_request_socket({
        type: 'rewards',
        command: 'referral_create',
        data: {
          code: code,
        },
        recaptcha: render,
      });
    });
  });

  $(document).on('click', '#collect_reward_bonus_redeem', function () {
    var code = $('#bonus_redeem_code').val();

    requestRecaptcha(function (render) {
      send_request_socket({
        type: 'rewards',
        command: 'bonus_redeem',
        data: {
          code: code,
        },
        recaptcha: render,
      });
    });
  });

  $(document).on('click', '#collect_reward_bonus_create', function () {
    var code = $('#bonus_create_code').val();
    var amount = $('#bonus_create_amount').val();
    var uses = $('#bonus_create_uses').val();

    requestRecaptcha(function (render) {
      send_request_socket({
        type: 'rewards',
        command: 'bonus_create',
        data: {
          code: code,
          amount: amount,
          uses: uses,
        },
        recaptcha: render,
      });
    });
  });

  $(document).on('click', '#collect_reward_daily', function () {
    requestRecaptcha(function (render) {
      send_request_socket({
        type: 'rewards',
        command: 'daily_redeem',
        data: {},
        recaptcha: render,
      });
    });
  });

  $(document).on('hide', '#modal_recaptcha', function () {
    grecaptcha.reset(RECAPTCHA);
    $('#modal_recaptcha .modal-body').html(
      '<div class="flex justify-center" id="g-recaptcha"></div>'
    );
  });

  //DROPDOWN BUTTON
  $('button').on('click', function () {
    $(this).animate(
      {
        top: '5',
      },
      {
        duration: 100,
        easing: 'linear',
        complete: function () {
          $(this).animate(
            {
              top: '0',
            },
            {
              duration: 100,
              easing: 'linear',
            }
          );
        },
      }
    );
  });
});

function site_refresh() {
  $('#page_loader').load(' #page_content', function () {
    if (PATHS[0] == 'profile') {
      var props = Object.keys(profile_settings);

      props.forEach(function (item) {
        profile_settingsAssign(item, profile_settings[item]['value']);
      });
    }

    initializeInputFields();
    initializeDropdownFields();
    initializeSwitchFields();
    initializeSliderFields();

    $('.status-server *').addClass('hidden');
    if (!disconnected)
      $('.status-server *[data-status="running"]').removeClass('hidden');
    else
      $('.status-server *[data-status="connection_lost"]').removeClass(
        'hidden'
      );
  });
}

//CONNECT
var disconnected = false;
function connect_socket() {
  if (!SOCKET) {
    var session = getCookie('session');

    SOCKET = io(':' + PORT);
    //SOCKET = io(':' + PORT, { withCredentials: true });

    $('.status-server *').addClass('hidden');
    $('.status-server *[data-status="connecting"]').removeClass('hidden');

    SOCKET.on('connect', function (msg) {
      SOCKET.emit('join', {
        session: session,
        paths: PATHS,
        channel: profile_settingsGet('channel'),
      });

      $('.status-server *').addClass('hidden');
      $('.status-server *[data-status="running"]').removeClass('hidden');

      if (disconnected) disconnected = false;
    });
    SOCKET.on('message', function (msg) {
      // console.log('------ message : ', msg);
      onMessageSocket(msg);
    });
    SOCKET.on('connect_error', function (msg) {
      console.log('------------ connection error : ', msg);
      if (disconnected) return;

      toastr['warning']('Reconnecting!', '', {
        timeOut: 0,
        extendedTimeOut: 0,
      });

      $('.status-server *').addClass('hidden');
      $('.status-server *[data-status="connection_lost"]').removeClass(
        'hidden'
      );

      disconnected = true;
    });
  }
}

//SENT REQUEST
function send_request_socket(request) {
  if (SOCKET) {
    SOCKET.emit('request', request);
  }
}

function requestRecaptcha(callback) {
  $('#modal_recaptcha').modal('show');

  var id = 'g-recaptcha-' + Math.floor(Math.random() * 100000);
  $('#g-recaptcha').html('<div id="' + id + '"></div>');

  RECAPTCHA = grecaptcha.render(id, {
    sitekey: RECAPTCHA_SITEKEY,
    callback: function () {
      var render = grecaptcha.getResponse(RECAPTCHA);

      callback(render);

      setTimeout(function () {
        $('#modal_recaptcha').modal('hide');

        grecaptcha.reset(RECAPTCHA);
        $('#modal_recaptcha .modal-body').html(
          '<div class="flex justify-center" id="g-recaptcha"></div>'
        );
      }, 1000);
    },
    theme: 'dark',
  });
}

//GET REQUEST
function onMessageSocket(m) {
  console.log("on message socket log : ", m.type);
  if (m.type == 'first') {
    USER = m.user.userid;
    BALANCE = m.user.balance;

    $('#level_count').text(m.user.level.level);
    $('#level_have').text(m.user.level.have);
    $('#level_next').text(m.user.level.next);
    $('#level_bar').css(
      'width',
      roundedToFixed(
        ((m.user.level.have - m.user.level.start) /
          (m.user.level.next - m.user.level.start)) *
          100,
        2
      ).toFixed(2) + '%'
    );

    var props = Object.keys(m.user.settings);

    props.forEach(function (item) {
      if (profile_settings[item] !== undefined) {
        profile_settings[item].value = m.user.settings[item];

        profile_settingsAssign(item, m.user.settings[item]);
      }
    });

    $('.balance[data-balance="total"] .amount').countToBalance(m.user.balance);

    $('#chat-area').empty();

    chat_commands = m.chat.commands;
    chat_ignoreList = m.chat.listignore;
    console.log('------ m.chat.messages : ', m.chat);
    m.chat.messages.forEach(function (message) {
      chat_message(message, false);
    });

    alerts_add(m.alerts);
    notifies_add(m.notifies);

    games_intervalAmounts = m.amounts;
    Object.keys(games_intervalAmounts).forEach(function (item) {
      var $field = $(
        '.field_element_input[data-amount="' + item + '"]'
      ).closest('.input_field');

      if ($field.length > 0) changeInputFieldLabel($field);
    });

    $('#pending-offers').empty();
    offers_refreshPendingItems();

    m.offers.p2p_pendings.forEach(function (offer) {
      offers_addPending(offer, false);
    });

    m.offers.steam_pendings.forEach(function (offer) {
      offers_addPending(offer, false);
    });

    /* REQUESTS */

    if (!m.maintenance) {
      if (
        (PATHS[0] == 'deposit' || PATHS[0] == 'withdraw') &&
        PATHS.length > 1
      ) {
        if (PATHS[1] == 'steam' || PATHS[1] == 'p2p') {
          $('.pullout-right').removeClass('hidden');

          if (PATHS[1] == 'p2p') {
            if (PATHS[0] == 'deposit') {
              send_request_socket({
                type: 'p2p',
                command: 'load_inventory',
                game: PATHS[2],
              });
            } else if (PATHS[0] == 'withdraw') {
              send_request_socket({
                type: 'p2p',
                command: 'load_shop',
                game: PATHS[2],
              });
            }
          } else if (PATHS[1] == 'steam') {
            if (PATHS[0] == 'deposit') {
              send_request_socket({
                type: 'steam',
                command: 'load_inventory',
                game: PATHS[2],
              });
            } else if (PATHS[0] == 'withdraw') {
              send_request_socket({
                type: 'steam',
                command: 'load_shop',
                game: PATHS[2],
              });
            }
          }

          $('#refresh_inventory').removeClass('hidden');

          $('#refresh_inventory')
            .addClass('disabled')
            .html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
          $('#list_items').html(createLoader());
          $('#cart-items').empty();
        } else $('#refresh_inventory').addClass('hidden');
      }

      if (PATHS[0] == 'unboxing' && PATHS.length > 1) {
        send_request_socket({
          type: 'unboxing',
          command: 'show',
          id: PATHS[1],
        });

        send_request_socket({
          type: 'unboxing',
          command: 'spinner',
          id: PATHS[1],
          amount: 1,
        });
      }

      if (PATHS[0] == 'casebattle') {
        if (PATHS.length > 2) {
          if (PATHS[2] == 'finished') {
            send_request_socket({
              type: 'casebattle',
              command: 'finished',
            });
          } else if (PATHS[2] == 'my') {
            send_request_socket({
              type: 'casebattle',
              command: 'my',
            });
          }
        } else if (PATHS.length > 1) {
          if (PATHS[1] != 'create') {
            send_request_socket({
              type: 'casebattle',
              command: 'show',
              id: PATHS[1],
            });
          }
        }
      }

      if (PATHS[0] == 'admin') {
        if (PATHS.length > 3) {
          if (PATHS[1] == 'casecreator') {
            if (PATHS[2] == 'edit' && PATHS[4] === undefined) {
              $('#casecreator_cases').html(createLoader());

              send_request_socket({
                type: 'admin',
                command: 'casecreator_cases',
                creator: PATHS[3],
              });
            } else {
              if (PATHS[2] == 'edit' && PATHS[4] !== undefined) {
                send_request_socket({
                  type: 'admin',
                  command: 'casecreator_get',
                  creator: PATHS[3],
                  id: PATHS[4],
                });
              }

              $('#casecreator_items').html(createLoader());

              send_request_socket({
                type: 'pagination',
                command: 'casecreator_items',
                page: 1,
                order: 0,
                search: '',
              });
            }
          }
        }
      }

      if (PATHS[0] == 'dashboard') {
        dashboard_initialize();
      }
    }

    /* END REQUESTS */

    if (PAGE == 'coinflip') {
      $('#coinflip_betlist').empty();
      for (var i = 0; i < 6; i++) {
        $('#coinflip_betlist').append(
          '<div class="coinflip-game bg-dark rounded-1 b-l2"></div>'
        );
      }
      console.log('----- coinflip bets : ', m);
      m.coinflip.bets.forEach(function (bet) {
        console.log('------ coinfilp bet detail: ', bet);
        coinflipGame_addCoinFlip(bet.coinflip);
        if (bet.status > 0) coinflipGame_editCoinFlip(bet.coinflip, bet.status);
      });
    } else if (PAGE == 'unboxing') {
      $('#unboxing_list_cases').empty();

      m.unboxing.cases.forEach(function (unboxing) {
        unboxingGame_addCase(unboxing);
      });

      $('#unboxing_history').html(
        '<div class="history_message flex justify-center items-center width-full height-full">No unboxes</div>'
      );

      m.unboxing.history.forEach(function (history) {
        unboxingGame_addHistory(history);
      });
    } else if (PAGE == 'casebattle') {
      $('#casebattle_betlist').html(
        '<div class="in-grid bg-light flex justify-center items-center font-8 p-4 history_message">No active case battles</div>'
      );

      if (PATHS.length > 2) {
        if (PATHS[2] == 'active') {
          m.casebattle.bets.forEach(function (bet) {
            caseBattleGame_addCaseBattle(bet.casebattle);
            if (bet.status > 0)
              caseBattleGame_editCaseBattle(bet.casebattle, bet.status, true);
          });

          caseBattleGame_filterHide();
          caseBattleGame_filterOrder();
        }
      }

      $('#casebattle_stats_active').text(m.casebattle.stats.active);
      $('#casebattle_stats_total').text(m.casebattle.stats.total);
    } else if (PAGE == 'plinko') {
      $('#plinko_history').html(
        '<div class="table-row history_message"><div class="table-column">No data found</div></div>'
      );

      m.plinko.history.forEach(function (item) {
        plinkoGame_addHistory(item);
      });
    } else if (PAGE == 'deposit' || PAGE == 'withdraw') {
      if (PATHS[1] == 'crypto') {
        offers_currencyValues = m.offers.crypto.exchange;

        if (PATHS.length > 1) $('#currency_coin_from').trigger('input');
      }

      if (PAGE == 'withdraw' && PATHS[1] == 'steam') {
        $('#steam_bots').empty();

        m.offers.steam_bots.forEach(function (bot) {
          var DIV =
            '<div class="steam-bot pointer flex items-center justify-center gap-1 rounded-1 bg-light b-d2 p-1 ' +
            (bot.active ? '' : 'disabled') +
            '" data-bot="' +
            bot.index +
            '">Bot #' +
            (bot.index + 1) +
            ' - Status<div class="flex rounded-full p-1 bg-' +
            (bot.active ? 'success' : 'danger') +
            '"></div></div>';

          $('#steam_bots').append(DIV);
        });

        $('.steam-bot:not(.disabled)').first().addClass('active');
      }
    }
  } else if (m.type == 'info') {
    notify('info', m.info);
  } else if (m.type == 'success') {
    notify('success', m.success);
  } else if (m.type == 'error') {
    notify('error', m.error);

    $('#coinflip_create.disabled').removeClass('disabled');
    $('#coinflip_join.disabled').removeClass('disabled');
    $('#unboxing_open.disabled').removeClass('disabled');
    $('#unboxing_demo.disabled').removeClass('disabled');
    //CASE BATTLE
    $('.plinko_bet.disabled').removeClass('disabled');

    $('#dailycases_open.disabled').removeClass('disabled');
  } else if (m.type == 'balance') {
    /*var balance = 0;
		
		var props = Object.keys(m.balances);
		props.forEach(function(item){
			balance += getFormatAmount(m.balances[item]);
			
			$('.balance[data-balance="' + item + '"] .amount').countToBalance(m.balances[item]);
		});*/

    $('.balance[data-balance="total"] .amount').countToBalance(m.balance);

    BALANCE = m.balance;
  } else if (m.type == 'modal') {
    if (m.modal == 'insufficient_balance') {
      $('#modal_insufficient_balance .amount').text(
        getFormatAmountString(m.data.amount)
      );

      $('#modal_insufficient_balance').modal('show');
    }
  } else if (m.type == 'level') {
    $('#level_count').text(m.level.level);
    $('#level_have').text(m.level.have);
    $('#level_next').text(m.level.next);
    $('#level_bar').css(
      'width',
      roundedToFixed(
        ((m.level.have - m.level.start) / (m.level.next - m.level.start)) * 100,
        2
      ).toFixed(2) + '%'
    );
  } else if (m.type == 'online') {
    $('#isonline').text(m.online);
  } else if (m.type == 'list') {
    $('#online_list').html(
      '<div class="in-grid font-8 history_message">No players online</div>'
    );

    var list = m.list
      .sort((a, b) => a.level - b.level)
      .sort((a, b) => a.rank - b.rank)
      .sort((a, b) => b.guest - a.guest);

    list.forEach(function (item) {
      $('#online_list .history_message').remove();

      var DIV =
        '<div class="flex justify-center items-center height-full width-full">';
      if (item.guest)
        DIV +=
          '<div data-copy="text" data-text="' +
          item.userid +
          '">' +
          createAvatarField(item, 'medium', '', '') +
          '</div>';
      else
        DIV +=
          '<a href="' +
          ROOT +
          'profile/' +
          item.userid +
          '" target="_blank">' +
          createAvatarField(item, 'medium', '', '') +
          '</a>';
      DIV += '</div>';

      $('#online_list').prepend(DIV);
    });

    $('#modal_online_list').modal('show');
  } else if (m.type == 'alerts') {
    alerts_add(m.alerts);
  } else if (m.type == 'notifies') {
    notifies_add(m.notifies);
  } else if (m.type == 'reload') {
    location.reload(true);
  } else if (m.type == 'refresh') {
    site_refresh();
  } else if (m.type == 'coinflip' && PAGE == 'coinflip') {
    /* COINFLIP */
    if (m.command == 'add') {
      console.log('------ coinflip add : ', m.coinflip);
      coinflipGame_addCoinFlip(m.coinflip);
    } else if (m.command == 'bet_confirmed') {
      notify('success', 'Your bet has been placed!');

      $('#coinflip_create').removeClass('disabled');
    } else if (m.command == 'edit') {
      coinflipGame_editCoinFlip(m.coinflip, m.status);
    } else if (m.command == 'remove') {
      var $field = $(
        '#coinflip_betlist .coinflip-game .coinflip_betitem[data-id="' +
          m.coinflip.id +
          '"]'
      ).parent();
      $field.removeClass('active').empty();

      var last_game =
        $('#coinflip_betlist .coinflip-game.active').last().index() + 1;
      var count_games = $('#coinflip_betlist .coinflip-game').length;
      for (
        var i = 0;
        i <
          (count_games - last_game > 5) *
            parseInt((count_games - last_game) / 5) *
            5 && $('#coinflip_betlist .coinflip-game').length > 5;
        i++
      ) {
        var $last = $('#coinflip_betlist .coinflip-game').last();

        $last.remove();
      }
    }
  } else if (m.type == 'unboxing' && PAGE == 'unboxing') {
    /* UNBOXING */
    if (m.command == 'show') {
      unboxingGame_showCase(m.items, m.unboxing);
    } else if (m.command == 'spinner') {
      unboxingGame_showSpinner(m.spinner);
    } else if (m.command == 'roll') {
      unboxingGame_openCase(m.spinner);
    } else if (m.command == 'history') {
      unboxingGame_addHistory(m.history);
    } else if (m.command == 'finish') {
      $('#unboxing_demo').removeClass('disabled');
      $('#unboxing_open').removeClass('disabled');
    }
  } else if (m.type == 'casebattle' && PAGE == 'casebattle') {
    /* CASE BATTLE */
    if (m.command == 'list') {
      console.log('------ battles -----------', m.battles);
      m.battles.forEach(function (bet) {
        caseBattleGame_addCaseBattle(bet.casebattle);
        if (bet.status > 0)
          caseBattleGame_editCaseBattle(bet.casebattle, bet.status, true);
      });

      caseBattleGame_filterHide();
      caseBattleGame_filterOrder();
    } else if (m.command == 'cases') {
      $('#casebattle_add_list').html(
        '<div class="in-grid flex justify-center items-center font-8 p-4 history_message">No cases found</div></div>'
      );

      if (m.cases.length > 0) $('#casebattle_add_list').empty();

      m.cases.forEach(function (item) {
        $('#casebattle_add_list').append(
          caseBattleGame_generateCase(
            {
              id: item.id,
              name: item.name,
              image: ROOT + 'template/img/cases/' + item.image + '?v=' + time(),
              price: item.price,
            },
            { count: 0 }
          )
        );
      });

      tinysort('#casebattle_add_list .casebattle_item', {
        data: 'price',
        order: 'asc',
      });

      $('#casebattle_create_list .casebattle_item').each(function (i, e) {
        var item = JSON.parse($(this).attr('data-item').replaceAll("'", '"'));
        var count = parseInt($(this).attr('data-count'));

        $(
          '#casebattle_add_list .casebattle_item[data-id="' + item.id + '"]'
        ).addClass('active');
        $(
          '#casebattle_add_list .casebattle_item[data-id="' + item.id + '"]'
        ).attr('data-count', count);
        $(
          '#casebattle_add_list .casebattle_item[data-id="' +
            item.id +
            '"] .casebattle_add_count'
        ).text(count);
      });

      caseBattleGame_updateAdd();
    } else if (m.command == 'bet_confirmed') {
      notify('success', 'Your bet has been placed!');
    } else if (m.command == 'redirect') {
      if (m.action == 'join')
        window.location.href = ROOT + 'casebattle/' + m.id;
      else if (m.action == 'leave') {
        if (PATHS.length > 1) {
          if (PATHS[1] == m.id) window.location.href = ROOT + 'casebattle';
        }
      }
    } else if (m.command == 'stats') {
      $('#casebattle_stats_active').text(m.stats.active);
      $('#casebattle_stats_total').text(m.stats.total);
    } else if (m.command == 'emoji') {
      if (PATHS.length > 1) {
        if (PATHS[1] == m.casebattle.id) {
          if (caseBattleGame_emojiTimeouts[m.casebattle.id + '_' + m.position])
            clearTimeout(
              caseBattleGame_emojiTimeouts[m.casebattle.id + '_' + m.position]
            );

          var emoji = [
            'heart_eyes.png',
            'innocent.png',
            'rage.png',
            'sob.png',
            'joy.png',
          ][m.emoji];

          $(
            '.casebattle_rounditem[data-position="' +
              m.position +
              '"] .casebattle-emojis'
          )
            .css('opacity', 1)
            .addClass('active');
          $(
            '.casebattle_rounditem[data-position="' +
              m.position +
              '"] .casebattle-emojis-arena'
          )
            .addClass('active')
            .html(
              '<div class="casebattle-emoji rounded-full"><img class="height-full" src="https://crazycargo.gg/template/img/emojis/' +
                emoji +
                '"></div></div>'
            );

          caseBattleGame_emojiTimeouts[m.casebattle.id + '_' + m.position] =
            setTimeout(function () {
              $(
                '.casebattle_rounditem[data-position="' +
                  m.position +
                  '"] .casebattle-emojis'
              )
                .css('opacity', 0)
                .removeClass('active');
              $(
                '.casebattle_rounditem[data-position="' +
                  m.position +
                  '"] .casebattle-emojis-arena'
              )
                .removeClass('active')
                .empty();

              clearInterval(
                caseBattleGame_emojiTimeouts[m.casebattle.id + '_' + m.position]
              );
            }, 2000);
        }
      }
    } else if (m.command == 'show') {
      if (PATHS.length > 1) {
        if (PATHS[1] == m.casebattle.id) {
          $('#casebattle_roundslist').empty();

          m.casebattle.cases.forEach(function (item, i) {
            var ITEM =
              '<div class="casebattle-icon medium bg-light rounded-0 p-1 bl-1 flex justify-center items-center" data-round="' +
              i +
              '" title="' +
              item.name +
              '"><img src="' +
              ROOT +
              'template/img/cases/' +
              item.image +
              '"></div>';

            $('#casebattle_roundslist').append(ITEM);
          });

          var total_players = [2, 3, 4, 4][m.casebattle.mode];

          $('#casebattle_roundlist').empty();

          if (m.casebattle.mode == 3) {
            for (var i = 0; i < 2; i++) {
              var DIV =
                '<div class="flex row responsive bg-dark b-b2 p-2 rounded-1 width-full relative">';
              DIV += caseBattleGame_generateShow(
                m.casebattle,
                m.status,
                i * 2,
                true
              );

              DIV += caseBattleGame_generateShow(
                m.casebattle,
                m.status,
                i * 2 + 1,
                true
              );
              DIV += '</div>';

              $('#casebattle_roundlist').append(DIV);
            }
          } else {
            for (var i = 0; i < total_players; i++) {
              var DIV =
                '<div class="flex row responsive bg-dark b-b2 p-2 rounded-1 width-full relative">';
              DIV += caseBattleGame_generateShow(
                m.casebattle,
                m.status,
                i,
                true
              );
              DIV += '</div>';

              $('#casebattle_roundlist').append(DIV);
            }
          }

          $('#casebattle_itemslist').empty();

          for (var i = 0; i < total_players; i++) {
            $('#casebattle_itemslist').append(
              caseBattleGame_generateItems(m.casebattle, i)
            );
          }

          $('#casebattle_roundslist .casebattle-icon').removeClass('active');
          if (m.status == 4) {
            $(
              '#casebattle_roundslist .casebattle-icon[data-round="' +
                m.casebattle.data.round +
                '"]'
            ).addClass('active');

            setTimeout(function () {
              $('#casebattle_roundslist').css(
                'transform',
                'translateX(-' + m.casebattle.data.round * 80 + 'px)'
              );
            }, 200);
          }

          $('.casebattle_game_rounds').text(m.casebattle.cases.length);
          $('.casebattle_game_round').text(m.casebattle.data.round + 1);

          $('#casebattle_stats_amount').text(
            getFormatAmountString(
              m.casebattle.data.free
                ? total_players * m.casebattle.amount
                : m.casebattle.amount
            )
          );
          $('#casebattle_fair').attr(
            'data-fair',
            JSON.stringify({
              game: m.casebattle.data.game,
              draw: m.casebattle.data.draw,
            })
          );

          $('#casebattle_create_same').attr(
            'data-battle',
            JSON.stringify({
              cases: m.casebattle.cases.map((a) => a.id),
              mode: m.casebattle.mode,
              privacy: m.casebattle.data.privacy,
              free: m.casebattle.data.free,
              crazy: m.casebattle.data.crazy,
            })
          );

          $('#casebattle_link')
            .removeClass('hidden')
            .attr('data-text', SURL + ROOT + 'casebattle/' + m.casebattle.id);
          $('#casebattle_link .link').text(
            SURL + ROOT + 'casebattle/' + m.casebattle.id
          );
        }
      }
    } else if (m.command == 'update') {
      if (PATHS.length > 1) {
        if (PATHS[1] == m.casebattle.id) {
          if (m.stage == 'position') {
            $(
              '#casebattle_roundlist .casebattle_rounditem[data-position="' +
                m.position +
                '"] .casebattle-case'
            ).replaceWith(
              caseBattleGame_generateShowCase(
                m.casebattle,
                m.status,
                m.position,
                false
              )
            );
            $(
              '#casebattle_roundlist .casebattle_rounditem[data-position="' +
                m.position +
                '"] .casebattle-user'
            ).replaceWith(
              caseBattleGame_generateShowUser(
                m.casebattle,
                m.status,
                m.position
              )
            );
          } else if (m.stage == 'refresh') {
            var total_players = [2, 3, 4, 4][m.casebattle.mode];

            for (var i = 0; i < total_players; i++) {
              $(
                '#casebattle_roundlist .casebattle_rounditem[data-position="' +
                  i +
                  '"] .casebattle-case'
              ).replaceWith(
                caseBattleGame_generateShowCase(
                  m.casebattle,
                  m.status,
                  i,
                  false
                )
              );
              $(
                '#casebattle_roundlist .casebattle_rounditem[data-position="' +
                  i +
                  '"] .casebattle-user'
              ).replaceWith(
                caseBattleGame_generateShowUser(m.casebattle, m.status, i)
              );
            }

            $('#casebattle_fair').attr(
              'data-fair',
              JSON.stringify({
                game: m.casebattle.data.game,
                draw: m.casebattle.data.draw,
              })
            );
          } else if (m.stage == 'roll') {
            caseBattleGame_openCase();
          } else if (m.stage == 'items') {
            m.players.forEach(function (player) {
              var ITEM = caseBattleGame_generateItem(player.item);
              $(
                '#casebattle_itemslist .casebattle-drops[data-position="' +
                  player.position +
                  '"]'
              ).prepend(ITEM);
              $(
                '#casebattle_itemslist .casebattle-drops[data-position="' +
                  player.position +
                  '"] .listing-item'
              )
                .last()
                .remove();

              $(
                '.casebattle_rounditem[data-position="' +
                  player.position +
                  '"] .casebattle-total'
              ).text(getFormatAmountString(player.total));

              $(
                '.casebattle_rounditem[data-position="' +
                  player.position +
                  '"] .casebattle-total'
              )
                .parent()
                .removeClass('text-success');
              if (m.positions.includes(player.position))
                $(
                  '.casebattle_rounditem[data-position="' +
                    player.position +
                    '"] .casebattle-total'
                )
                  .parent()
                  .addClass('text-success');
            });
          } else if (m.stage == 'round') {
            $('#casebattle_roundslist .casebattle-icon').removeClass('active');
            $(
              '#casebattle_roundslist .casebattle-icon[data-round="' +
                m.round +
                '"]'
            ).addClass('active');

            $('.casebattle_game_round').text(m.round + 1);

            setTimeout(function () {
              $('#casebattle_roundslist').css(
                'transform',
                'translateX(-' + m.round * 80 + 'px)'
              );
            }, 200);
          } else if (m.stage == 'finish') {
            $('#casebattle_roundslist .casebattle-icon').removeClass('active');

            $('#casebattle_roundslist').css('transform', 'translateX(0px)');
          }
        }
      }
    }

    if (PATHS.length > 2) {
      if (PATHS[2] == 'active') {
        if (m.command == 'add') {
          caseBattleGame_addCaseBattle(m.casebattle);

          caseBattleGame_filterHide();
          caseBattleGame_filterOrder();
        } else if (m.command == 'edit') {
          caseBattleGame_editCaseBattle(m.casebattle, m.status, false);
        } else if (m.command == 'remove') {
          $(
            '#casebattle_betlist .casebattle_betitem[data-id="' +
              m.casebattle.id +
              '"]'
          ).remove();

          if ($('#casebattle_betlist .casebattle_betitem').length <= 0)
            $('#casebattle_betlist').html(
              '<div class="in-grid bg-light flex justify-center items-center font-8 p-4 history_message">No active case battles</div>'
            );
        }
      }
    }
  } else if (m.type == 'plinko' && PAGE == 'plinko') {
    /* PLINKO */
    if (m.command == 'bet') {
      notify('success', 'Your bet has been placed!');

      $('.plinko_bet.disabled').removeClass('disabled');

      plinkoGame_play(m.id, m.plinko, m.game);
    } else if (m.command == 'history') {
      plinkoGame_addHistory(m.history);
    }
  } else if (m.type == 'rewards' && PAGE == 'rewards') {
    /* REWARDS */
    if (m.command == 'timer') {
      var time_daily = m.time;

      clearInterval(interval_daily);

      var interval_daily = setInterval(function () {
        if (time_daily <= 0) {
          $('#collect_reward_daily').text('Collect').removeClass('disabled');
          clearInterval(interval_daily);

          return;
        }

        $('#collect_reward_daily')
          .text(
            getFormatSeconds(time_daily).hours +
              ':' +
              getFormatSeconds(time_daily).minutes +
              ':' +
              getFormatSeconds(time_daily).seconds
          )
          .addClass('disabled');
        time_daily--;
      }, 1000);
    }
  } else if (m.type == 'chat') {
    console.log("chat message start : ", m.type);
    /* CHAT */
    if (m.command == 'message') {
      console.log("chat message details : ", m.message, m.added);
      chat_message(m.message, m.added);
    } else if (m.command == 'delete') {
      $('.chat-message[data-message="' + m.id + '"]').remove();
    } else if (m.command == 'ignorelist') {
      chat_ignoreList = m.list;
    } else if (m.command == 'clean') {
      $('#chat-area').empty();
    } else if (m.command == 'channel') {
      $('#chat-area').empty();
      chat_channelsMessages[m.channel] = 0;
      $('.flag[data-channel=' + m.channel + '] .new-messages').addClass(
        'hidden'
      );

      profile_settingsChange('channel', m.channel);

      $('.chat-input-scroll').addClass('hidden');
    }
  } else if (m.type == 'offers') {
    /* OFFETS */
    if (PAGE == 'deposit' || PAGE == 'withdraw') {
      if (m.command == 'add_items') {
        var available = true;
        for (var i = 0; i < m.offer.paths.length; i++) {
          if (PATHS[i] != m.offer.paths[i]) {
            available = false;
            break;
          }
        }

        if (available) {
          if (!m.offer.more) {
            $('#refresh_inventory').removeClass('disabled').text('Refresh');
            $('#list_items').empty();
            $('#cart-items').empty();

            offers_refreshCartItems();
          }

          $('#list_items .history_message').remove();

          m.offer.items.forEach(function (item) {
            if (
              $('#list_items .listing-item[data-id="' + item.id + '"]').length >
              0
            )
              $(
                '#list_items .listing-item[data-id="' + item.id + '"]'
              ).remove();

            if (PAGE == 'deposit') offers_addItemInventory(item);
            if (PAGE == 'withdraw') {
              if (PATHS[1] == 'steam') offers_addItemInventory(item);
              if (PATHS[1] == 'p2p') offers_addBundleInventory(item);
            }
          });

          if (PAGE == 'withdraw' && PATHS[1] == 'steam') {
            $('#list_items>.listing-item')
              .addClass('hidden')
              .filter(function (i, e) {
                if ($(this).data('bot') == $('.steam-bot.active').data('bot'))
                  return true;
              })
              .removeClass('hidden');
          }

          if (m.offer.items.length > 0) {
            tinysort('#list_items>.listing-item', {
              data: 'price',
              order: 'desc',
            });

            tinysort('#list_items .listing-item', {
              data: 'accepted',
              order: 'desc',
            });
          }
        }
      } else if (m.command == 'remove_items') {
        var available = true;
        if (m.offer.paths.length != PATHS.length) available = false;
        for (var i = 0; i < m.offer.paths.length && !available; i++)
          if (PATHS[i] != m.offer.paths[i]) available = false;

        if (available) {
          if (m.offer.all) {
            $('#list_items').empty();
            $('#cart-items').empty();
          } else {
            m.offer.items.forEach(function (item) {
              $(
                '#cart-items .item-selected-content[data-id="' + item.id + '"]'
              ).remove();
              $(
                '#list_items .listing-item[data-id="' + item.id + '"]'
              ).remove();
            });
          }

          if ($('#list_items .listing-item').length <= 0) {
            $('#refresh_inventory').removeClass('disabled').text('Refresh');

            if (PAGE == 'deposit')
              $('#list_items').html(
                '<div class="in-grid font-8 history_message">Your Inventory is currently empty.</div>'
              );
            if (PAGE == 'withdraw')
              $('#list_items').html(
                '<div class="in-grid font-8 history_message">The Marketplace is currently empty.</div>'
              );
          }

          offers_refreshCartItems();
        }
      } else if (m.command == 'error') {
        $('#refresh_inventory').removeClass('disabled').text('Refresh');
        $('#list_items').html(
          '<div class="in-grid font-8 history_message">' + m.error + '</div>'
        );
      } else if (m.command == 'wait') {
        var uniqueId = time() + '_' + Math.floor(Math.random() * 100);
        var TIMER = '<script>';
        TIMER += 'var time_' + uniqueId + ' = ' + m.time + ';';
        TIMER += 'var timer_' + uniqueId + ' = setInterval(function(){';
        TIMER += 'if(time_' + uniqueId + ' <= 1){';
        TIMER += 'clearInterval(timer_' + uniqueId + ');';
        TIMER +=
          '$("#refresh_inventory").removeClass("disabled").text("Refresh");';
        TIMER += '} else {';
        TIMER += 'time_' + uniqueId + '--;';
        TIMER += '$("#time_' + uniqueId + '").text(time_' + uniqueId + ');';
        TIMER += '}';
        TIMER += '}, 1000);';
        TIMER += '</script>';
        TIMER += '<span id="time_' + uniqueId + '">' + m.time + '</span>';

        $('#refresh_inventory')
          .html('Refresh in ' + TIMER)
          .addClass('disabled');
      } else if (m.command == 'refresh') {
        $('.qrcode-crypto').empty();

        var qrcode = new QRCode($('.qrcode-crypto')[0], {
          text: m.address,
          width: 192,
          height: 192,
        });

        var $input_address = $(
          '.currency-panel #' + m.currency.toLowerCase() + '_address'
        );
        $input_address.val(m.address);

        $('.currency-panel #panel_currency_top').removeClass('hidden');
        $('.currency-panel #panel_currency_bottom').addClass('hidden');

        changeInputFieldLabel($input_address.closest('.input_field'));
      }
    }

    if (m.command == 'add_pending') {
      offers_addPending(m.offer, true);
    } else if (m.command == 'edit_pending') {
      offers_editPending(m.offer);
    } else if (m.command == 'remove_pending') {
      $(
        '#pending-offers .bundle_offer[data-id="' +
          m.offer.id +
          '"][data-method="' +
          m.offer.method +
          '"]'
      ).remove();
      $('#modal_offers_pending').modal('hide');

      offers_refreshPendingItems();
    }
  } else if (m.type == 'rain') {
    /* RAIN */
    if (m.command == 'started') {
      $('.rain_panel').removeClass('hidden');

      $('.rain_panel .rainJoin').removeClass('hidden');
      $('.rain_panel .rainJoined').addClass('hidden');
      $('.rain_panel .rainWait').addClass('hidden');
    } else if (m.command == 'joined') {
      $('.rain_panel').removeClass('hidden');

      $('.rain_panel .rainJoin').addClass('hidden');
      $('.rain_panel .rainWait').addClass('hidden');
      $('.rain_panel .rainJoined').removeClass('hidden');
    } else if (m.command == 'ended') {
      $('.rain_panel').addClass('hidden');

      $('.rain_panel .rainJoin').addClass('hidden');
      $('.rain_panel .rainJoined').addClass('hidden');
      $('.rain_panel .rainWait').addClass('hidden');
    } else if (m.command == 'waiting') {
      $('.rain_panel').removeClass('hidden');

      $('.rain_panel .rainWait').removeClass('hidden');
      $('.rain_panel .rainJoin').addClass('hidden');
      $('.rain_panel .rainJoined').addClass('hidden');
    }
  } else if (m.type == 'dashboard') {
    /* DASHBOARD */
    if (m.command == 'graph') {
      dashboard_upload(m.data, m.graph.split('.')[0], false);
    } else if (m.command == 'stats') {
      $('.dashboard-stats[data-stats="' + m.stats + '"] .stats').text(m.data);
    }
  } else if (m.type == 'pagination') {
    /* PAGINATIONS */
    if (m.command == 'admin_users') {
      pagination_addUsers(m.list);

      pagination_create('#pagination_admin_users', m.pages, m.page);
    } else if (m.command == 'admin_crypto_confirmations') {
      pagination_addCryptoConfirmations(m.list);

      pagination_create(
        '#pagination_admin_crypto_confirmations',
        m.pages,
        m.page
      );
    } else if (m.command == 'admin_steam_confirmations') {
      pagination_addSteamConfirmations(m.list);

      pagination_create(
        '#pagination_admin_steam_confirmations',
        m.pages,
        m.page
      );
    } else if (m.command == 'admin_join_referrals') {
      pagination_addJoinReferrals(m.list);

      pagination_create('#pagination_admin_join_referrals', m.pages, m.page);
    } else if (m.command == 'admin_deposit_bonuses') {
      pagination_addDepositBonuses(m.list);

      pagination_create('#pagination_admin_deposit_bonuses', m.pages, m.page);
    } else if (m.command == 'user_transactions') {
      pagination_addUserTransactions(m.list);

      pagination_create('#pagination_user_transactions', m.pages, m.page);
    } else if (m.command == 'user_transfers') {
      pagination_addUserTransfers(m.list);

      pagination_create('#pagination_user_transfers', m.pages, m.page);
    } else if (m.command == 'crypto_transactions') {
      pagination_addCryptoTransactions(m.list);

      pagination_create('#pagination_crypto_transactions', m.pages, m.page);
    } else if (m.command == 'steam_transactions') {
      pagination_addSteamTransactions(m.list);

      pagination_create('#pagination_steam_transactions', m.pages, m.page);
    } else if (m.command == 'p2p_transactions') {
      pagination_addP2PTransactions(m.list);

      pagination_create('#pagination_p2p_transactions', m.pages, m.page);
    } else if (m.command == 'casecreator_items') {
      pagination_addCaseCreatorItems(m.list);

      var DIV =
        '<div class="flex row gap-2 justify-between items-center width-full">';
      DIV +=
        '<div class="pagination-item flex items-center justify-center" data-page="' +
        Math.max(1, m.page - 1) +
        '">«</div>';

      DIV +=
        '<div class="bg-light rounded-1 b-l2 pl-2 pr-2 flex row items-center justify-center height-full">' +
        m.page +
        '/' +
        m.pages +
        '</div>';

      DIV +=
        '<div class="pagination-item flex items-center justify-center" data-page="' +
        Math.min(m.pages, m.page + 1) +
        '">»</div>';
      DIV += '</div>';

      $('#pagination_casecreator_items').html(DIV);
    } else if (m.command == 'inventory_items') {
      pagination_addInventoryItems(m.list);

      if (m.inventory.count > 0) $('#inventory_sell_all').removeClass('hidden');
      else $('#inventory_sell_all').addClass('hidden');

      $('#inventory_value').text(getFormatAmountString(m.inventory.value));

      var DIV =
        '<div class="flex row gap-2 justify-between items-center width-full">';
      DIV +=
        '<div class="pagination-item flex items-center justify-center" data-page="' +
        Math.max(1, m.page - 1) +
        '">«</div>';

      DIV +=
        '<div class="bg-light rounded-1 b-l2 pl-2 pr-2 flex row items-center justify-center height-full">' +
        m.page +
        '/' +
        m.pages +
        '</div>';

      DIV +=
        '<div class="pagination-item flex items-center justify-center" data-page="' +
        Math.min(m.pages, m.page + 1) +
        '">»</div>';
      DIV += '</div>';

      $('#pagination_inventory_items').html(DIV);
    } else if (m.command == 'upgrader_myitems') {
      pagination_addUpgraderMyItems(m.list);

      var DIV =
        '<div class="flex row gap-2 justify-between items-center width-full">';
      DIV +=
        '<div class="pagination-item flex items-center justify-center" data-page="' +
        Math.max(1, m.page - 1) +
        '">«</div>';

      DIV +=
        '<div class="bg-light rounded-1 b-l2 pl-2 pr-2 flex row items-center justify-center height-full">' +
        m.page +
        '/' +
        m.pages +
        '</div>';

      DIV +=
        '<div class="pagination-item flex items-center justify-center" data-page="' +
        Math.min(m.pages, m.page + 1) +
        '">»</div>';
      DIV += '</div>';

      $('#pagination_upgrader_myitems').html(DIV);
    } else if (m.command == 'upgrader_siteitems') {
      pagination_addUpgraderSiteItems(m.list);

      var DIV =
        '<div class="flex row gap-2 justify-between items-center width-full">';
      DIV +=
        '<div class="pagination-item flex items-center justify-center" data-page="' +
        Math.max(1, m.page - 1) +
        '">«</div>';

      DIV +=
        '<div class="bg-light rounded-1 b-l2 pl-2 pr-2 flex row items-center justify-center height-full">' +
        m.page +
        '/' +
        m.pages +
        '</div>';

      DIV +=
        '<div class="pagination-item flex items-center justify-center" data-page="' +
        Math.min(m.pages, m.page + 1) +
        '">»</div>';
      DIV += '</div>';

      $('#pagination_upgrader_siteitems').html(DIV);
    } else if (m.command == 'admin_gamebots') {
      pagination_addGamebots(m.list);

      pagination_create('#pagination_admin_gamebots', m.pages, m.page);
    }
  } else if (m.type == 'dailycases') {
    /* DAILY CASES */
    console.log('message -------: ', m);
    if (m.command == 'cases') {
      $('#dailycases_cases').html(
        '<div class="in-grid flex justify-center items-center font-8 p-4 history_message">No daily cases found</div>'
      );

      m.cases.forEach(function (item) {
        dailycases_addCase(item, m.level);
      });
    } else if (m.command == 'countdown') {
      dailycases_countdownCase(m.dailycase);
    } else if (m.command == 'show') {
      dailycases_showCase(m.items, m.dailycase, m.level, m.spinner);
    } else if (m.command == 'roll') {
      dailycases_openCase(m.items);
    } else if (m.command == 'finish') {
      $('#dailycases_open').removeClass('disabled');
    }
  } else if (
    m.type == 'casecreator' &&
    PAGE == 'admin' &&
    PATHS[1] == 'casecreator'
  ) {
    /* CASE CREATOR */
    if (m.command == 'cases') {
      $('#casecreator_cases').html(
        '<div class="in-grid flex justify-center items-center font-8 p-4 history_message">No cases found</div>'
      );

      m.cases.forEach(function (item) {
        casecreator_addCase(item, m.creator);
      });
    } else if (m.command == 'remove') {
      $('#casecreator_cases .case-item[data-id="' + m.id + '"]').remove();

      if ($('#casecreator_cases .case-item').length <= 0)
        $('#casecreator_cases').html(
          '<div class="in-grid flex justify-center items-center font-8 p-4 history_message">No cases found</div>'
        );
    } else if (m.command == 'case') {
      $('#casecreator_case_name').val(m.data.name).trigger('input');
      changeInputFieldLabel(
        $('#casecreator_case_name').closest('.input_field')
      );

      $('#casecreator_case_image')
        .closest('.file_field')
        .find('.field_file')
        .addClass('active')
        .find('img')
        .attr('src', ROOT + 'template/img/' + PATHS[3] + '/' + m.data.image);

      if (m.creator == 'cases') {
        $('#casecreator_case_offset').val(m.data.offset).trigger('change');
        if (m.data.battle)
          $('#casecreator_case_battle').attr('checked', true).trigger('change');
      } else if (m.creator == 'dailycases') {
        $('#casecreator_case_level').val(m.data.level).trigger('input');
        changeInputFieldLabel(
          $('#casecreator_case_level').closest('.input_field')
        );
      }

      $('#casecreator_case_items').empty();

      m.data.items.forEach(function (item) {
        casecreator_selectItem(item.item, item.chance);
      });

      var file = new File([new Uint8Array(m.data.buffer)], {});

      var dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      document.querySelector('#casecreator_case_image').files =
        dataTransfer.files;
    } else if (m.command == 'redirect') {
      window.location.href =
        ROOT + 'admin/casecreator/edit/' + m.creator + '/' + m.caseid;
    }
  } else if (m.type == 'profile' && PAGE == 'profile') {
    /* PROFILE */
    if (m.command == 'remove_session') {
      $(
        '#my_devices .device_session[data-session="' + m.session + '"]'
      ).remove();

      if ($('#my_devices .device_session').length <= 0)
        $('#my_devices').html(
          '<div class="table-row history_message"><div class="table-column">No data found</div></div>'
        );
    }
  } else if (m.type == 'inventory') {
    /* INVENTORY */
    if (m.command == 'sell_item') {
      $('.inventory_item[data-id="' + m.id + '"]').remove();

      if (m.inventory.count > 0) $('#inventory_sell_all').removeClass('hidden');
      else $('#inventory_sell_all').addClass('hidden');

      $('#inventory_value').text(getFormatAmountString(m.inventory.value));
    } else if (m.command == 'sell_items') {
      m.ids.forEach(function (id) {
        $('.inventory_item[data-id="' + id + '"]').addClass('notaccepted');
      });

      if (m.inventory.count > 0) $('#inventory_sell_all').removeClass('hidden');
      else $('#inventory_sell_all').addClass('hidden');

      $('#inventory_value').text(getFormatAmountString(m.inventory.value));
    }
  } else if (m.type == 'gamebots') {
    /* GAME BOTS */
    if (m.command == 'show') {
      $('#gamebots_list').html(
        '<div class="in-grid flex justify-center items-center font-8 p-4 history_message">No active bots found</div>'
      );

      m.bots.forEach(function (item) {
        gamebots_addBot(item);
      });

      $('#gamebots_list .gamebot-item').first().addClass('active');

      $('#gamebots_confirm')
        .attr('data-game', m.game)
        .attr('data-data', stringEscape(JSON.stringify(m.data)))
        .removeClass('disabled');
    } else if (m.command == 'hide') {
      $('#modal_gamebots_list').modal('hide');
    }
  }
}

/* END SOCKET */

/* DASHBOARD */

$(document).ready(function () {
  $('.dashboard-content').each(function (i, e) {
    var $content = $(this);

    if (!$content.hasClass('hidden')) {
      if ($content.parent().hasClass('switch_content')) {
        if (!$content.parent().hasClass('hidden')) {
          $content.find('.dashboard-chart').each(function (i, e) {
            var $dashboard = $(this);

            $dashboard.find('.dashboard-loader').removeClass('hidden');
            dashboard_upload(
              { labels: [], data: [] },
              $dashboard.attr('data-graph'),
              true
            );
          });
        }
      } else {
        $content.find('.dashboard-chart').each(function (i, e) {
          var $dashboard = $(this);

          $dashboard.find('.dashboard-loader').removeClass('hidden');
          dashboard_upload(
            { labels: [], data: [] },
            $dashboard.attr('data-graph'),
            true
          );
        });
      }
    }
  });

  $(document).on('click', '.dashboard-graph', function () {
    var date = $(this).attr('data-date');
    var graph = $(this).parent().parent().attr('data-graph');
    var id = $(this).parent().parent().attr('data-id');

    dashboard_loadGraph({ date, graph: id ? graph + '.' + id : graph });
  });

  $(document).on('click', '.dashboard-load', function () {
    dashboard_initialize();
  });
});

function dashboard_initialize() {
  $('.dashboard-content').each(function (i, e) {
    var $content = $(this);

    if (!$content.hasClass('hidden')) {
      if ($content.parent().hasClass('switch_content')) {
        if (!$content.parent().hasClass('hidden')) {
          var graphs = [];

          $content.find('.dashboard-chart').each(function (i, e) {
            var $dashboard = $(this);

            $dashboard.find('.dashboard-loader').removeClass('hidden');
            dashboard_upload(
              { labels: [], data: [] },
              $dashboard.attr('data-graph'),
              true
            );

            graphs.push({
              date: $(this)
                .find('.dashboard-select .dashboard-graph.active')
                .attr('data-date'),
              graph: $dashboard.attr('data-id')
                ? $dashboard.attr('data-graph') +
                  '.' +
                  $dashboard.attr('data-id')
                : $dashboard.attr('data-graph'),
            });
          });

          dashboard_loadAllGraphs(graphs);

          var stats = [];
          $content.find('.dashboard-stats').each(function (i, e) {
            stats.push($(this).attr('data-stats'));
          });

          send_request_socket({
            type: 'dashboard',
            command: 'stats',
            stats: stats,
          });
        }
      } else {
        var graphs = [];

        $content.find('.dashboard-chart').each(function (i, e) {
          var $dashboard = $(this);

          $dashboard.find('.dashboard-loader').removeClass('hidden');
          dashboard_upload(
            { labels: [], data: [] },
            $dashboard.attr('data-graph'),
            true
          );

          graphs.push({
            date: $(this)
              .find('.dashboard-select .dashboard-graph.active')
              .attr('data-date'),
            graph: $dashboard.attr('data-id')
              ? $dashboard.attr('data-graph') + '.' + $dashboard.attr('data-id')
              : $dashboard.attr('data-graph'),
          });
        });

        dashboard_loadAllGraphs(graphs);

        var stats = [];
        $content.find('.dashboard-stats').each(function (i, e) {
          stats.push($(this).attr('data-stats'));
        });

        send_request_socket({
          type: 'dashboard',
          command: 'stats',
          stats: stats,
        });
      }
    }
  });
}

function dashboard_loadGraph(graph) {
  $('#dashboard_chart_' + graph.graph)
    .parent()
    .parent()
    .find('.dashboard-loader')
    .removeClass('hidden');

  dashboard_upload({ labels: [], data: [] }, graph.graph.split('.')[0], true);

  send_request_socket({
    type: 'dashboard',
    command: 'graph',
    graph: graph,
  });
}

function dashboard_loadAllGraphs(graphs) {
  graphs.forEach(function (item) {
    $('#dashboard_chart_' + item.graph)
      .parent()
      .parent()
      .find('.dashboard-loader')
      .removeClass('hidden');

    dashboard_upload({ labels: [], data: [] }, item.graph.split('.')[0], true);
  });

  send_request_socket({
    type: 'dashboard',
    command: 'graphs',
    graphs: graphs,
  });
}

function dashboard_upload(data, graph, empty) {
  if (!empty)
    $('#dashboard_chart_' + graph)
      .parent()
      .parent()
      .find('.dashboard-loader')
      .addClass('hidden');

  $('#dashboard_chart_' + graph)
    .parent()
    .parent()
    .find('iframe')
    .remove();
  $('#dashboard_chart_' + graph)
    .parent()
    .html('<canvas id="dashboard_chart_' + graph + '"></canvas>');

  var ctx = document
    .getElementById('dashboard_chart_' + graph)
    .getContext('2d');

  var ctx_chart = new Chart(ctx, dashboard_generateCtx(data));
}

function dashboard_generateCtx(stats) {
  return {
    type: 'line',
    data: {
      labels: stats.labels,
      datasets: [
        {
          data: stats.data,
          borderColor: '#9370db',
          borderWidth: 2,
          fill: false,
          spanGaps: true,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              //beginAtZero: true
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              display: false,
            },
          },
        ],
      },

      elements: {
        line: {
          tension: 0,
        },
      },

      legend: {
        display: false,
      },
    },
  };
}

/* END DASHBOARD */

/* PAGINATION */

$(document).ready(function () {
  $(document).on(
    'click',
    '#pagination_admin_users .pagination-item',
    function () {
      var page = $(this).attr('data-page');
      var order = parseInt($('#admin_users_order').val());
      var search = $('#admin_users_search').val();

      send_request_socket({
        type: 'pagination',
        command: 'admin_users',
        page: page,
        order: order,
        search: search,
      });
    }
  );

  $(document).on('change', '#admin_users_order', function () {
    var order = parseInt($('#admin_users_order').val());
    var search = $('#admin_users_search').val();

    send_request_socket({
      type: 'pagination',
      command: 'admin_users',
      page: 1,
      order: order,
      search: search,
    });
  });

  var timeout_admin_users = null;
  $('#admin_users_search').on('input', function () {
    if (timeout_admin_users) clearTimeout(timeout_admin_users);

    timeout_admin_users = setTimeout(function () {
      var order = parseInt($('#admin_users_order').val());
      var search = $('#admin_users_search').val();

      send_request_socket({
        type: 'pagination',
        command: 'admin_users',
        page: 1,
        order: order,
        search: search,
      });
    }, 1000);
  });

  $(document).on(
    'click',
    '#pagination_admin_crypto_confirmations .pagination-item',
    function () {
      var page = $(this).attr('data-page');

      send_request_socket({
        type: 'pagination',
        command: 'admin_crypto_confirmations',
        page: page,
      });
    }
  );

  $(document).on(
    'click',
    '#pagination_admin_steam_confirmations .pagination-item',
    function () {
      var page = $(this).attr('data-page');

      send_request_socket({
        type: 'pagination',
        command: 'admin_steam_confirmations',
        page: page,
      });
    }
  );

  $(document).on(
    'click',
    '#pagination_user_transactions .pagination-item',
    function () {
      var page = $(this).attr('data-page');

      var userid = USER;
      if (PATHS[1] !== undefined) userid = PATHS[1];

      send_request_socket({
        type: 'pagination',
        command: 'user_transactions',
        page: page,
        userid: userid,
      });
    }
  );

  $(document).on(
    'click',
    '#pagination_user_transfers .pagination-item',
    function () {
      var page = $(this).attr('data-page');

      var userid = USER;
      if (PATHS[1] !== undefined) userid = PATHS[1];

      send_request_socket({
        type: 'pagination',
        command: 'user_transfers',
        page: page,
        userid: userid,
      });
    }
  );

  $(document).on(
    'click',
    '#pagination_crypto_transactions .pagination-item',
    function () {
      var page = $(this).attr('data-page');

      var userid = USER;
      if (PATHS[1] !== undefined) userid = PATHS[1];

      send_request_socket({
        type: 'pagination',
        command: 'crypto_transactions',
        page: page,
        userid: userid,
      });
    }
  );

  $(document).on(
    'click',
    '#pagination_steam_transactions .pagination-item',
    function () {
      var page = $(this).attr('data-page');

      var userid = USER;
      if (PATHS[1] !== undefined) userid = PATHS[1];

      send_request_socket({
        type: 'pagination',
        command: 'steam_transactions',
        page: page,
        userid: userid,
      });
    }
  );

  $(document).on(
    'click',
    '#pagination_p2p_transactions .pagination-item',
    function () {
      var page = $(this).attr('data-page');

      var userid = USER;
      if (PATHS[1] !== undefined) userid = PATHS[1];

      send_request_socket({
        type: 'pagination',
        command: 'p2p_transactions',
        page: page,
        userid: userid,
      });
    }
  );

  $(document).on(
    'click',
    '#pagination_admin_join_referrals .pagination-item',
    function () {
      var page = $(this).attr('data-page');
      var search = $('#admin_join_referrals_search').val();

      send_request_socket({
        type: 'pagination',
        command: 'admin_join_referrals',
        page: page,
        search: search,
      });
    }
  );

  var timeout_admin_join_referrals = null;
  $('#admin_join_referrals_search').on('input', function () {
    if (timeout_admin_join_referrals)
      clearTimeout(timeout_admin_join_referrals);

    timeout_admin_join_referrals = setTimeout(function () {
      var search = $('#admin_join_referrals_search').val();

      send_request_socket({
        type: 'pagination',
        command: 'admin_join_referrals',
        page: 1,
        search: search,
      });
    }, 1000);
  });

  $(document).on(
    'click',
    '#pagination_admin_deposit_bonuses .pagination-item',
    function () {
      var page = $(this).attr('data-page');
      var search = $('#admin_deposit_bonuses_search').val();

      send_request_socket({
        type: 'pagination',
        command: 'admin_deposit_bonuses',
        page: page,
        search: search,
      });
    }
  );

  var timeout_admin_deposit_bonuses = null;
  $('#admin_deposit_bonuses_search').on('input', function () {
    if (timeout_admin_deposit_bonuses)
      clearTimeout(timeout_admin_deposit_bonuses);

    timeout_admin_deposit_bonuses = setTimeout(function () {
      var search = $('#admin_deposit_bonuses_search').val();

      send_request_socket({
        type: 'pagination',
        command: 'admin_deposit_bonuses',
        page: 1,
        search: search,
      });
    }, 1000);
  });

  $(document).on(
    'click',
    '#pagination_admin_gamebots .pagination-item',
    function () {
      var page = $(this).attr('data-page');
      var order = parseInt($('#admin_gamebots_order').val());
      var search = $('#admin_gamebots_search').val();

      send_request_socket({
        type: 'pagination',
        command: 'admin_gamebots',
        page: page,
        order: order,
        search: search,
      });
    }
  );

  $(document).on('change', '#admin_gamebots_order', function () {
    var order = parseInt($('#admin_gamebots_order').val());
    var search = $('#admin_gamebots_search').val();

    send_request_socket({
      type: 'pagination',
      command: 'admin_gamebots',
      page: 1,
      order: order,
      search: search,
    });
  });

  var timeout_admin_users = null;
  $('#admin_gamebots_search').on('input', function () {
    if (timeout_admin_users) clearTimeout(timeout_admin_users);

    timeout_admin_users = setTimeout(function () {
      var order = parseInt($('#admin_gamebots_order').val());
      var search = $('#admin_gamebots_search').val();

      send_request_socket({
        type: 'pagination',
        command: 'admin_gamebots',
        page: 1,
        order: order,
        search: search,
      });
    }, 1000);
  });
});

function pagination_create(pagination, pages, page) {
  var DIV =
    '<div class="pagination-item flex items-center justify-center" data-page="1">«</div>';

  DIV += '<div class="flex row gap-1">';
  var imin_page = page - 3;
  var imax_page = page + 3;

  var min_page = Math.max(
    1,
    imin_page - (imax_page > pages ? imax_page - pages : 0)
  );
  var max_page = Math.min(
    pages,
    imax_page + (imin_page < 1 ? 1 - imin_page : 0)
  );

  for (var i = min_page; i <= max_page; i++) {
    var class_item = '';
    if (page == i) class_item = 'active';

    DIV +=
      '<div class="pagination-item flex items-center justify-center ' +
      class_item +
      '" data-page="' +
      i +
      '">' +
      i +
      '</div>';
  }
  DIV += '</div>';

  DIV +=
    '<div class="pagination-item flex items-center justify-center" data-page="' +
    pages +
    '">»</div>';

  $(pagination).html(DIV);
}

function pagination_addUsers(list) {
  $('#admin_users_list').html(
    '<div class="table-row table_message"><div class="table-column">No data found</div></div>'
  );

  if (list.length > 0) $('#admin_users_list').empty();

  list.forEach(function (item) {
    var rank_name = {
      0: 'member',
      1: 'admin',
      2: 'moderator',
      3: 'helper',
      4: 'veteran',
      5: 'pro',
      6: 'youtuber',
      7: 'streamer',
      8: 'developer',
      100: 'owner',
    }[item.rank];

    var DIV = '<div class="table-row">';
    DIV += '<div class="table-column text-left">';
    DIV += '<div class="flex items-center gap-1">';
    DIV += createAvatarField(item.user, 'small', '', '');

    DIV +=
      '<div class="text-left width-full ellipsis">' + item.user.name + '</div>';
    DIV += '</div>';
    DIV += '</div>';

    DIV +=
      '<div class="table-column text-left pointer" data-copy="text" data-text="' +
      item.user.userid +
      '">' +
      item.user.userid +
      '</div>';
    DIV +=
      '<div class="table-column text-left">' +
      getFormatAmountString(item.balance) +
      '$</div>';
    DIV +=
      '<div class="table-column text-left text-bold chat-link-' +
      rank_name +
      '">' +
      rank_name.toUpperCase() +
      '</div>';
    DIV += '<div class="table-column text-left">' + item.time_create + '</div>';

    DIV +=
      '<div class="table-column text-right"><a href="' +
      ROOT +
      'admin/users/' +
      item.user.userid +
      '"><button class="site-button purple">Moderate</button></a></div>';
    DIV += '</div>';

    $('#admin_users_list').append(DIV);
  });
}

function pagination_addCryptoConfirmations(list) {
  $('#admin_crypto_confirmations').html(
    '<div class="table-row table_message"><div class="table-column">No data found</div></div>'
  );

  if (list.length > 0) $('#admin_crypto_confirmations').empty();

  list.forEach(function (item) {
    var DIV = '<div class="table-row">';
    DIV += '<div class="table-column text-left">#' + item.id + '</div>';
    DIV +=
      '<div class="table-column text-left pointer" data-copy="text" data-text="' +
      item.userid +
      '">' +
      item.userid +
      '</div>';
    DIV +=
      '<div class="table-column text-left">' +
      getFormatAmountString(item.amount) +
      '</div>';
    DIV += '<div class="table-column text-left">' + item.currency + '</div>';
    DIV += '<div class="table-column text-left">' + item.time + '</div>';

    DIV += '<div class="table-column full text-right">';
    DIV += '<div class="flex responsive row justify-end gap-1">';
    DIV +=
      '<button class="site-button purple admin_trades_confirm" data-method="crypto" data-trade="' +
      item.id +
      '">Confirm</button>';
    DIV +=
      '<button class="site-button purple admin_trades_cancel" data-method="crypto" data-trade="' +
      item.id +
      '">Cancel</button>';
    DIV += '</div>';
    DIV += '</div>';
    DIV += '</div>';

    $('#admin_crypto_confirmations').append(DIV);
  });
}

function pagination_addSteamConfirmations(list) {
  $('#admin_steam_confirmations').html(
    '<div class="table-row table_message"><div class="table-column">No data found</div></div>'
  );

  if (list.length > 0) $('#admin_steam_confirmations').empty();

  list.forEach(function (item) {
    var DIV = "<div class='table-row'>";
    DIV += "<div class='table-column text-left'>#" + item.id + '</div>';
    DIV +=
      "<div class='table-column text-left pointer' data-copy='text' data-text='" +
      item.userid +
      "'>" +
      item.userid +
      '</div>';
    DIV +=
      "<div class='table-column text-left'>" +
      getFormatAmountString(item.amount) +
      '</div>';
    DIV +=
      "<div class='table-column text-left text-color pointer admin_trades_items' data-items='" +
      item.items.replaceAll("'", '') +
      "'>View Items</div>";
    DIV +=
      "<div class='table-column text-left'>" +
      item.game.toUpperCase() +
      '</div>';
    DIV += "<div class='table-column text-left'>" + item.time + '</div>';

    DIV += "<div class='table-column full text-right'>";
    DIV += "<div class='flex responsive row justify-end gap-1'>";
    DIV +=
      "<button class='site-button purple admin_trades_confirm' data-method='crypto' data-trade='" +
      item.id +
      "'>Confirm</button>";
    DIV +=
      "<button class='site-button purple admin_trades_cancel' data-method='crypto' data-trade='" +
      item.id +
      "'>Cancel</button>";
    DIV += '</div>';
    DIV += '</div>';
    DIV += '</div>';

    $('#admin_steam_confirmations').append(DIV);
  });
}

function pagination_addJoinReferrals(list) {
  $('#admin_join_referrals').html(
    '<div class="table-row table_message"><div class="table-column">No data found</div></div>'
  );

  if (list.length > 0) $('#admin_join_referrals').empty();

  list.forEach(function (item) {
    var DIV = '<div class="table-row">';
    DIV +=
      '<div class="table-column text-left pointer" data-copy="text" data-text="' +
      item.referral +
      '">' +
      item.referral +
      '</div>';
    DIV +=
      '<div class="table-column text-left pointer" data-copy="text" data-text="' +
      item.userid +
      '">' +
      item.userid +
      '</div>';
    DIV += '<div class="table-column text-left">' + item.usage + '</div>';

    DIV += '<div class="table-column full text-right">';
    DIV += '<div class="flex responsive row justify-end gap-1">';
    DIV +=
      '<button class="site-button purple admin_join_referral_dashboard" data-id="' +
      item.id +
      '">Dashboard</button>';
    DIV +=
      '<button class="site-button red" data-copy="text" data-text="' +
      item.link +
      '">Copy link</button>';
    DIV += '</div>';
    DIV += '</div>';
    DIV += '</div>';

    $('#admin_join_referrals').append(DIV);
  });
}

function pagination_addDepositBonuses(list) {
  $('#admin_deposit_bonuses').html(
    '<div class="table-row table_message"><div class="table-column">No data found</div></div>'
  );

  if (list.length > 0) $('#admin_deposit_bonuses').empty();

  list.forEach(function (item) {
    var DIV = '<div class="table-row">';
    DIV +=
      '<div class="table-column text-left pointer" data-copy="text" data-text="' +
      item.code.toUpperCase() +
      '">' +
      item.code.toUpperCase() +
      '</div>';
    DIV +=
      '<div class="table-column text-left pointer" data-copy="text" data-text="' +
      item.referral +
      '">' +
      item.referral +
      '</div>';
    DIV += '<div class="table-column text-left">' + item.uses + '</div>';
    DIV +=
      '<div class="table-column text-left">' +
      roundedToFixed(item.amount, 5).toFixed(5) +
      '</div>';

    DIV += '<div class="table-column full text-right">';
    DIV +=
      '<button class="site-button purple admin_deposit_bonus_remove" data-id="' +
      item.id +
      '">Remove</button>';
    DIV += '</div>';
    DIV += '</div>';

    $('#admin_deposit_bonuses').append(DIV);
  });
}

function pagination_addUserTransactions(list) {
  $('#user_transactions').html(
    '<div class="table-row table_message"><div class="table-column">No data found</div></div>'
  );

  if (list.length > 0) $('#user_transactions').empty();

  list.forEach(function (item) {
    var DIV =
      '<div class="table-row text-' +
      (item.amount < 0 ? 'danger' : 'success') +
      '">';
    DIV += '<div class="table-column text-left">#' + item.id + '</div>';
    DIV +=
      '<div class="table-column text-left">' +
      capitalizeText(item.service.split('_').join(' ')) +
      '</div>';
    DIV +=
      '<div class="table-column text-left">$' +
      getFormatAmountString(item.balance) +
      ' ' +
      (item.amount < 0 ? '-' : '+') +
      ' $' +
      getFormatAmountString(Math.abs(item.amount)) +
      ' = $' +
      getFormatAmountString(item.balance + item.amount) +
      '</div>';
    DIV += '<div class="table-column text-left">' + item.time + '</div>';
    DIV += '</div>';

    $('#user_transactions').append(DIV);
  });
}

function pagination_addUserTransfers(list) {
  $('#user_transfers').html(
    '<div class="table-row table_message"><div class="table-column">No data found</div></div>'
  );

  if (list.length > 0) $('#user_transfers').empty();

  list.forEach(function (item) {
    var DIV =
      '<div class="table-row text-' +
      (item.received ? 'success' : 'danger') +
      '">';
    DIV += '<div class="table-column text-left">#' + item.id + '</div>';
    DIV += '<div class="table-column text-left">' + item.from + '</div>';
    DIV += '<div class="table-column text-left">' + item.to + '</div>';
    DIV +=
      '<div class="table-column text-left">$' +
      getFormatAmountString(item.amount) +
      '</div>';
    DIV += '<div class="table-column text-left">' + item.time + '</div>';
    DIV += '</div>';

    $('#user_transfers').append(DIV);
  });
}

function pagination_addCryptoTransactions(list) {
  $('#crypto_transactions').html(
    '<div class="table-row table_message"><div class="table-column">No data found</div></div>'
  );

  if (list.length > 0) $('#crypto_transactions').empty();

  list.forEach(function (item) {
    var status = {
      success: 'Completed',
      warning: 'In progress',
      danger: 'Declined',
    }[item.status];

    var DIV = '<div class="table-row text-' + item.status + '">';
    DIV += '<div class="table-column text-left">#' + item.id + '</div>';
    DIV += '<div class="table-column text-left">' + item.txnid + '</div>';
    DIV +=
      '<div class="table-column text-left">$' +
      getFormatAmountString(item.amount) +
      '</div>';
    DIV +=
      '<div class="table-column text-left">' +
      capitalizeText(item.type) +
      '</div>';
    DIV +=
      '<div class="table-column text-left">' +
      item.currency.toLowerCase() +
      '</div>';
    DIV += '<div class="table-column text-left">' + status + '</div>';
    DIV += '<div class="table-column text-left">' + item.time + '</div>';
    DIV += '</div>';

    $('#crypto_transactions').append(DIV);
  });
}

function pagination_addSteamTransactions(list) {
  $('#steam_transactions').html(
    '<div class="table-row table_message"><div class="table-column">No data found</div></div>'
  );

  if (list.length > 0) $('#steam_transactions').empty();

  list.forEach(function (item) {
    var status = {
      success: 'Completed',
      warning: 'In progress',
      danger: 'Declined',
    }[item.status];

    var DIV = '<div class="table-row text-' + item.status + '">';
    DIV += '<div class="table-column text-left">#' + item.id + '</div>';
    DIV +=
      '<div class="table-column text-left">' + item.tradeofferid + '</div>';
    DIV += '<div class="table-column text-left">' + item.code + '</div>';
    DIV +=
      '<div class="table-column text-left">$' +
      getFormatAmountString(item.amount) +
      '</div>';
    DIV += '<div class="table-column text-left">';
    DIV += capitalizeText(item.type);

    if (item.refill) DIV += ' (Refill)';
    DIV += '</div>';
    DIV += '<div class="table-column text-left">' + item.game + '</div>';
    DIV += '<div class="table-column text-left">' + status + '</div>';
    DIV += '<div class="table-column text-left">' + item.time + '</div>';
    DIV += '</div>';

    $('#steam_transactions').append(DIV);
  });
}

function pagination_addP2PTransactions(list) {
  $('#p2p_transactions').html(
    '<div class="table-row table_message"><div class="table-column">No data found</div></div>'
  );

  if (list.length > 0) $('#p2p_transactions').empty();

  list.forEach(function (item) {
    var status = {
      success: 'Completed',
      warning: 'In progress',
      danger: 'Canceled',
    }[item.status];

    var DIV = '<div class="table-row text-' + item.status + '">';
    DIV += '<div class="table-column text-left">#' + item.id + '</div>';
    DIV +=
      '<div class="table-column text-left">' + item.tradeofferid + '</div>';
    DIV +=
      '<div class="table-column text-left">$' +
      getFormatAmountString(item.amount) +
      '</div>';
    DIV +=
      '<div class="table-column text-left">' +
      capitalizeText(item.type) +
      '</div>';
    DIV += '<div class="table-column text-left">' + item.game + '</div>';
    DIV += '<div class="table-column text-left">' + status + '</div>';
    DIV += '<div class="table-column text-left">' + item.time + '</div>';
    DIV += '</div>';

    $('#p2p_transactions').append(DIV);
  });
}

function pagination_addGamebots(list) {
  $('#admin_gamebots_list').html(
    '<div class="table-row table_message"><div class="table-column">No data found</div></div>'
  );

  if (list.length > 0) $('#admin_gamebots_list').empty();

  list.forEach(function (item) {
    var DIV = '<div class="table-row">';
    DIV += '<div class="table-column text-left">';
    DIV += '<div class="flex items-center gap-1">';
    DIV += createAvatarField(item.user, 'small', '', '');

    DIV +=
      '<div class="text-left width-full ellipsis">' + item.user.name + '</div>';
    DIV += '</div>';
    DIV += '</div>';

    DIV +=
      '<div class="table-column text-left pointer" data-copy="text" data-text="' +
      item.user.userid +
      '">' +
      item.user.userid +
      '</div>';
    DIV +=
      '<div class="table-column text-left">' +
      getFormatAmountString(item.balance) +
      '$</div>';

    DIV +=
      '<div class="table-column text-right"><button class="site-button purple admin_gamebot_moderate" data-userid="' +
      item.user.userid +
      '">Moderate</button></div>';
    DIV += '</div>';

    $('#admin_gamebots_list').append(DIV);
  });
}

/* END PAGINATION */

/* ADMIN PANEL */

$(document).ready(function () {
  $(document).on('click', '#admin_maintenance_set', function () {
    var status = parseInt($('#admin_maintenance_status').val()) == 1;
    var reason = $('#admin_maintenance_reason').val();

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'maintenance',
        status: status,
        reason: reason,
        secret: secret,
      });
    });
  });

  $(document).on('click', '.admin_dropdown_settings', function () {
    var settings = $(this).attr('data-settings');
    var status =
      parseInt(
        $('.admin_control_settings[data-settings="' + settings + '"]').val()
      ) == 1;

    confirm_action(function (confirmed) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'settings',
        settings: settings,
        status: status,
      });
    });
  });

  $(document).on('change', '.admin_switch_settings', function () {
    var settings = $(this).attr('data-settings');
    var status = $(this).is(':checked');

    send_request_socket({
      type: 'admin',
      command: 'settings',
      settings: settings,
      status: status,
    });
  });

  $(document).on('click', '.admin_user_remove_bind', function () {
    var bind = $(this).attr('data-bind');

    if (PATHS[2] === undefined) return;

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'remove_bind',
        userid: PATHS[2],
        bind: bind,
        secret: secret,
      });
    });
  });

  $(document).on('click', '#admin_user_remove_exclusion', function () {
    if (PATHS[2] === undefined) return;

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'remove_exclusion',
        userid: PATHS[2],
        secret: secret,
      });
    });
  });

  $(document).on('click', '#admin_user_remove_sessions', function () {
    if (PATHS[2] === undefined) return;

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'remove_sessions',
        userid: PATHS[2],
        secret: secret,
      });
    });
  });

  $(document).on('click', '#admin_user_ip_ban', function () {
    var ip = $('#admin_user_ip_value').val();

    if (PATHS[2] === undefined) return;

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'ban_ip',
        userid: PATHS[2],
        ip: ip,
        secret: secret,
      });
    });
  });

  $(document).on('click', '#admin_user_ip_unban', function () {
    var ip = $('#admin_user_ip_value').val();

    if (PATHS[2] === undefined) return;

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'unban_ip',
        userid: PATHS[2],
        ip: ip,
        secret: secret,
      });
    });
  });

  $(document).on('click', '#admin_user_rank_set', function () {
    var rank = parseInt($('#admin_user_rank_value').val());

    if (PATHS[2] === undefined) return;

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'set_rank',
        userid: PATHS[2],
        rank: rank,
        secret: secret,
      });
    });
  });

  $(document).on('click', '#admin_user_balance_edit', function () {
    var amount = $('#admin_user_balance_amount').val();

    if (PATHS[2] === undefined) return;

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'edit_balance',
        userid: PATHS[2],
        amount: amount,
        secret: secret,
      });
    });
  });

  $(document).on('click', '.admin_user_restriction_set', function () {
    var restriction = $(this).attr('data-restriction');

    var reason = $(
      '.admin_user_restriction_reason[data-restriction="' + restriction + '"]'
    ).val();
    var amount = $(
      '.admin_user_restriction_amount[data-restriction="' + restriction + '"]'
    ).val();
    var date = $(
      '.admin_user_restriction_date[data-restriction="' + restriction + '"]'
    ).val();

    if (PATHS[2] === undefined) return;

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'set_restriction',
        userid: PATHS[2],
        restriction: restriction,
        time: amount + date,
        reason: reason,
        secret: secret,
      });
    });
  });

  $(document).on('click', '.admin_user_restriction_permanently', function () {
    var restriction = $(this).attr('data-restriction');

    var reason = $(
      '.admin_user_restriction_reason[data-restriction="' + restriction + '"]'
    ).val();

    if (PATHS[2] === undefined) return;

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'set_restriction',
        userid: PATHS[2],
        restriction: restriction,
        time: 'permanent',
        reason: reason,
        secret: secret,
      });
    });
  });

  $(document).on('click', '.admin_user_restriction_unset', function () {
    var restriction = $(this).attr('data-restriction');

    if (PATHS[2] === undefined) return;

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'unset_restriction',
        userid: PATHS[2],
        restriction: restriction,
        secret: secret,
      });
    });
  });

  $(document).on('click', '#admin_admin_access_set', function () {
    var userid = $('#admin_admin_access_userid').val();

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'admin_access_set',
        userid: userid,
        secret: secret,
      });
    });
  });

  $(document).on('click', '#admin_admin_access_unset', function () {
    var userid = $('#admin_admin_access_userid').val();

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'admin_access_unset',
        userid: userid,
        secret: secret,
      });
    });
  });

  $(document).on('click', '#admin_dashboard_access_set', function () {
    var userid = $('#admin_dashboard_access_userid').val();

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'dashboard_access_set',
        userid: userid,
        secret: secret,
      });
    });
  });

  $(document).on('click', '#admin_dashboard_access_unset', function () {
    var userid = $('#admin_dashboard_access_userid').val();

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'dashboard_access_unset',
        userid: userid,
        secret: secret,
      });
    });
  });

  $(document).on('click', '#admin_alert_set', function () {
    var alert = $('#admin_alert_alert').val();

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'alert_set',
        alert: alert,
        secret: secret,
      });
    });
  });

  $(document).on('click', '.admin_alert_unset', function () {
    var id = $(this).attr('data-id');

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'alert_unset',
        id: id,
        secret: secret,
      });
    });
  });

  $(document).on('click', '#admin_notify_set', function () {
    var notify = $('#admin_notify_notify').val();

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'notify_set',
        notify: notify,
        secret: secret,
      });
    });
  });

  $(document).on('click', '.admin_notify_unset', function () {
    var id = $(this).attr('data-id');

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'notify_unset',
        id: id,
        secret: secret,
      });
    });
  });

  $(document).on('click', '#admin_join_referrals_create', function () {
    var expire = $('#admin_join_referrals_expire').val();
    var usage = $('#admin_join_referrals_usage').val();

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'join_referral_create',
        expire: expire,
        usage: usage,
        secret: secret,
      });
    });
  });

  $(document).on('click', '.admin_join_referrals_remove', function () {
    var id = $(this).attr('data-id');

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'join_referral_remove',
        id: id,
        secret: secret,
      });
    });
  });

  $(document).on('click', '.admin_join_referral_dashboard', function () {
    var id = $(this).attr('data-id');

    var $dashboard = $('#join_referral_dashboard .dashboard-chart');

    $dashboard.find('.dashboard-select .dashboard-graph').removeClass('active');
    $dashboard
      .find('.dashboard-select .dashboard-graph')
      .first()
      .addClass('active');

    $dashboard.attr('data-id', id);
    $('#join_referral_dashboard .admin_join_referrals_remove').attr(
      'data-id',
      id
    );

    dashboard_loadGraph({
      date: $dashboard
        .find('.dashboard-select .dashboard-graph.active')
        .attr('data-date'),
      graph: $dashboard.attr('data-graph') + '.' + $dashboard.attr('data-id'),
    });

    $('#join_referral_dashboard').modal('show');
  });

  $(document).on('click', '#admin_deposit_bonus_create', function () {
    var referral = $('#admin_deposit_bonus_referral').val();
    var code = $('#admin_deposit_bonus_code').val();

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'deposit_bonus_create',
        referral: referral,
        code: code,
        secret: secret,
      });
    });
  });

  $(document).on('click', '.admin_deposit_bonus_remove', function () {
    var id = $(this).attr('data-id');

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'deposit_bonus_remove',
        id: id,
        secret: secret,
      });
    });
  });

  $(document).on('click', '.admin_trades_confirm', function () {
    var method = $(this).attr('data-method');
    var trade = $(this).attr('data-trade');

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'trade_confirm',
        method: method,
        trade: trade,
        secret: secret,
      });
    });
  });

  $(document).on('click', '.admin_trades_cancel', function () {
    var method = $(this).attr('data-method');
    var trade = $(this).attr('data-trade');

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'trade_cancel',
        method: method,
        trade: trade,
        secret: secret,
      });
    });
  });

  $(document).on('click', '#admin_trades_manually_amount_set', function () {
    var amount = $('#admin_trades_manually_amount_value').val();

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'trades_manually_amount',
        amount: amount,
        secret: secret,
      });
    });
  });

  $(document).on('click', '.admin_trades_items', function () {
    var items = $(this).data('items').items;

    $('#modal_view_bundle').modal('show');
    $('#modal_view_bundle .bundle-items').empty();

    items.forEach(function (item) {
      var data = '';
      var feathers = '';
      var classes = 'bundle_offer';
      var header = '';
      var footer = '';

      $('#modal_view_bundle .bundle-items').append(
        offers_generateItem([item], data, feathers, classes, header, footer)
      );
    });
  });

  $(document).on('click', '#admin_gamebots_create', function () {
    var name = $('#admin_gamebots_name').val();

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'gamebots_create',
        name: name,
        secret: secret,
      });
    });
  });

  $(document).on('click', '.admin_gamebot_moderate', function () {
    var userid = $(this).attr('data-userid');

    $('#admin_gamebots_balance_edit').attr('data-userid', userid);

    $('#modal_gamebots_moderate').modal('show');
  });

  $(document).on('click', '#admin_gamebots_balance_edit', function () {
    var amount = $('#admin_gamebots_balance_amount').val();
    var userid = $(this).attr('data-userid');

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'edit_balance',
        userid: userid,
        amount: amount,
        secret: secret,
      });
    });
  });
});

function confirm_action(callback) {
  $('#modal_confirm_action').modal('show');

  $(document).off('click', '#confirm_action_no');
  $(document).off('click', '#confirm_action_yes');

  $(document).on('click', '#confirm_action_no', function () {
    return callback(false);
  });

  $(document).on('click', '#confirm_action_yes', function () {
    return callback(true);
  });
}

function confirm_identity(callback) {
  $('#modal_confirm_identity').modal('show');

  $(document).off('click', '#confirm_identity_no');
  $(document).off('click', '#confirm_identity_yes');

  $(document).on('click', '#confirm_identity_no', function () {
    return callback(false);
  });

  $(document).on('click', '#confirm_identity_yes', function () {
    var secret = $('#confirm_identity_secret').val();

    return callback(true, secret);
  });
}

/* END ADMIN PANEL */

/* AUTH */

$(document).ready(function () {
  $('.form_auth').on('submit', function (e) {
    e.preventDefault();

    $.ajax({
      url: $(this).attr('action'),
      type: $(this).attr('method'),
      data: $(this).serialize(),
      success: function (data) {
        try {
          data = JSON.parse(data);

          if (data.success) {
            if (data.reload) location.reload(true);
            else if (data.refresh) site_refresh();
            else if (data.message.have) notify('success', data.message.message);
          } else {
            notify('error', data.error);
          }
        } catch (err) {
          notify('error', err.message);
        }
      },
      error: function (err) {
        notify('error', 'Error 500');
      },
    });
  });
});

/* END AUTH */

/* SECURITY 2FA */

$(document).ready(function () {
  if (!LOGGED) {
    if (SECURITY.twofa) {
      $('#modal_twofa_security .submit-security-twofa').attr(
        'data-type',
        'login'
      );
      $('#modal_twofa_security').modal('show');
    } else if (SECURITY.email) {
      $('#modal_twofa_code .submit-code-twofa').attr('data-type', 'login');
      $('#modal_twofa_code').modal('show');
    }
  }

  $(document).on('click', 'a.form_security', function (e) {
    e.preventDefault();

    var data = [];
    if ($(this).hasClass('generate-code-twofa'))
      data.push({ name: 'type', value: $(this).attr('data-type') });
    else if ($(this).hasClass('submit-code-twofa'))
      data.push({ name: 'type', value: $(this).attr('data-type') });
    else if ($(this).hasClass('submit-security-twofa'))
      data.push({ name: 'type', value: $(this).attr('data-type') });

    $.ajax({
      url: $(this).attr('href'),
      type: 'POST',
      data: data,
      success: function (data) {
        try {
          data = JSON.parse(data);

          if (data.success) notify('success', data.message);
          else notify('error', data.error);
        } catch (err) {
          notify('error', err.message);
        }
      },
      error: function (err) {
        notify('error', 'Error 500');
      },
    });
  });

  $(document).on('submit', '.form_security', function (e) {
    e.preventDefault();

    var data = $(this).serializeArray();
    if ($(this).hasClass('generate-code-twofa'))
      data.push({ name: 'type', value: $(this).attr('data-type') });
    else if ($(this).hasClass('submit-code-twofa'))
      data.push({ name: 'type', value: $(this).attr('data-type') });
    else if ($(this).hasClass('submit-security-twofa'))
      data.push({ name: 'type', value: $(this).attr('data-type') });

    $.ajax({
      url: $(this).attr('action'),
      type: $(this).attr('method'),
      data: data,
      success: function (data) {
        try {
          data = JSON.parse(data);

          if (data.success) {
            if (data.action == 'generate_twofa') {
              $('#modal_twofa_code .submit-code-twofa').attr(
                'data-type',
                'enable_twofa'
              );

              $('#modal_twofa_code').modal('show');
            } else if (data.action == 'enable_twofa') {
              $('#modal_twofa_code').modal('hide');

              $('#twofa_auth_recover').text(data.twofa.recover);
              $('#twofa_auth_secret').text(data.twofa.secret);

              $('#twofa_qrcode').empty();

              var qrcode = new QRCode($('#twofa_qrcode')[0], {
                text:
                  'otpauth://totp/' +
                  data.twofa.userid +
                  '?secret=' +
                  data.twofa.secret +
                  '&issuer=' +
                  data.twofa.issuer,
                width: 192,
                height: 192,
              });

              $('#modal_twofa_enable').modal('show');
            } else if (data.action == 'activate_twofa') {
              $('#modal_twofa_enable').modal('hide');

              notify('success', data.message);

              site_refresh();
            } else if (data.action == 'disable_twofa') {
              $('#modal_twofa_security').modal('hide');
              $('#modal_twofa_recover').modal('hide');

              notify('success', data.message);

              site_refresh();
            } else if (data.action == 'recover_twofa') {
              $('#modal_twofa_security').modal('hide');
              $('#modal_twofa_recover').modal('hide');

              notify('success', data.message);

              site_refresh();
            } else if (data.action == 'login') {
              location.reload(true);
            }
          } else {
            notify('error', data.error);
          }
        } catch (err) {
          notify('error', err.message);
        }
      },
      error: function (err) {
        notify('error', 'Error 500');
      },
    });
  });

  $(document).on('click', '.open_twofa_security', function () {
    var type = $(this).attr('data-type');

    $('#modal_twofa_security .submit-security-twofa').attr('data-type', type);
    $('#modal_twofa_security').modal('show');
  });
});

/* END SECURITY 2FA */

/* FAIR */

$(document).ready(function () {
  $(document).on('click', '#save_clientseed', function () {
    var client_seed = $('#client_seed').val();

    send_request_socket({
      type: 'fair',
      command: 'save_clientseed',
      seed: client_seed,
      recaptcha: 'api token',
    });

    // requestRecaptcha(function(render){
    // 	send_request_socket({
    // 		'type': 'fair',
    // 		'command': 'save_clientseed',
    // 		'seed': client_seed,
    // 		'recaptcha': render
    // 	});
    // });
  });

  $(document).on('click', '#regenerate_serverseed', function () {
    send_request_socket({
      type: 'fair',
      command: 'regenerate_serverseed',
      recaptcha: 'api token',
    });
    // requestRecaptcha(function(render){
    // 	send_request_socket({
    // 		'type': 'fair',
    // 		'command': 'regenerate_serverseed',
    // 		'recaptcha': render
    // 	});
    // });
  });
});

/* END FAIR */

/* CHAT */

var chat_ignoreList = [];
var chat_commands = [];
var chat_isScroll = true;
var chat_maxMessages = 40;
var chat_channelsMessages = {
  en: 0,
  ro: 0,
  fr: 0,
  ru: 0,
  de: 0,
};

var timeFormats = [
  {
    time: 1,
    time_format: 1,
    ago: 'seconds ago',
    next: 'seconds from now',
    count: true,
  },
  {
    time: 60,
    time_format: 60,
    ago: 'minute ago',
    next: 'minute from now',
    count: true,
  },
  {
    time: 120,
    time_format: 60,
    ago: 'minutes ago',
    next: 'minutes from now',
    count: true,
  },
  {
    time: 3600,
    time_format: 3600,
    ago: 'hour ago',
    next: 'hour from now',
    count: true,
  },
  {
    time: 7200,
    time_format: 3600,
    ago: 'hours ago',
    next: 'hours from now',
    count: true,
  },
  {
    time: 86400,
    time_format: 86400,
    ago: 'Yesterday',
    next: 'Tomorrow',
    count: false,
  },
  {
    time: 172800,
    time_format: 86400,
    ago: 'days ago',
    next: 'days from now',
    count: true,
  },
  {
    time: 604800,
    time_format: 604800,
    ago: 'Last week',
    next: 'Next week',
    count: false,
  },
  {
    time: 1209600,
    time_format: 604800,
    ago: 'weeks ago',
    next: 'weeks from now',
    count: true,
  },
  {
    time: 2419200,
    time_format: 2419200,
    ago: 'Last month',
    next: 'Next month',
    count: false,
  },
  {
    time: 4838400,
    time_format: 2419200,
    ago: 'months ago',
    next: 'months from now',
    count: true,
  },
  {
    time: 29030400,
    time_format: 29030400,
    ago: 'Last year',
    next: 'Next year',
    count: false,
  },
  {
    time: 58060800,
    time_format: 29030400,
    ago: 'years ago',
    next: 'years from now',
    count: true,
  },
  {
    time: 2903040000,
    time_format: 2903040000,
    ago: 'Last century',
    next: 'Next century',
    count: false,
  },
  {
    time: 5806080000,
    time_format: 2903040000,
    ago: 'centuries ago',
    next: 'centuries from now',
    count: true,
  },
];

function getFormatTime(time, type) {
  var seconds = parseInt((new Date().getTime() - time) / 1000);

  var text = 'Now';
  var count = false;
  var time_format = 1;

  for (var i = 0; i < timeFormats.length; i++) {
    if (seconds >= timeFormats[i]['time']) {
      text = timeFormats[i][type];
      count = timeFormats[i]['count'];
      time_format = timeFormats[i]['time_format'];
    }
  }

  if (count) {
    return parseInt(seconds / time_format) + ' ' + text;
  } else {
    return text;
  }
}

//CHAT
function chat_message(message, added) {
  if (message.type == 'system') {
    var DIV = '<div class="chat-message p-1 bounce_center">';
    DIV += '<div class="flex relative width-full">';
    DIV += '<div class="relative m-1">';
    DIV +=
      '<img class="icon-medium rounded-full" src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg">';
    DIV += '</div>';

    DIV += '<div class="chat-message-header flex column justify-center">';
    var messageid = Math.floor(Math.random() * 100000);

    DIV +=
      '<div class="chat-message-name chat-link-system ellipsis">System</div>';
    DIV +=
      '<div class="chat-message-time" data-id="' +
      messageid +
      '">' +
      getFormatTime(message.time, 'ago') +
      '</div>';
    DIV +=
      '<script>setInterval(function(){$(".chat-message-time[data-id=' +
      messageid +
      ']").text(getFormatTime(' +
      message.time +
      ', "ago"))},1000)</script>';
    DIV += '</div>';
    DIV += '</div>';
    DIV +=
      '<div class="chat-message-content bg-light-transparent p-2 rounded-1 chat-link-system">' +
      message.message +
      '</div>';
    DIV += '</div>';
  } else if (message.type == 'player') {
    console.log('---------------- player chat : ');
    if (chat_ignoreList.includes(message.user.userid)) return;

    if (message.channel) {
      if (message.channel != profile_settingsGet('channel')) {
        if (added == true) {
          chat_channelsMessages[message.channel]++;
          if (chat_channelsMessages[message.channel] > 0)
            $('.flag[data-channel=' + message.channel + '] .new-messages')
              .removeClass('hidden')
              .text(chat_channelsMessages[message.channel]);
        }
        return;
      }
    }
    // console.log('---------- chat message : ', message);
    var new_message = chat_checkMention(message.message, message.mentions);
    new_message = chat_checkEmotes(new_message);

    var rank_name = {
      0: 'member',
      1: 'admin',
      2: 'moderator',
      3: 'helper',
      4: 'veteran',
      5: 'pro',
      6: 'youtuber',
      7: 'streamer',
      8: 'developer',
      100: 'owner',
    }[message.rank];

    var DIV =
      '<div class="chat-message p-1 bounce_center chat-content-' +
      rank_name +
      '" data-message="' +
      message.id +
      '" >';
    DIV += '<div class="chat-user-info flex relative width-full">';
    DIV += '<div class="m-1">';
    DIV += createAvatarField(message.user, 'medium', '', '');
    DIV += '</div>';

    DIV += '<div class="chat-message-header flex column justify-center">';
    DIV +=
      '<div class="chat-message-name chat-link-' + rank_name + ' ellipsis">';
    if (rank_name && message.rank != 0)
      DIV +=
        '<div class="chat-message-rank mr-1 rounded-0 chat-rank-' +
        rank_name +
        '">' +
        rank_name +
        '</div>';
    DIV += message.user.name;
    DIV += '</div>';
    DIV +=
      '<div class="chat-message-time">' +
      getFormatTime(message.time, 'ago') +
      '</div>';
    DIV +=
      '<script>setInterval(function(){$(".chat-message[data-message=' +
      message.id +
      '] .chat-message-time").text(getFormatTime(' +
      message.time +
      ', "ago"))},1000)</script>';
    DIV += '</div>';

    DIV +=
      '<div class="transition-5 flex justify-center items-center" id="chat-message-settings">';
    DIV += '<div class="grid split-column-full width-full">';
    if (!message['private'])
      DIV +=
        '<a href="' +
        ROOT +
        'profile/' +
        message.user.userid +
        '"><div class="chat-message-setting rounded-full flex items-center justify-center" data-toggle="tooltip" data-placement="bottom" title="PROFILE"><i class="fa fa-user" aria-hidden="true"></i></div></a>';
    DIV +=
      '<div class="flex items-center justify-center"><div class="chat-message-setting rounded-full flex items-center justify-center" title="COMMANDS" id="user_commands"><i class="fa fa-code" aria-hidden="true"></i></div></div>';
    DIV +=
      '<div class="flex items-center justify-center"><div class="chat-message-setting rounded-full flex items-center justify-center" title="MENTION" id="chat_message_commands" data-setting="@' +
      message.user.userid +
      '"><i class="fa fa-bell" aria-hidden="true"></i></div></div>';
    DIV +=
      '<div class="flex items-center justify-center"><div class="chat-message-setting rounded-full flex items-center justify-center" title="SEND DIESEL" id="send_coins" data-user="' +
      message.user.userid +
      '"><i class="fa fa-gift" aria-hidden="true"></i></div></div>';
    DIV += '</div>';
    DIV += '<div class="hidden p-2 mt-1" id="chat-message-commands">';
    DIV += '<div class="title-panel rounded-1 p-1 mb-1">Commands</div>';

    chat_commands.forEach(function (command) {
      if (command.type == 'id') {
        DIV +=
          '<div class="ellipsis" id="chat_message_commands" data-setting="/' +
          command.name +
          ' ' +
          message.id +
          '">/' +
          command.name +
          '</div>';
      }
    });

    chat_commands.forEach(function (command) {
      if (command.type == 'userid') {
        DIV +=
          '<div class="ellipsis" id="chat_message_commands" data-setting="/' +
          command.name +
          ' ' +
          message.user.userid +
          '">/' +
          command.name +
          ' ' +
          message.user.userid +
          '</div>';
      }
    });
    DIV += '</div>';
    DIV += '</div>';
    DIV += '</div>';
    DIV +=
      '<div class="chat-message-content bg-light-transparent p-2 rounded-1">' +
      new_message +
      '</div>';
    DIV += '</div>';
  }

  $('#chat-area').append(DIV);

  if (chat_isScroll) {
    while ($('#chat-area .chat-message').length > chat_maxMessages)
      $('#chat-area .chat-message').first().remove();

    $('#chat-area').scrollTop(5000);
    $('.chat-input-scroll').addClass('hidden');
    chat_isScroll = true;
  }
}

//EMOTES
function chat_checkEmotes(message) {
  var emotes = {
    smile: 'png',
    smiley: 'png',
    grin: 'png',
    pensive: 'png',
    weary: 'png',
    astonished: 'png',
    rolling_eyes: 'png',
    relaxed: 'png',
    wink: 'png',
    woozy_face: 'png',
    zany_face: 'png',
    hugging: 'png',
    joy: 'png',
    sob: 'png',
    grimacing: 'png',
    rofl: 'png',
    face_monocle: 'png',
    thinking: 'png',
    pleading_face: 'png',
    sleeping: 'png',
    sunglasses: 'png',
    heart_eyes: 'png',
    smiling_hearts: 'png',
    kissing_heart: 'png',
    star_struck: 'png',
    nerd: 'png',
    innocent: 'png',
    face_vomiting: 'png',
    money_mouth: 'png',
    cold_sweat: 'png',
    partying_face: 'png',
    exploding_head: 'png',
    rage: 'png',
    hot_face: 'png',
    cold_face: 'png',
    smiling_imp: 'png',
    alien: 'png',
    clown: 'png',
    scream_cat: 'png',
    smiley_cat: 'png',
    robot: 'png',
    ghost: 'png',
    skull: 'png',
    poop: 'png',
    jack_o_lantern: 'png',
    100: 'png',
    bell: 'png',
    birthday: 'png',
    gift: 'png',
    first_place: 'png',
    trophy: 'png',
    tada: 'png',
    crown: 'png',
    fire: 'png',
    heart: 'png',
    broken_heart: 'png',
    wave: 'png',
    clap: 'png',
    raised_hands: 'png',
    thumbsup: 'png',
    peace: 'png',
    ok_hand: 'png',
    muscle: 'png',
    punch: 'png',
    moneybag: 'png',
    crypepe: 'png',
    firinpepe: 'png',
    happepe: 'png',
    monkachrist: 'png',
    okpepe: 'png',
    sadpepe: 'png',
    gaben: 'png',
    kappa: 'png',
    kappapride: 'png',
    kim: 'png',
    pogchamp: 'png',
    shaq: 'png',
    alert: 'gif',
    awp: 'gif',
    bananadance: 'gif',
    carlton: 'gif',
    fortdance: 'gif',
    grenade: 'gif',
    lolizard: 'gif',
    partyblob: 'gif',
    saxguy: 'gif',
    squidab: 'gif',
    turtle: 'gif',
    zombie: 'gif',
    bet: 'png',
    cant: 'png',
    cashout: 'png',
    doit: 'png',
    dont: 'png',
    feelsbad: 'png',
    feelsgood: 'png',
    gg: 'png',
    gl: 'png',
    highroller: 'png',
    joinme: 'png',
    letsgo: 'png',
    win: 'png',
    lose: 'png',
    nice: 'png',
    sniped: 'png',
    midtick: 'png',
    lowtick: 'png',
  };

  var props = Object.keys(emotes);
  for (var i = 0; i < props.length; i++) {
    message = message.replace(
      new RegExp(':' + props[i] + ':( |$)', 'g'),
      "<img class='emojis-chat-icon' src='" +
        ROOT +
        'template/img/emojis/' +
        props[i] +
        '.' +
        emotes[props[i]] +
        "'> "
    );
  }
  return message;
}

//CHECK MENTIONS NAME
function chat_checkMention(message, mentions) {
  mentions.forEach(function (mention) {
    while (message.indexOf(mention.mention) != -1) {
      if (mention.mention.replace('@', '') == USER) {
        message = message.replace(
          mention.mention,
          '<div class="inline-block bg-info rounded-0 pr-1 pl-1">' +
            mention.name +
            '</div>'
        );
      } else {
        message = message.replace(mention.mention, mention.name);
      }
    }
  });

  return message;
}

//ALERTS
var alerts_timeout = null;

function alerts_add(alerts) {
  // alert(alerts);
  // if(alerts.length <= 0) return;
  // $('.alerts-panel').removeClass('hidden');
  // if(alerts_timeout) clearTimeout(alerts_timeout);
  // var current_alert = 0;
  // alerts_change();
  // function alerts_change(){
  // 	$('.alerts-panel .text-alert').text(alerts[current_alert]);
  // 	if(current_alert >= alerts.length) current_alert = 0; else current_alert++;
  // 	alerts_timeout = setTimeout(function(){
  // 		alerts_change();
  // 	}, 10000);
  // }
}

//NOTIFY
function notifies_add(notifies) {
  $('#toast-container .toast').remove();

  notifies.forEach(function (notify) {
    toastr['info'](notify, '', {
      timeOut: 0,
      extendedTimeOut: 0,
    });
  });
}

//SCROLL CHAT
function chat_checkScroll() {
  var scroll_chat = $('#chat-area').scrollTop() + $('#chat-area').innerHeight();
  var scroll_first_message = $('#chat-area')[0].scrollHeight;

  if (Math.ceil(scroll_chat) >= Math.floor(scroll_first_message)) return true;
  return false;
}

//ON RESIZE CHAT
function resize_pullout(pullout, hide) {
  var width_pullout = 275;
  if ($(window).width() <= 768) width_pullout = $(window).width();

  if ($('.pullout[data-pullout="' + pullout + '"]').length <= 0) return;

  if ($('.pullout[data-pullout="' + pullout + '"]').hasClass('pullout-left'))
    var type = 'left';
  if ($('.pullout[data-pullout="' + pullout + '"]').hasClass('pullout-right'))
    var type = 'right';

  if ($(window).width() <= 768) {
    if (hide) {
      $('.pullout[data-pullout="' + pullout + '"]')
        .css(type, -width_pullout + 'px')
        .css('width', width_pullout + 'px')
        .removeClass('active');

      $('.main-panel').css(type, '0');
      $('.alerts-panel').css(type, '0');
    } else {
      $('.pullout[data-pullout="' + pullout + '"]')
        .css(type, '0px')
        .css('width', width_pullout + 'px')
        .addClass('active');

      $('.main-panel').css(type, '0');
      $('.alerts-panel').css(type, '0');
    }
  } else {
    if (hide) {
      $('.pullout[data-pullout="' + pullout + '"]')
        .css(type, -width_pullout + 'px')
        .css('width', width_pullout + 'px')
        .removeClass('active');

      $('.main-panel').css(type, '0');
      $('.alerts-panel').css(type, '0');
    } else {
      $('.pullout[data-pullout="' + pullout + '"]')
        .css(type, '0px')
        .css('width', width_pullout + 'px')
        .addClass('active');

      if ($(window).width() <= 768) {
        $('.main-panel').css(type, '0');
        $('.alerts-panel').css(type, '0');
      } else {
        $('.main-panel').css(type, width_pullout + 'px');
        $('.alerts-panel').css(type, width_pullout + 'px');
      }
    }

    if (PATHS[0] == 'unboxing') {
      var timeout_resize = 0;

      var interval_resize = setInterval(function () {
        if (timeout_resize > 500) clearInterval(interval_resize);

        if (PATHS[0] == 'unboxing') initializingSpinner_Unboxing();

        timeout_resize += 10;
      }, 10);
    }
  }
}

$(document).ready(function () {
  $(window).resize(function () {
    if ($(window).width() <= 768)
      $('.pullout.active').css('width', $(window).width() + 'px');
  });
});

$(document).ready(function () {
  $(document).on('input', '.betamount', function () {
    var amount = $(this).val();
    var game = $(this).attr('data-game');
  });

  $(document).on('click', '.betshort_action', function () {
    var $field = $(this).closest('.input_field');
    var $input = $field.find('.field_element_input');

    var game = $(this).data('game');

    var amount = $input.val();

    amount = getNumberFromString(amount);

    var bet_amount = getFormatAmount(amount);
    var action = $(this).data('action');

    if (action == 'clear') {
      bet_amount = 0;
    } else if (action == 'double') {
      bet_amount *= 2;
    } else if (action == 'half') {
      bet_amount /= 2;
    } else if (action == 'max') {
      bet_amount = BALANCE;
    } else {
      action = getNumberFromString(action);
      bet_amount += getFormatAmount(action);
    }

    $input.val(getFormatAmountString(bet_amount));

    $input.trigger('input');
    changeInputFieldLabel($field);
  });

  $(document).on('click', '.changeshort_action', function () {
    var fixed = parseInt($(this).data('fixed'));

    var $input = $($(this).data('id'));
    var $field = $input.closest('.input_field');

    var value = $input.val();
    value = getNumberFromString(value);

    if (fixed) var new_value = roundedToFixed(value, 2);
    else var new_value = parseInt(value);

    var action = $(this).data('action');

    if (action == 'clear') {
      new_value = 0;
    } else {
      action = getNumberFromString(action);

      if (fixed) new_value += roundedToFixed(action, 2);
      else new_value += parseInt(action);
    }

    if (fixed) $input.val(roundedToFixed(new_value, 2).toFixed(2));
    else $input.val(parseInt(new_value));

    $input.trigger('input');
    changeInputFieldLabel($field);
  });

  //SHOW / HIDE COMMANDS PLAYER
  $(document).on('mouseover', '.chat-user-info', function () {
    $(this).find('#chat-message-settings').css('opacity', 1);
  });

  $(document).on('mouseleave', '.chat-user-info', function () {
    $(this).find('#chat-message-settings').css('opacity', 0);

    $(this)
      .find('#chat-message-commands')
      .css('z-index', '-1000')
      .addClass('hidden');
  });

  //SHOW / HIDE BALANCES
  $(document).on('mouseover', '.balances', function () {
    $(this).find('.balances-panel').removeClass('hidden');
  });

  $(document).on('mouseleave', '.balances', function () {
    $(this).find('.balances-panel').addClass('hidden');
  });

  //HIDE ALERTS
  $(document).on('click', '.demiss-alert', function () {
    $('.alerts-panel').addClass('hidden');
  });

  //SELLECT LANGUAGE
  $('.flag').on('click', function () {
    send_request_socket({
      type: 'chat',
      command: 'get_channel',
      channel: $(this).data('channel'),
    });
  });

  //CHAT SCHOLL
  $('#chat-area').bind('scroll', function () {
    if (chat_checkScroll()) {
      while ($('#chat-area .chat-message').length > chat_maxMessages)
        $('#chat-area .chat-message').first().remove();

      $('.chat-input-scroll').addClass('hidden');
      chat_isScroll = true;
    } else {
      $('.chat-input-scroll').removeClass('hidden');
      chat_isScroll = false;
    }
  });

  $('.chat-input-scroll').on('click', function () {
    $('.chat-input-scroll').addClass('hidden');
    chat_isScroll = true;

    $('#chat-area').animate(
      {
        scrollTop: 5000,
      },
      {
        duration: 500,
      }
    );
  });

  //EMOGIES
  $(document).on('click', '.emojis-smile-icon', function () {
    var type = $(this).data('type');

    $('.emojis-smile-icon').removeClass('hidden');
    $(this).addClass('hidden');

    if (type == 'show') $('.emojis-panel').fadeIn(300);
    else if (type == 'hide') $('.emojis-panel').fadeOut(300);
  });

  $(document).on('click', '#chat_place_emoji', function () {
    var smile = $(this).data('emoji');

    $('#chat_message').val($('#chat_message').val() + smile + ' ');
    $('#chat_message').focus();
  });

  //SHOW COMMANDS SETTINGS ICON
  $(document).on('click', '#user_commands', function () {
    $(this)
      .parent()
      .parent()
      .parent()
      .find('#chat-message-commands')
      .removeClass('hidden')
      .css('z-index', '1001');
  });

  //COMMAND SETTING
  $(document).on('click', '#chat_message_commands', function () {
    var command = $(this).data('setting');

    $('#chat_message')
      .val(command + ' ')
      .focus();
  });

  //SEND COINS
  $(document).on('click', '#send_coins', function () {
    $('#modal_send_coins').modal('show');

    $('#modal_send_coins #send_coins_to_user').attr(
      'data-user',
      $(this).data('user')
    );
  });

  $(document).on('click', '#send_coins_to_user', function () {
    var amount = $('#send_coins_amount').val();
    var user = $(this).attr('data-user');

    requestRecaptcha(function (render) {
      send_request_socket({
        type: 'chat',
        command: 'send_coins',
        to: user,
        amount: amount,
        recaptcha: render,
      });
    });
  });

  //SUBMIT MESSAGE
  $('#chat-input-form').on('submit', function () {
    var message = $('#chat_message').val();

    if (message.trim().length > 0) {
      send_request_socket({
        type: 'chat',
        command: 'message',
        message: message,
        channel: profile_settingsGet('channel'),
      });

      $('#chat_message').val('');
    }

    return false;
  });

  //RAIN
  $(document).on('click', '#join_rain', function () {
    requestRecaptcha(function (render) {
      send_request_socket({
        type: 'rain',
        command: 'join',
        recaptcha: render,
      });
    });
  });
});

/* END CHAT */

/* COINFLIP */

function coinflipGame_addCoinFlip(coinflip) {
  var DIV = coinflipGame_generateBet(coinflip, 0);

  var $field = $('#coinflip_betlist .coinflip-game:not(.active)').first();
  $field.html(DIV).addClass('active');

  var last_game =
    $('#coinflip_betlist .coinflip-game.active').last().index() + 1;
  for (var i = 0; i < (last_game % 5 == 0) * 5; i++) {
    $('#coinflip_betlist').append(
      '<div class="coinflip-game bg-dark rounded-1 b-l2"></div>'
    );
  }
}

function coinflipGame_editCoinFlip(coinflip, status) {
  var DIV = coinflipGame_generateBet(coinflip, status);

  var $field = $(
    '#coinflip_betlist .coinflip-game .coinflip_betitem[data-id="' +
      coinflip.id +
      '"]'
  ).parent();
  $field.html(DIV);
}

function coinflipGame_generateBet(coinflip, status) {
  var DIV =
    '<div class="coinflip_betitem bg-light-transparent relative height-full width-full flex justify-between p-2" data-id="' +
    coinflip.id +
    '">';
  DIV += coinflipGame_generatePlayer(coinflip, status, 0);

  DIV += '<div class="flex justify-center items-center relative p-2">';
  if (status == 0) {
    DIV += '<div class="text-bold font-10">VS</div>';
  } else if (status == 1) {
    DIV +=
      '<div class="b-d2 bg-dark rounded-full flex justify-center items-center text-bold p-4 font-11">';
    DIV +=
      '<div class="absolute" id="coinflip_timer_' +
      coinflip.id +
      '">' +
      coinflip.data.time +
      '</div>';

    DIV += '<script>';
    DIV +=
      'var coinflip_timer_' + coinflip.id + ' = ' + coinflip.data.time + ';';

    DIV +=
      'if(coinflip_interval_' +
      coinflip.id +
      ') clearInterval(coinflip_interval_' +
      coinflip.id +
      ');';
    DIV +=
      'var coinflip_interval_' + coinflip.id + ' = setInterval(function(){';
    DIV += 'coinflip_timer_' + coinflip.id + '--;';

    DIV +=
      '$("#coinflip_timer_' +
      coinflip.id +
      '").text(coinflip_timer_' +
      coinflip.id +
      ');';

    DIV +=
      'if(coinflip_timer_' +
      coinflip.id +
      ' <= 0) clearInterval(coinflip_interval_' +
      coinflip.id +
      ');';
    DIV += '}, 1000);';
    DIV += '</script>';
    DIV += '</div>';
  } else if (status == 2) {
    DIV += '<div class="text-bold font-10">EOS</div>';
  } else if (status == 3) {
    DIV += '<div class="flex justify-center items-center relative">';
    DIV +=
      '<div class="coinflip-coin coinflip-coin-animation-' +
      coinflip.data.winner +
      '">';
    DIV += '<div class="front absolute top-0 bottom-0 left-0 right-0"></div>';
    DIV += '<div class="back absolute top-0 bottom-0 left-0 right-0"></div>';
    DIV += '</div>';
    DIV += '</div>';
  } else if (status == 4) {
    DIV += '<div class="flex justify-center items-center relative">';
    DIV += '<div class="coinflip-pick-' + coinflip.data.winner + '"></div>';
    DIV += '</div>';
  }

  DIV +=
    "<div class='coinflip-fair pointer absolute bottom-0 font-5 fair-results' data-fair='" +
    JSON.stringify({ game: coinflip.data.game, draw: null }) +
    "'>Provably fair</div>";
  DIV += '</div>';

  DIV += coinflipGame_generatePlayer(coinflip, status, 1);
  DIV += '</div>';

  return DIV;
}

function coinflipGame_generatePlayer(coinflip, status, position) {
  var class_player = '';
  if (status == 4)
    class_player = position != coinflip.data.winner ? 'active' : '';

  var DIV =
    '<div class="coinflip-player ' +
    class_player +
    ' width-5 height-full bg-dark rounded-1 p-1">';
  DIV += '<div class="flex column justify-between items-center height-full">';
  DIV +=
    '<div class="flex column items-center justify-center height-full width-full gap-2">';
  var joined = coinflip.players.filter((a) => a.user.userid == USER).length > 0;
  var creator =
    coinflip.players.filter((a) => a.user.userid == USER && a.creator).length >
    0;

  if (coinflip.players.filter((a) => a.position == position).length > 0) {
    var player = coinflip.players.find((a) => a.position == position);

    DIV += createAvatarField(
      player.user,
      'large',
      '<div class="level sop-large-left flex justify-center items-center b-d2 bg-dark rounded-full"><img src="' +
        ROOT +
        'template/img/coinflip/coin' +
        position +
        '.png"></div>',
      ''
    );

    DIV += '<div class="width-full ellipsis">' + player.user.name + '</div>';
  } else if (joined) {
    if (creator) {
      var data_gamebot = {
        id: coinflip.id,
      };

      DIV += '<div class="relative">';
      DIV +=
        '<button class="site-button purple width-full gamebots_show" data-game="coinflip" data-data="' +
        stringEscape(JSON.stringify(data_gamebot)) +
        '">Call a Bot</button>';
      DIV +=
        '<div class="sop-large-left flex justify-center items-center b-m2 bg-dark rounded-full"><img src="' +
        ROOT +
        'template/img/coinflip/coin' +
        position +
        '.png"></div>';
      DIV += '</div>';
    }
  } else {
    DIV += '<div class="relative">';
    DIV +=
      '<button class="site-button purple width-full" id="coinflip_join" data-id="' +
      coinflip.id +
      '">Join Game</button>';
    DIV +=
      '<div class="sop-large-left flex justify-center items-center b-m2 bg-dark rounded-full"><img src="' +
      ROOT +
      'template/img/coinflip/coin' +
      position +
      '.png"></div>';
    DIV += '</div>';
  }
  DIV += '</div>';

  DIV +=
    '<div class="bg-light rounded-1 b-l2 pl-2 pr-2 flex items-center justify-center">';
  DIV += '<div class="coins mr-1"></div>';
  DIV += '<span class="">' + getFormatAmountString(coinflip.amount) + '</span>';
  DIV += '</div>';
  DIV += '</div>';
  DIV += '</div>';

  return DIV;
}

function coinflipGame_getWinner(percentage) {
  var chanceSeparator = 50;

  if (parseFloat(percentage) <= chanceSeparator) return 1;
  else return 2;
}

$(document).ready(function () {
  $(document).on('click', '#coinflip_join', function () {
    $(this).addClass('disabled');

    var id = $(this).attr('data-id');

    send_request_socket({
      type: 'coinflip',
      command: 'join',
      id: id,
    });
  });

  $(document).on('click', '.coinflip-select', function () {
    $('.coinflip-select').removeClass('active');
    $(this).addClass('active');
  });

  $('#coinflip_create').click(function () {
    $(this).addClass('disabled');

    var amount = $('#betamount_coinflip').val();
    var position = parseInt($('.coinflip-select.active').attr('data-position'));

    send_request_socket({
      type: 'coinflip',
      command: 'create',
      amount: amount,
      position: position,
    });
  });
});

/* END COINFLIP */

/* UNBOXING */

var spinnerWidth_Unboxing = 0;
var lastSpinner_Unboxing = [];
var timeSpinner_Unboxing = [];
var viewSpinner_Unboxing = [];
var beginTimeSpinner_Unboxing = [];
var movingSpinner_Unboxing = false;
var durationSpinner_Unboxing = 8;

var partSpinnerWidth_Unboxing = 150;

$(document).ready(function () {
  $(document).on('click', '#unboxing_demo', function () {
    var id = $(this).attr('data-id');
    var amount = parseInt($('#unboxing_amount').val());

    $('#unboxing_demo').addClass('disabled');
    $('#unboxing_open').addClass('disabled');

    send_request_socket({
      type: 'unboxing',
      command: 'demo',
      id: PATHS[1],
      amount: amount,
    });
  });

  $(document).on('click', '#unboxing_open', function () {
    var id = $(this).attr('data-id');
    var amount = parseInt($('#unboxing_amount').val());

    $('#unboxing_demo').addClass('disabled');
    $('#unboxing_open').addClass('disabled');

    send_request_socket({
      type: 'unboxing',
      command: 'open',
      id: PATHS[1],
      amount: amount,
    });
  });

  $(document).on('change', '#unboxing_amount', function () {
    var amount = parseInt($(this).val());

    send_request_socket({
      type: 'unboxing',
      command: 'spinner',
      id: PATHS[1],
      amount: amount,
    });
  });

  $(window).resize(function () {
    initializingSpinner_Unboxing();
  });
});

function renderSpinner_Unboxing(index) {
  var time = new Date().getTime() - beginTimeSpinner_Unboxing[index];
  if (time > timeSpinner_Unboxing[index]) time = timeSpinner_Unboxing[index];

  var deg =
    (viewSpinner_Unboxing[index] *
      (Math.pow(0.99 + 0.001 * durationSpinner_Unboxing, time) - 1)) /
    Math.log(0.99 + 0.001 * durationSpinner_Unboxing);

  rotateSpinner_Unboxing(deg, index);

  if (time < timeSpinner_Unboxing[index]) {
    setTimeout(function () {
      renderSpinner_Unboxing(index);
    }, 1);
  } else {
    lastSpinner_Unboxing[index] = deg;
    movingSpinner_Unboxing = false;
  }
}

function rotateSpinner_Unboxing(offset, index) {
  if (offset > 0) offset = -(offset - spinnerWidth_Unboxing / 2);

  $(
    '#unboxing_case_spinner .unboxing-case[data-index="' +
      index +
      '"] .unboxing-spinner'
  ).css('transform', 'translate3d(' + offset + 'px, 0px, 0px)');
}

function initializingSpinner_Unboxing() {
  spinnerWidth_Unboxing = $('.unboxing-case').width();

  if (!movingSpinner_Unboxing) {
    for (var i = 0; i < $('#unboxing_case_spinner .unboxing-case').length; i++)
      rotateSpinner_Unboxing(lastSpinner_Unboxing[i], i);
  }
}

function startSpinner_Unboxing(index) {
  initializingSpinner_Unboxing();

  var distance = partSpinnerWidth_Unboxing * 99;
  distance += Math.floor(Math.random() * partSpinnerWidth_Unboxing);

  beginTimeSpinner_Unboxing[index] = new Date().getTime();
  viewSpinner_Unboxing[index] =
    0.01 - distance * Math.log(0.99 + 0.001 * durationSpinner_Unboxing);
  timeSpinner_Unboxing[index] =
    (Math.log(0.01) - Math.log(viewSpinner_Unboxing[index])) /
    Math.log(0.99 + 0.001 * durationSpinner_Unboxing);
  movingSpinner_Unboxing = true;

  renderSpinner_Unboxing(index);
}

function unboxingGame_openCase(spinner) {
  play_sound(audio_Unboxing_rolling);

  $('#unboxing_case_spinner .unboxing-case .unboxing-spinner').css(
    'transform',
    'translate3d(0px, 0px, 0px)'
  );

  $('#unboxing_case_spinner .unboxing-case .unboxing-field').empty();

  spinner.forEach(function (item, index) {
    $(
      '#unboxing_case_spinner .unboxing-case[data-index="' +
        index +
        '"] .unboxing-field'
    ).empty();

    item.forEach(function (a) {
      var ITEM = '<div class="reel-item flex justify-center items-center">';
      ITEM += unboxingGame_generateItem(a);
      ITEM += '</div>';

      $(
        '#unboxing_case_spinner .unboxing-case[data-index="' +
          index +
          '"] .unboxing-field'
      ).append(ITEM);
    });
  });

  lastSpinner_Unboxing = new Array(spinner.length).fill(0);
  timeSpinner_Unboxing = new Array(spinner.length).fill(0);
  viewSpinner_Unboxing = new Array(spinner.length).fill(0);
  beginTimeSpinner_Unboxing = new Array(spinner.length).fill(0);

  for (var i = 0; i < spinner.length; i++) startSpinner_Unboxing(i);
}

function unboxingGame_addCase(unboxing) {
  var DIV = '<a href="' + ROOT + 'unboxing/' + unboxing.id + '">';
  DIV += '<div class="case-item flex column gap-1">';
  DIV += '<div class="case-slot rounded-0">';
  DIV +=
    '<div class="case-image-content flex items-center justify-center p-2">';
  DIV +=
    '<img class="case-image transition-5" src="' +
    ROOT +
    'template/img/cases/' +
    unboxing.image +
    '">';
  DIV += '</div>';

  DIV +=
    '<div class="case-name-content text-left ellipsis">' +
    unboxing.name +
    '</div>';

  DIV +=
    '<div class="case-price text-left"><div class="coins mr-1"></div>' +
    getFormatAmountString(unboxing.price) +
    '</div>';
  DIV += '</div>';
  DIV += '</div>';
  DIV += '</a>';

  $('#unboxing_list_cases').append(DIV);
}

function unboxingGame_showCase(items, unboxing) {
  $('#unboxing_case_spinner .unboxing-case .unboxing-spinner').css(
    'transform',
    'translate3d(0px, 0px, 0px)'
  );

  $('#unboxing_name').text(unboxing.name);
  $('#unboxing_price').text(getFormatAmountString(unboxing.price));

  $('#unboxing_list').empty();
  items.forEach(function (item) {
    var ITEM = unboxingGame_generateItem(item);

    $('#unboxing_list').append(ITEM);
  });
}

function unboxingGame_showSpinner(spinner) {
  $('#unboxing_case_spinner').empty();

  spinner.forEach(function (item, index) {
    var DIV =
      '<div class="unboxing-case relative mt-2 transition-5" data-index="' +
      index +
      '">';
    DIV += '<div class="unboxing-spinner group-reel flex">';
    DIV += '<div class="unboxing-field flex row">';
    item.forEach(function (a) {
      DIV += '<div class="reel-item flex justify-center items-center">';
      DIV += unboxingGame_generateItem(a);
      DIV += '</div>';
    });
    DIV += '</div>';
    DIV += '</div>';

    DIV += '<div class="shadow shadow-left"></div>';
    DIV += '<div class="shadow shadow-right"></div>';

    DIV +=
      '<div class="absolute top-0 bottom-0 left-0 right-0 flex justify-center">';
    DIV += '<div class="pointer flex items-center"></div>';
    DIV += '</div>';
    DIV += '</div>';

    $('#unboxing_case_spinner').append(DIV);
  });
}

function unboxingGame_generateItem(item) {
  var name = getInfosByItemName(item.name);

  var ITEM = '<div class="listing-item flex column">';
  ITEM +=
    '<div class="listing-slot rounded-0" style="border-bottom: solid 3px ' +
    item.color +
    ' !important;">';
  if (name.exterior != null)
    ITEM += '<div class="item-quality text-left">' + name.exterior + '</div>';

  ITEM +=
    '<div class="item-chance text-right">' +
    roundedToFixed(item.chance, 2).toFixed(2) +
    '%</div>';

  ITEM +=
    '<div class="item-image-content flex items-center justify-center p-2">';
  ITEM += '<img class="item-image transition-5" src="' + item.image + '">';
  ITEM += '</div>';

  ITEM += '<div class="item-name-content text-left">';
  if (name.brand != null)
    ITEM += '<div class="item-brand ellipsis">' + name.brand + '</div>';
  if (name.name != null)
    ITEM += '<div class="item-name ellipsis">' + name.name + '</div>';
  ITEM += '</div>';

  ITEM +=
    '<div class="item-price text-left"><div class="coins mr-1"></div>' +
    getFormatAmountString(item.price) +
    '</div>';

  if (item.tickets !== undefined)
    ITEM +=
      '<div class="item-tickets text-right">' +
      item.tickets.min +
      ' - ' +
      item.tickets.max +
      '</div>';
  ITEM += '</div>';
  ITEM += '</div>';

  return ITEM;
}

function unboxingGame_addHistory(history) {
  $('#unboxing_history .history_message').remove();

  var name = getInfosByItemName(history.winning.name);

  var DIV =
    '<div class="history-container medium success rounded-1 p-5 fade_center" style="border: 2px solid ' +
    history.winning.color +
    '80; background: linear-gradient(to top, ' +
    history.winning.color +
    '80 0%, var(--site-color-bg-dark-transparent) 100%);">';
  DIV +=
    '<a href="' +
    ROOT +
    'unboxing/' +
    history.unboxing.id +
    '" target="_blank">';
  DIV +=
    '<div class="history-content unboxing flex justify-center items-center">';
  DIV += '<div class="unboxing transition-5">';
  DIV += '<img class="image" src="' + history.winning.image + '">';

  if (name.exterior != null)
    DIV +=
      '<div class="exterior text-bold text-left pl-1">' +
      name.exterior +
      '</div>';
  DIV +=
    '<div class="chance text-bold text-right pr-1">' +
    parseFloat(history.winning.chance).toFixed(2) +
    '%</div>';
  DIV +=
    '<div class="chance text-bold text-left pr-2">' +
    history.user.name +
    '</div>';

  DIV += '<div class="name text-left pl-1">';
  if (name.brand != null)
    DIV += '<div class="text-bold">' + name.brand + '</div>';
  if (name.name != null) DIV += '<div>' + name.name + '</div>';
  DIV += '</div>';

  DIV +=
    '<div class="price text-right pr-1"><div class="coins-mini mr-1"></div>' +
    getFormatAmountString(history.winning.price) +
    '</div>';
  DIV += '</div>';

  DIV += '<div class="case transition-5">';
  DIV +=
    '<img class="image" src="' +
    ROOT +
    'template/img/cases/' +
    history.unboxing.image +
    '?v=' +
    time() +
    '">';

  DIV += '<div class="name text-bold">' + history.unboxing.name + '</div>';

  DIV +=
    '<div class="price"><div class="coins mr-1"></div>' +
    getFormatAmountString(history.unboxing.price) +
    '</div>';

  DIV +=
    '<div class="absolute top-0 bottom-0 left-0 right-0 p-1 flex items-center justify-center height-full gap-1">';
  DIV += createAvatarField(history.user, 'medium', '', '');
  DIV += '<div class="text-left ellipsis">' + history.user.name + '</div>';
  DIV += '</div>';
  DIV += '</div>';
  DIV += '</div>';
  DIV += '</a>';
  DIV += '</div>';

  $('#unboxing_history').prepend(DIV);

  while ($('#unboxing_history .history-container').length > 20)
    $('#unboxing_history .history-container').last().remove();
}

/* END UNBOXING */

/* CASE BATTLE */

var spinnerHeight_CaseBattle = 0;
var lastSpinner_CaseBattle = 0;
var timeSpinner_CaseBattle = 0;
var viewSpinner_CaseBattle = 0;
var beginTimeSpinner_CaseBattle = 0;
var movingSpinner_CaseBattle = false;
var durationSpinner_CaseBattle = 8;

var partSpinnerHeight_CaseBattle = 120;

var caseBattleGame_emojiTimeouts = {};

$(document).ready(function () {
  $(document).on('click', '#casebattle_create_confirm', function () {
    var mode = parseInt($('.casebattle_set_mode.active').attr('data-mode'));
    var privacy = $('#casebattle_set_privacy').is(':checked') ? 1 : 0;
    var free = $('#casebattle_set_free').is(':checked') ? 1 : 0;
    var crazy = $('#casebattle_set_crazy').is(':checked') ? 1 : 0;

    var cases = [];

    $('#casebattle_create_list .casebattle_item').each(function (i, e) {
      for (var i = 0; i < parseInt($(this).attr('data-count')); i++)
        cases.push(
          JSON.parse($(this).attr('data-item').replaceAll("'", '"')).id
        );
    });

    send_request_socket({
      type: 'casebattle',
      command: 'create',
      cases: cases,
      mode: mode,
      privacy: privacy,
      free: free,
      crazy: crazy,
    });
  });

  $(document).on('click', '#casebattle_create_same', function () {
    var data = JSON.parse($(this).attr('data-battle'));

    var mode = parseInt(data.mode);
    var privacy = parseInt(data.privacy);
    var free = parseInt(data.free);
    var crazy = parseInt(data.crazy);

    var cases = data.cases;

    send_request_socket({
      type: 'casebattle',
      command: 'create',
      cases: cases,
      mode: mode,
      privacy: privacy,
      free: free,
      crazy: crazy,
    });
  });

  $(document).on('click', '.casebattle_join', function () {
    var id = $(this).attr('data-id');
    var position = parseInt($(this).attr('data-position'));

    send_request_socket({
      type: 'casebattle',
      command: 'join',
      id: id,
      position: position,
    });
  });

  $(document).on('click', '.casebattle_leave', function () {
    var id = $(this).attr('data-id');
    var position = parseInt($(this).attr('data-position'));

    send_request_socket({
      type: 'casebattle',
      command: 'leave',
      id: id,
      position: position,
    });
  });

  $(document).on('click', '.casebattle_set_mode', function () {
    $('.casebattle_set_mode').removeClass('active');
    $(this).addClass('active');

    caseBattleGame_updateCreate();
  });

  $('#casebattle_set_free').on('change', function () {
    caseBattleGame_updateCreate();
  });

  $(document).on('click', '.casebattle-add', function () {
    $('#casebattle_add_total').text('0.00');

    send_request_socket({
      type: 'casebattle',
      command: 'cases',
    });

    $('#casebattle_add_list').html(createLoader());
    $('#modal_casebattle_add').modal('show');
  });

  $(document).on(
    'click',
    '#casebattle_add_list .casebattle_add_more',
    function () {
      var more = parseInt($(this).attr('data-count'));
      var count = parseInt($(this).parent().parent().attr('data-count'));

      var have = 0;
      $('#casebattle_add_list .casebattle_item').each(function (i, e) {
        have += parseInt($(this).attr('data-count'));
      });

      var others = have - count;

      count += more;

      if (count < 0) count = 0;
      if (others + count > 20) count = 20 - others;

      $(this).parent().parent().attr('data-count', count);

      if (count > 0) $(this).parent().parent().addClass('active');
      else $(this).parent().parent().removeClass('active');

      $(this).parent().parent().find('.casebattle_add_count').text(count);

      caseBattleGame_updateAdd();
    }
  );

  $(document).on(
    'click',
    '#casebattle_create_list .casebattle_add_more',
    function () {
      var more = parseInt($(this).attr('data-count'));
      var count = parseInt($(this).parent().parent().attr('data-count'));

      var have = 0;
      $('#casebattle_create_list .casebattle_item').each(function (i, e) {
        have += parseInt($(this).attr('data-count'));
      });

      var others = have - count;

      count += more;

      if (count < 0) count = 0;
      if (others + count > 20) count = 20 - others;

      $(this).parent().parent().attr('data-count', count);

      $(this).parent().parent().find('.casebattle_add_count').text(count);
      if (count <= 0 && $(this).parent().parent().has('.no-selectable'))
        $(this).parent().parent().remove();

      caseBattleGame_updateCreate();
    }
  );

  $(document).on('click', '#casebattle_add_confirm', function () {
    var list = [];

    $('#casebattle_add_list .casebattle_item').each(function (i, e) {
      if (parseInt($(this).attr('data-count')) > 0) {
        list.push({
          item: JSON.parse($(this).attr('data-item').replaceAll("'", '"')),
          data: {
            count: parseInt($(this).attr('data-count')),
          },
        });
      }
    });

    $('#casebattle_create_list').empty();

    list.forEach(function (item) {
      $('#casebattle_create_list').append(
        caseBattleGame_generateCase(item.item, item.data, '')
      );
    });

    var DIV = '<div class="case-item flex column gap-1">';
    DIV += '<div class="case-slot rounded-0">';
    DIV +=
      '<div class="flex justify-center items-center height-full width-full">';
    DIV +=
      '<button class="site-button purple casebattle-add">Add Cases</button>';
    DIV += '</div>';
    DIV += '</div>';
    DIV += '</div>';

    $('#casebattle_create_list').append(DIV);

    caseBattleGame_updateCreate();

    $('#modal_casebattle_add').modal('hide');
  });

  $('#casebattle_order').on('change', function () {
    caseBattleGame_filterOrder();
  });

  $('#casebattle_players').on('change', function () {
    caseBattleGame_filterHide();
    caseBattleGame_filterOrder();
  });

  var timeout_casebattle = null;
  $('#casebattle_search').on('input', function () {
    if (timeout_casebattle) clearTimeout(timeout_casebattle);

    timeout_casebattle = setTimeout(function () {
      caseBattleGame_filterHide();
      caseBattleGame_filterOrder();
    }, 1000);
  });

  $('#casebattle_add_order').on('change', function () {
    var type = $(this).val();
    if (type == 0) {
      tinysort('#casebattle_add_list .casebattle_item', {
        data: 'name',
        order: 'asc',
      });
    } else if (type == 1) {
      tinysort('#casebattle_add_list .casebattle_item', {
        data: 'name',
        order: 'desc',
      });
    } else if (type == 2) {
      tinysort('#casebattle_add_list .casebattle_item', {
        data: 'price',
        order: 'asc',
      });
    } else if (type == 3) {
      tinysort('#casebattle_add_list .casebattle_item', {
        data: 'price',
        order: 'desc',
      });
    }
  });

  var timeout_casebattle_add = null;
  $('#casebattle_add_search').on('input', function () {
    var search = $(this).val().toLowerCase();

    if (timeout_casebattle_add) clearTimeout(timeout_casebattle_add);

    timeout_casebattle_add = setTimeout(function () {
      $('#casebattle_add_list .history_message').remove();

      $('#casebattle_add_list .casebattle_item')
        .addClass('hidden')
        .filter(function (i, e) {
          var name = $(this).data('name');

          if (name.toLowerCase().indexOf(search) >= 0) return true;
        })
        .removeClass('hidden');

      if ($('#casebattle_add_list .casebattle_item:not(.hidden)').length <= 0)
        $('#casebattle_add_list').append(
          '<div class="in-grid flex justify-center items-center font-8 p-4 history_message">No cases found</div></div>'
        );
    }, 1000);
  });

  $(document).on(
    'mouseover',
    '.casebattle_rounditem.joined .casebattle-container',
    function () {
      var $DIV = $(this);

      $DIV.find('.casebattle-emojis').addClass('active');
      $DIV.find('.casebattle-emojis-list').addClass('active');

      setTimeout(function () {
        $DIV.find('.casebattle-emojis').css('opacity', 1);
      }, 10);
    }
  );

  $(document).on(
    'mouseleave',
    '.casebattle_rounditem.joined .casebattle-container',
    function () {
      var $DIV = $(this);

      if (
        $DIV
          .closest('.casebattle-container')
          .find('.casebattle-emojis-arena.active').length <= 0
      ) {
        $DIV.find('.casebattle-emojis').css('opacity', 0);

        setTimeout(function () {
          $DIV.find('.casebattle-emojis').removeClass('active');
        }, 200);
      }

      setTimeout(function () {
        $DIV.find('.casebattle-emojis-list').removeClass('active');
      }, 200);
    }
  );

  $(document).on(
    'click',
    '.casebattle-emojis-list .casebattle-emoji',
    function () {
      var id = $(this).attr('data-id');
      var position = parseInt($(this).attr('data-position'));
      var emoji = parseInt($(this).attr('data-emoji'));

      send_request_socket({
        type: 'casebattle',
        command: 'emoji',
        id: id,
        position: position,
        emoji: emoji,
      });

      $(this)
        .closest('.casebattle-emojis')
        .find('.casebattle-emojis-arena')
        .addClass('active');
    }
  );
});

function renderSpinner_CaseBattle() {
  var time = new Date().getTime() - beginTimeSpinner_CaseBattle;
  if (time > timeSpinner_CaseBattle) time = timeSpinner_CaseBattle;

  var deg =
    (viewSpinner_CaseBattle *
      (Math.pow(0.99 + 0.001 * durationSpinner_CaseBattle, time) - 1)) /
    Math.log(0.99 + 0.001 * durationSpinner_CaseBattle);

  rotateSpinner_CaseBattle(deg);

  if (time < timeSpinner_CaseBattle) {
    setTimeout(function () {
      renderSpinner_CaseBattle();
    }, 1);
  } else {
    lastSpinner_CaseBattle = deg;
    movingSpinner_CaseBattle = false;
  }
}

function rotateSpinner_CaseBattle(offset) {
  if (offset > 0)
    offset = -(
      offset -
      (spinnerHeight_CaseBattle - partSpinnerHeight_CaseBattle) / 2
    );

  $('.casebattle-reel').css(
    'transform',
    'translate3d(0px, ' + offset + 'px, 0px)'
  );
}

function initializingSpinner_CaseBattle() {
  spinnerHeight_CaseBattle = $('.casebattle-case').height();

  if (!movingSpinner_CaseBattle)
    rotateSpinner_CaseBattle(lastSpinner_CaseBattle);
}

function startSpinner_CaseBattle() {
  initializingSpinner_CaseBattle();

  var distance = partSpinnerHeight_CaseBattle * 99;

  beginTimeSpinner_CaseBattle = new Date().getTime();
  viewSpinner_CaseBattle =
    0.01 - distance * Math.log(0.99 + 0.001 * durationSpinner_CaseBattle);
  timeSpinner_CaseBattle =
    (Math.log(0.01) - Math.log(viewSpinner_CaseBattle)) /
    Math.log(0.99 + 0.001 * durationSpinner_CaseBattle);
  movingSpinner_CaseBattle = true;

  renderSpinner_CaseBattle();
}

function caseBattleGame_filterOrder() {
  var value = $('#casebattle_order').val();

  if (value == 0) {
    tinysort('#casebattle_betlist .casebattle_betitem', {
      data: 'time',
      order: 'desc',
    });
  } else if (value == 1) {
    tinysort('#casebattle_betlist .casebattle_betitem', {
      data: 'amount',
      order: 'asc',
    });
  } else if (value == 2) {
    tinysort('#casebattle_betlist .casebattle_betitem', {
      data: 'amount',
      order: 'desc',
    });
  }
}

function caseBattleGame_filterHide() {
  $('#casebattle_betlist .history_message').remove();

  $('#casebattle_betlist>.casebattle_betitem')
    .addClass('hidden')
    .filter(function (i, e) {
      var data_cases = JSON.parse(
        $(this).attr('data-cases').replaceAll("'", '"')
      );
      var data_players = parseInt($(this).attr('data-players'));

      var search = $('#casebattle_search').val().toLowerCase();
      var players = parseInt($('#casebattle_players').val());

      if (
        (data_players == players || players == 0) &&
        data_cases.filter((a) => a.toLowerCase().indexOf(search) >= 0).length >
          0
      )
        return true;
    })
    .removeClass('hidden');

  if ($('#casebattle_betlist .casebattle_betitem:not(.hidden)').length <= 0)
    $('#casebattle_betlist').append(
      '<div class="in-grid bg-light flex justify-center items-center font-8 p-4 history_message">No active case battles</div>'
    );
}

function caseBattleGame_updateCreate() {
  var count = 0;
  var total = 0;

  $('#casebattle_create_list .casebattle_item').each(function (i, e) {
    count += parseInt($(this).attr('data-count'));
    total += getFormatAmount(
      getFormatAmount($(this).data('price')) *
        parseInt($(this).attr('data-count'))
    );
  });

  var free = $('#casebattle_set_free').is(':checked') ? 1 : 0;
  var mode = parseInt($('.casebattle_set_mode.active').attr('data-mode'));

  var players = [2, 3, 4, 4][mode];

  $('#casebattle_create_total').countToFloat(
    free ? getFormatAmount(total * players) : total
  );

  var cashback = 1;

  $('#casebattle_create_cashback').countToFloat(
    free ? 0 : getFormatAmount((total * cashback) / 100)
  );
}

function caseBattleGame_updateAdd() {
  var count = 0;
  var total = 0;

  $('#casebattle_add_list .casebattle_item').each(function (i, e) {
    count++;
    total += getFormatAmount(
      getFormatAmount($(this).data('price')) *
        parseInt($(this).attr('data-count'))
    );
  });

  $('#casebattle_add_total').countToFloat(total);
}

function caseBattleGame_generateCase(item, data, classes) {
  var DIV =
    '<div class="case-item casebattle_item flex column gap-1 ' +
    classes +
    '" data-id="' +
    item.id +
    '" data-count="' +
    data.count +
    '" data-name="' +
    item.name +
    '" data-price="' +
    getFormatAmountString(item.price) +
    '" data-item="' +
    JSON.stringify(item).replaceAll("'", '').replaceAll('"', "'") +
    '">';
  DIV += '<div class="case-slot rounded-0">';
  DIV +=
    '<div class="case-image-content flex items-center justify-center p-2">';
  DIV += '<img class="case-image transition-5" src="' + item.image + '">';
  DIV += '</div>';

  DIV +=
    '<div class="case-name-content text-left ellipsis">' + item.name + '</div>';

  DIV +=
    '<div class="case-price text-left"><div class="coins mr-1"></div>' +
    getFormatAmountString(item.price) +
    '</div>';
  DIV += '</div>';

  DIV +=
    '<div class="bg-light-transparent rounded-1 flex row justify-between items-center gap-2 p-2">';
  DIV +=
    '<button class="site-button black casebattle_add_more" data-count="-1"><i class="fa fa-minus" aria-hidden="true"></i></button>';

  DIV +=
    '<div class="font-8 text-bold casebattle_add_count">' +
    data.count +
    '</div>';

  DIV +=
    '<button class="site-button black casebattle_add_more" data-count="1"><i class="fa fa-plus" aria-hidden="true"></i></button>';
  DIV += '</div>';
  DIV += '</div>';

  return DIV;
}

function caseBattleGame_addCaseBattle(casebattle) {
  $('#casebattle_betlist .history_message').remove();

  var DIV = caseBattleGame_generateBet(casebattle, 0);

  $('#casebattle_betlist').prepend(DIV);

  $(
    '#casebattle_betlist .casebattle_betitem[data-id="' + casebattle.id + '"]'
  ).addClass('fade_center');
}

function caseBattleGame_editCaseBattle(casebattle, status, first) {
  var DIV = caseBattleGame_generateBet(casebattle, status);

  $(
    '#casebattle_betlist .casebattle_betitem[data-id="' + casebattle.id + '"]'
  ).replaceWith(DIV);

  setTimeout(function () {
    if (status == 4)
      $(
        '#casebattle_betlist .casebattle_betitem[data-id="' +
          casebattle.id +
          '"] .casebattle-roundslist'
      ).css('transform', 'translateX(-' + casebattle.data.round * 55 + 'px)');
    else if (status == 6)
      $(
        '#casebattle_betlist .casebattle_betitem[data-id="' +
          casebattle.id +
          '"] .casebattle-roundslist'
      ).css('transform', 'translateX(0px)');
  }, 200);

  if (first)
    $(
      '#casebattle_betlist .casebattle_betitem[data-id="' + casebattle.id + '"]'
    ).addClass('fade_center');
}

function caseBattleGame_openCase() {
  if ($('.casebattle-reel .reel').length <= 0) return;

  $('.casebattle-reel').css(
    'transform',
    'translate3d(0px, -' +
      (partSpinnerHeight_CaseBattle -
        ($('.casebattle-case').height() - partSpinnerHeight_CaseBattle) / 2) +
      'px, 0px)'
  );

  setTimeout(function () {
    play_sound(audio_casebattle_rolling);

    startSpinner_CaseBattle();
  }, 1000);
}

function caseBattleGame_generateBet(casebattle, status) {
  var total_players = [2, 3, 4, 4][casebattle.mode];

  var DIV =
    '<div class="casebattle_betitem bg-light flex justify-center items-center row responsive gap-2 relative" data-id="' +
    casebattle.id +
    '" data-cases="' +
    JSON.stringify(
      casebattle.cases
        .map((a) => a.name)
        .filter(function (value, index, array) {
          return array.indexOf(value) === index;
        })
    )
      .replaceAll("'", '')
      .replaceAll('"', "'") +
    '" data-players="' +
    total_players +
    '" data-amount="' +
    casebattle.amount +
    '" data-time="' +
    casebattle.time +
    '">';
  var classes = '';
  if (status > 0) {
    var joined =
      casebattle.players.filter((a) => a.user.userid == USER).length > 0;

    if (status == 6 && joined) {
      var player = casebattle.players.find((a) =>
        casebattle.data.winners.includes(a.position)
      );

      if (player.user.userid == USER) classes = 'success';
      else classes = 'danger';
    } else classes = 'active';
  }

  DIV +=
    '<div class="casebattle-round rounded-full flex justify-center items-center text-bold ' +
    classes +
    '">' +
    casebattle.cases.length +
    '</div>';

  DIV += '<div class="width-2 responsive pr-4 pl-4">';
  DIV += '<div class="flex row gap-4 justify-center items-center">';
  DIV += '<div class="flex row gap-2">';
  var players = [];

  for (var i = 0; i < total_players; i++) {
    players.push(
      '<div class="avatar icon-small bd-1 bg-dark rounded-full"></div>'
    );
  }

  casebattle.players.forEach(function (item) {
    var glowing = '';
    if (status == 6) {
      if (casebattle.data.winners.includes(item.position)) glowing = 'glowing';
    }

    players[item.position] = createAvatarField(item.user, 'small', '', glowing);
  });

  if (casebattle.mode == 3) {
    for (var i = 0; i < 2; i++) {
      DIV += '<div class="flex row gap-2 p-1 b-m1 rounded-5">';
      DIV += players[i * 2];
      DIV += players[i * 2 + 1];
      DIV += '</div>';
    }
  } else DIV += players.join('');
  DIV += '</div>';

  DIV +=
    '<div class="font-6 text-bold text-space-2"><span class="text-success">' +
    casebattle.players.length +
    '</span>/' +
    total_players +
    '</div>';
  DIV += '</div>';
  DIV += '</div>';

  DIV += '<div class="width-7 responsive bg-dark overflow-h">';
  var translate = 0;
  if (status == 4) translate = Math.max(0, casebattle.data.round - 1) * 55;
  else if (status == 6) translate = (casebattle.cases.length - 1) * 55;

  DIV +=
    '<div class="casebattle-roundslist flex row gap-1 rounded-0 p-1 transition-2" style="transform: translateX(-' +
    translate +
    'px)">';
  casebattle.cases.forEach(function (item, i) {
    var active = '';
    if (status == 4) {
      if (i == casebattle.data.round) active = 'active';
    }

    DIV +=
      '<div class="casebattle-icon small bg-light rounded-0 p-1 bl-1 flex justify-center items-center ' +
      active +
      '" title="' +
      item.name +
      '"><img src="' +
      ROOT +
      'template/img/cases/' +
      item.image +
      '"></div>';
  });
  DIV += '</div>';
  DIV += '</div>';

  if (casebattle.free)
    DIV +=
      '<div class="font-6 text-bold text-space-1 width-1 responsive flex justify-center items-center p-1 text-success">FREE</div>';
  else
    DIV +=
      '<div class="font-6 text-bold text-space-1 width-1 responsive flex justify-center items-center p-1">$' +
      getFormatAmountString(casebattle.amount) +
      '</div>';

  DIV += '<div class="width-2 responsive pr-4 pl-4 pt-2 pb-2">';
  if (status == 0)
    DIV +=
      '<a href="' +
      ROOT +
      'casebattle/' +
      casebattle.id +
      '"><button class="site-button ' +
      (casebattle.crazy ? 'pink' : 'purple') +
      ' width-full height-full">Join the ' +
      (casebattle.crazy ? 'crazy' : 'classic') +
      ' battle</button></a>';
  else
    DIV +=
      '<a href="' +
      ROOT +
      'casebattle/' +
      casebattle.id +
      '"><button class="site-button black width-full height-full">View the ' +
      (casebattle.crazy ? 'crazy' : 'classic') +
      ' battle</button></a>';
  DIV += '</div>';
  DIV += '</div>';

  return DIV;
}

function caseBattleGame_generateShow(casebattle, status, position, first) {
  var joined =
    casebattle.players.filter(
      (a) => a.position == position && a.user.userid == USER
    ).length > 0
      ? 'joined'
      : '';

  var DIV =
    '<div class="casebattle_rounditem ' +
    joined +
    ' flex column gap-2 width-full" data-position="' +
    position +
    '">';
  DIV += '<div class="casebattle-container relative overflow-h">';
  DIV += caseBattleGame_generateShowCase(casebattle, status, position, first);

  DIV += '<div class="casebattle-emojis transition-2 width-full">';
  var emojis = [
    'heart_eyes.png',
    'innocent.png',
    'rage.png',
    'sob.png',
    'joy.png',
  ];

  DIV += '<div class="casebattle-emojis-arena"></div>';

  DIV += '<div class="casebattle-emojis-list flex row">';
  emojis.forEach(function (item, i) {
    DIV +=
      '<div class="casebattle-emoji width-full height-full p-2 rounded-full" data-id="' +
      casebattle.id +
      '" data-position="' +
      position +
      '" data-emoji="' +
      i +
      '"><img class="height-full" src="https://crazycargo.gg/template/img/emojis/' +
      item +
      '"></div>';
  });
  DIV += '</div>';
  DIV += '</div>';
  DIV += '</div>';

  DIV += caseBattleGame_generateShowUser(casebattle, status, position);
  DIV += '</div>';

  return DIV;
}

function caseBattleGame_generateShowCase(casebattle, status, position, first) {
  var DIV = '<div class="casebattle-case relative width-full height-full">';
  DIV +=
    '<div class="bg-light rounded-0 relative width-full height-full overflow-h">';
  DIV += '<div class="shadow vertically shadow-top"></div>';
  DIV += '<div class="shadow vertically shadow-bottom"></div>';

  if (status == 0) {
    var joined =
      casebattle.players.filter((a) => a.user.userid == USER).length > 0;
    var creator =
      casebattle.players.filter((a) => a.user.userid == USER && a.creator)
        .length > 0;

    if (casebattle.players.filter((a) => a.position == position).length > 0) {
      var player = casebattle.players.find((a) => a.position == position);

      if (player.user.userid == USER) {
        DIV +=
          '<div class="flex column items-center justify-center gap-2 height-full">';
        DIV +=
          '<div class="text-bold text-success text-space-1">READY TO BATTLE</div>';

        DIV +=
          '<button class="site-button purple casebattle_leave" data-id="' +
          casebattle.id +
          '" data-position="' +
          position +
          '">Leave The Battle</button>';
        DIV += '</div>';
      } else {
        DIV +=
          '<div class="flex column items-center justify-center gap-2 height-full">';
        DIV +=
          '<div class="text-bold text-success text-space-1">READY TO BATTLE</div>';
        DIV += '</div>';
      }
    } else if (joined) {
      if (creator) {
        var data_gamebot = {
          id: casebattle.id,
          position: position,
        };

        DIV +=
          '<div class="flex column items-center justify-center gap-2 height-full">';
        DIV += '<div class="text-bold text-space-1">WAITING FOR PLAYERS</div>';

        DIV +=
          '<button class="site-button purple gamebots_show" data-game="casebattle" data-data="' +
          stringEscape(JSON.stringify(data_gamebot)) +
          '">Call a Bot</button>';
        DIV += '</div>';
      } else {
        DIV +=
          '<div class="flex column items-center justify-center gap-2 height-full">';
        DIV += '<div class="text-bold text-space-1">WAITING FOR PLAYERS</div>';
        DIV += '</div>';
      }
    } else {
      DIV +=
        '<div class="flex column items-center justify-center gap-2 height-full">';
      DIV += '<div class="text-bold text-space-1">ARE YOU READY TO PLAY</div>';

      DIV +=
        '<button class="site-button purple casebattle_join" data-id="' +
        casebattle.id +
        '" data-position="' +
        position +
        '">Join The Battle</button>';
      DIV += '</div>';
    }
  } else if (status == 1) {
    DIV +=
      '<div class="flex column items-center justify-center gap-2 height-full">';
    DIV +=
      '<div class="text-bold text-success text-space-1">READY TO BATTLE</div>';
    DIV += '</div>';
  } else if (status == 2) {
    DIV +=
      '<div class="flex column items-center justify-center gap-2 height-full">';
    DIV += '<div class="eospicture"></div>';
    DIV += '</div>';
  } else if (status == 3) {
    DIV +=
      '<div class="flex column items-center justify-center gap-2 height-full">';
    DIV +=
      '<div class="text-bold text-success text-space-1 font-20" id="casebattle_timer_' +
      casebattle.id +
      '_' +
      position +
      '">' +
      casebattle.data.countdown +
      '</div>';

    DIV += '<script>';
    DIV +=
      'var casebattle_timer_' +
      casebattle.id +
      '_' +
      position +
      ' = ' +
      casebattle.data.countdown +
      ';';

    DIV +=
      'if(casebattle_interval_' +
      casebattle.id +
      '_' +
      position +
      ') clearInterval(casebattle_interval_' +
      casebattle.id +
      '_' +
      position +
      ');';
    DIV +=
      'var casebattle_interval_' +
      casebattle.id +
      '_' +
      position +
      ' = setInterval(function(){';
    DIV += 'casebattle_timer_' + casebattle.id + '_' + position + '--;';

    DIV +=
      '$("#casebattle_timer_' +
      casebattle.id +
      '_' +
      position +
      '").text(casebattle_timer_' +
      casebattle.id +
      '_' +
      position +
      ');';

    DIV +=
      'if(casebattle_timer_' +
      casebattle.id +
      '_' +
      position +
      ' <= 0) clearInterval(casebattle_interval_' +
      casebattle.id +
      '_' +
      position +
      ');';
    DIV += '}, 1000);';
    DIV += '</script>';
    DIV += '</div>';
  } else if (status == 4) {
    DIV += '<div class="casebattle-reel flex column height-full">';
    if (first) DIV += createLoader();
    else {
      casebattle.data.spinner.forEach(function (item, i) {
        DIV +=
          '<div class="casebattle-icon rounded-0 reel flex justify-center items-center pl-2 pr-2 listing-slot" + data-id="' +
          i +
          '"><img src="' +
          item.image +
          '"></div>';
      });
    }
    DIV += '</div>';
  } else if (status == 5) {
    DIV +=
      '<div class="flex column items-center justify-center gap-2 height-full">';
    if (casebattle.data.winners.includes(position))
      DIV += '<div class="text-bold text-space-1">DRAW</div>';
    else DIV += '<div class="text-bold text-danger text-space-1">LOSER</div>';
    DIV += '</div>';
  } else if (status == 6) {
    DIV +=
      '<div class="flex column items-center justify-center gap-2 height-full">';
    if (casebattle.data.winners.includes(position)) {
      var total = casebattle.players.reduce(function (acc, val) {
        return acc + val.total;
      }, 0);

      var winnings = total;
      if (casebattle.mode == 3) {
        winnings = [
          getFormatAmount(total / 2),
          getFormatAmount(total - getFormatAmount(total / 2)),
        ][position % 2];
      }

      DIV +=
        '<div class="flex column gap-2 text-bold text-success text-space-1"><div>WINNER</div><div>TOTAL WIN <img style="height: 25px;" src="https://crazycargo.gg/template/img/coins.webp">' +
        getFormatAmountString(winnings) +
        '</div></div>';
    } else DIV += '<div class="text-bold text-danger text-space-1">LOSER</div>';
    DIV += '</div>';
  }
  DIV += '</div>';
  DIV += '</div>';

  return DIV;
}

function caseBattleGame_generateShowUser(casebattle, status, position) {
  var DIV =
    '<div class="casebattle-user flex row justify-between items-center gap-2 ' +
    (casebattle.mode == 3 ? 'bg-light b-b2 p-2 rounded-1' : '') +
    '">';
  if (casebattle.players.filter((a) => a.position == position).length > 0) {
    var player = casebattle.players.find((a) => a.position == position);

    DIV += '<div class="flex items-center gap-1">';
    DIV += createAvatarField(player.user, 'small', '', '');
    DIV +=
      '<div class="text-left width-full ellipsis">' +
      player.user.name +
      '</div>';
    DIV += '</div>';

    var best = '';
    if (status == 6 && casebattle.data.winners !== undefined) {
      if (casebattle.data.winners.includes(position)) best = 'text-success';
    } else if (
      player.items.length > 0 &&
      casebattle.data.positions !== undefined
    ) {
      if (casebattle.data.positions.includes(position)) best = 'text-success';
    }

    DIV +=
      '<div class="text-bold ' +
      best +
      '"><div class="coins mr-1"></div><span class="casebattle-total">' +
      getFormatAmountString(player.total) +
      '</span></div>';
  } else {
    DIV += '<div class="flex items-center gap-1">';
    DIV += '<div class="avatar-field rounded-full tier-steel relative">';
    DIV +=
      '<img class="avatar icon-small rounded-full" src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg">';
    DIV += '</div>';

    DIV += '<div class="text-left width-full ellipsis">None</div>';
    DIV += '</div>';

    DIV +=
      '<div class="text-bold"><div class="coins mr-1"></div><span class="casebattle-total">0.00</span></div>';
  }
  DIV += '</div>';

  return DIV;
}

function caseBattleGame_generateItems(casebattle, position) {
  var DIV = '<div class="casebattle-drops" data-position="' + position + '">';
  var winnings = 0;

  if (casebattle.players.filter((a) => a.position == position).length > 0) {
    var player = casebattle.players.find((a) => a.position == position);
    player.items.reverse();

    player.items.forEach(function (item, i) {
      DIV += caseBattleGame_generateItem(item);

      winnings++;
    });
  }

  for (var i = 0; i < casebattle.cases.length - winnings; i++)
    DIV +=
      '<div class="listing-item flex column"><div class="bg-light-transparent height-full width-full rounded-0"></div></div>';
  DIV += '</div>';

  return DIV;
}

function caseBattleGame_generateItem(item) {
  var name = getInfosByItemName(item.name);

  var ITEM = '<div class="listing-item flex column">';
  ITEM +=
    '<div class="listing-slot rounded-0" style="border-bottom: solid 3px ' +
    item.color +
    ' !important;">';
  if (name.exterior != null)
    ITEM += '<div class="item-quality text-left">' + name.exterior + '</div>';

  ITEM +=
    '<div class="item-image-content flex items-center justify-center p-2">';
  ITEM += '<img class="item-image transition-5" src="' + item.image + '">';
  ITEM += '</div>';

  ITEM += '<div class="item-name-content text-left">';
  if (name.brand != null)
    ITEM += '<div class="item-brand ellipsis">' + name.brand + '</div>';
  if (name.name != null)
    ITEM += '<div class="item-name ellipsis">' + name.name + '</div>';
  ITEM += '</div>';

  ITEM +=
    '<div class="item-price text-left"><div class="coins mr-1"></div>' +
    getFormatAmountString(item.price) +
    '</div>';
  ITEM += '</div>';
  ITEM += '</div>';

  return ITEM;
}

/* END CASE BATTLE */

/* DAILY CASES */

var spinnerWidth_Daily = 0;
var lastSpinner_Daily = 0;
var timeSpinner_Daily = 0;
var viewSpinner_Daily = 0;
var beginTimeSpinner_Daily = 0;
var movingSpinner_Daily = false;
var durationSpinner_Daily = 8;

var partSpinnerWidth_Daily = 150;

function renderSpinner_Daily() {
  var time = new Date().getTime() - beginTimeSpinner_Daily;
  if (time > timeSpinner_Daily) time = timeSpinner_Daily;

  var deg =
    (viewSpinner_Daily *
      (Math.pow(0.99 + 0.001 * durationSpinner_Daily, time) - 1)) /
    Math.log(0.99 + 0.001 * durationSpinner_Daily);

  rotateSpinner_Daily(deg);

  if (time < timeSpinner_Daily) {
    setTimeout(function () {
      renderSpinner_Daily();
    }, 1);
  } else {
    lastSpinner_Daily = deg;
    movingSpinner_Daily = false;
  }
}

function rotateSpinner_Daily(offset) {
  if (offset > 0) offset = -(offset - spinnerWidth_Daily / 2);

  $('#dailycases_spinner').css(
    'transform',
    'translate3d(' + offset + 'px, 0px, 0px)'
  );
}

function initializingSpinner_Daily() {
  spinnerWidth_Daily = $('#dailycases_case').width();

  if (!movingSpinner_Daily) rotateSpinner_Daily(lastSpinner_Daily);
}

function startSpinner_Daily() {
  initializingSpinner_Daily();

  var distance = partSpinnerWidth_Daily * 99;
  distance += Math.floor(Math.random() * partSpinnerWidth_Daily);

  beginTimeSpinner_Daily = new Date().getTime();
  viewSpinner_Daily =
    0.01 - distance * Math.log(0.99 + 0.001 * durationSpinner_Daily);
  timeSpinner_Daily =
    (Math.log(0.01) - Math.log(viewSpinner_Daily)) /
    Math.log(0.99 + 0.001 * durationSpinner_Daily);
  movingSpinner_Daily = true;

  renderSpinner_Daily();
}

function dailycases_addCase(dailycase, level) {
  $('#dailycases_cases .history_message').remove();

  var DIV =
    '<div class="case-item flex column gap-1" data-id="' + dailycase.id + '">';
  DIV += '<div class="case-slot rounded-0">';
  DIV +=
    '<div class="case-image-content flex items-center justify-center p-2">';
  DIV +=
    '<img class="case-image transition-5" src="' +
    ROOT +
    'template/img/dailycases/' +
    dailycase.image +
    '">';
  DIV += '</div>';

  DIV +=
    '<div class="case-name-content text-center ellipsis">' +
    dailycase.name +
    '</div>';

  DIV += '<div class="case-action-content">';
  if (dailycase.time > 0) {
    var dailycase_time = getFormatSeconds(dailycase.time);

    DIV +=
      '<button type="button" class="case-action dailycases-open site-button purple disabled" data-id="' +
      dailycase.id +
      '">' +
      dailycase_time.hours +
      ':' +
      dailycase_time.minutes +
      ':' +
      dailycase_time.seconds +
      '</button>';

    DIV += '<script>';
    DIV +=
      'var dailycases_timer_' + dailycase.id + ' = ' + dailycase.time + ';';

    DIV +=
      'if(dailycases_interval_' +
      dailycase.id +
      ') clearInterval(dailycases_interval_' +
      dailycase.id +
      ');';
    DIV +=
      'var dailycases_interval_' + dailycase.id + ' = setInterval(function(){';
    DIV += 'dailycases_timer_' + dailycase.id + '--;';

    DIV +=
      'var dailycase_time = getFormatSeconds(dailycases_timer_' +
      dailycase.id +
      ');';

    DIV +=
      '$(".dailycases-open[data-id=\'' +
      dailycase.id +
      '\']").text(dailycase_time.hours + ":" + dailycase_time.minutes + ":" + dailycase_time.seconds);';

    DIV += 'if(dailycases_timer_' + dailycase.id + ' <= 0) {';
    DIV += 'clearInterval(dailycases_interval_' + dailycase.id + ');';

    DIV +=
      '$(".dailycases-open[data-id=\'' +
      dailycase.id +
      '\']").removeClass("disabled").text("OPEN CASE (LVL. ' +
      dailycase.level +
      ')")';
    DIV += '}';
    DIV += '}, 1000);';
    DIV += '</script>';
  } else
    DIV +=
      '<button type="button" class="case-action dailycases-open site-button purple" data-id="' +
      dailycase.id +
      '">OPEN CASE (LVL. ' +
      dailycase.level +
      ')</button>';
  DIV += '</div>';
  DIV += '</div>';
  DIV += '</div>';

  $('#dailycases_cases').append(DIV);
}

function dailycases_countdownCase(dailycase) {
  if (dailycase.time > 0) {
    var dailycase_time = getFormatSeconds(dailycase.time);

    var DIV =
      '<button type="button" class="case-action dailycases-open site-button purple disabled" data-id="' +
      dailycase.id +
      '">' +
      dailycase_time.hours +
      ':' +
      dailycase_time.minutes +
      ':' +
      dailycase_time.seconds +
      '</button>';

    DIV += '<script>';
    DIV +=
      'var dailycases_timer_' + dailycase.id + ' = ' + dailycase.time + ';';

    DIV +=
      'if(dailycases_interval_' +
      dailycase.id +
      ') clearInterval(dailycases_interval_' +
      dailycase.id +
      ');';
    DIV +=
      'var dailycases_interval_' + dailycase.id + ' = setInterval(function(){';
    DIV += 'dailycases_timer_' + dailycase.id + '--;';

    DIV +=
      'var dailycase_time = getFormatSeconds(dailycases_timer_' +
      dailycase.id +
      ');';

    DIV +=
      '$(".dailycases-open[data-id=\'' +
      dailycase.id +
      '\']").text(dailycase_time.hours + ":" + dailycase_time.minutes + ":" + dailycase_time.seconds);';

    DIV += 'if(dailycases_timer_' + dailycase.id + ' <= 0) {';
    DIV += 'clearInterval(dailycases_interval_' + dailycase.id + ');';

    DIV +=
      '$(".dailycases-open[data-id=\'' +
      dailycase.id +
      '\']").removeClass("disabled").text("OPEN CASE (LVL. ' +
      dailycase.level +
      ')")';
    DIV += '}';
    DIV += '}, 1000);';
    DIV += '</script>';
  } else {
    var DIV =
      '<button type="button" class="case-action dailycases-open site-button purple" data-id="' +
      dailycase.id +
      '">OPEN CASE (LVL. ' +
      dailycase.level +
      ')</button>';
  }

  $(
    '#dailycases_cases .case-item[data-id="' +
      dailycase.id +
      '"] .case-action-content'
  ).html(DIV);
}

function dailycases_showCase(items, dailycase, level, spinner) {
  $('#dailycases_spinner').css('transform', 'translate3d(0px, 0px, 0px)');

  $('#dailycases_case_name').text(dailycase.name);
  $('#dailycases_case_level').text(dailycase.level);

  $('#dailycases_open').removeClass('disabled');
  if (level < dailycase.level) $('#dailycases_open').addClass('disabled');

  $('#dailycases_open').attr('data-id', dailycase.id);

  $('#dailycases_list').empty();
  items.forEach(function (item) {
    var ITEM = dailycases_generateItem(item);

    $('#dailycases_list').append(ITEM);
  });

  $('#dailycases_field').empty();
  spinner.forEach(function (item) {
    var ITEM = '<div class="reel-item flex justify-center items-center">';
    ITEM += dailycases_generateItem(item);
    ITEM += '</div>';

    $('#dailycases_field').append(ITEM);
  });

  $('#modal_dailycases_case').modal('show');
}

function dailycases_generateItem(item) {
  var name = getInfosByItemName(item.name);

  var ITEM = '<div class="listing-item flex column">';
  ITEM +=
    '<div class="listing-slot rounded-0" style="border-bottom: solid 3px ' +
    item.color +
    ' !important;">';
  if (name.exterior != null)
    ITEM += '<div class="item-quality text-left">' + name.exterior + '</div>';

  ITEM +=
    '<div class="item-chance text-right">' +
    roundedToFixed(item.chance, 2).toFixed(2) +
    '%</div>';

  ITEM +=
    '<div class="item-image-content flex items-center justify-center p-2">';
  ITEM += '<img class="item-image transition-5" src="' + item.image + '">';
  ITEM += '</div>';

  ITEM += '<div class="item-name-content text-left">';
  if (name.brand != null)
    ITEM += '<div class="item-brand ellipsis">' + name.brand + '</div>';
  if (name.name != null)
    ITEM += '<div class="item-name ellipsis">' + name.name + '</div>';
  ITEM += '</div>';

  ITEM +=
    '<div class="item-price text-left"><div class="coins mr-1"></div>' +
    getFormatAmountString(item.price) +
    '</div>';

  if (item.tickets !== undefined)
    ITEM +=
      '<div class="item-tickets text-right">' +
      item.tickets.min +
      ' - ' +
      item.tickets.max +
      '</div>';
  ITEM += '</div>';
  ITEM += '</div>';

  return ITEM;
}

function dailycases_openCase(items) {
  play_sound(audio_Unboxing_rolling);

  $('#dailycases_spinner').css('transform', 'translate3d(0px, 0px, 0px)');

  $('#dailycases_field').empty();

  items.forEach(function (item) {
    var ITEM = '<div class="reel-item flex justify-center items-center">';
    ITEM += dailycases_generateItem(item);
    ITEM += '</div>';

    $('#dailycases_field').append(ITEM);
  });

  startSpinner_Daily();
}

$(document).ready(function () {
  $('#modal_dailycases_cases').on('show', function () {
    $('#dailycases_cases').html(createLoader());

    send_request_socket({
      type: 'dailycases',
      command: 'cases',
    });
  });

  $(document).on('click', '.dailycases-open', function () {
    var id = $(this).attr('data-id');

    send_request_socket({
      type: 'dailycases',
      command: 'get',
      id: id,
    });
  });

  $(document).on('click', '#dailycases_open', function () {
    var id = $(this).attr('data-id');

    send_request_socket({
      type: 'dailycases',
      command: 'open',
      id: id,
    });

    $('#dailycases_open').addClass('disabled');
  });

  $(window).resize(function () {
    initializingSpinner_Daily();
  });
});

/* END DAILY CASES */

/* PLINKO */

function plinkoGame_play(id, plinko, game) {
  var DIV =
    '<div class="plinko-ball ' +
    game +
    ' flex column items-center justify-end transition-5" data-id="' +
    id +
    '">';
  DIV += '<script>';
  DIV += 'plinkoGame_roll_' + id + '([' + plinko + '], "' + game + '");';

  DIV += 'function plinkoGame_roll_' + id + '(deep, game){';
  DIV += 'var deepY = 0;';
  DIV += 'var deepX = 0;';

  DIV += '$(".plinko-ball[data-id=' + id + ']").css("top", "0px");';
  DIV += '$(".plinko-ball[data-id=' + id + ']").css("left", "0px");';

  DIV += 'var deeps = 0;';

  DIV += 'var int_deep = setInterval(function(){';
  DIV += 'var width_arena = $("#plinko-case").width();';
  DIV += 'var height_arena = $("#plinko-case").height();';

  DIV += 'var width_hole = width_arena / 32;';
  DIV += 'var height_hole = height_arena / 15;';

  DIV += 'if(deeps >= 14) {';
  DIV += 'clearInterval(int_deep);';

  DIV += 'var deep_winnings = { "low": 1, "medium": 2, "high": 3 };';

  DIV +=
    '$(".plinko-ball[data-id=' +
    id +
    ']").css("top", (deepY * height_hole + 30 * deep_winnings[game]) + "px");';

  DIV += 'setTimeout(function(){';
  DIV += '$(".plinko-ball[data-id=' + id + ']").remove()';
  DIV += '}, 10000);';

  DIV += 'return;';
  DIV += '}';

  DIV += 'var route = deep[deeps];';

  DIV += 'deepY++;';

  DIV += 'if(route == 1) deepX++;';
  DIV += 'else deepX--;';

  DIV +=
    '$(".plinko-ball[data-id=' +
    id +
    ']").css("top", (deepY * height_hole) + "px");';
  DIV +=
    '$(".plinko-ball[data-id=' +
    id +
    ']").css("left", (deepX * width_hole) + "px");';

  DIV += 'deeps++;';
  DIV += '}, 200);';
  DIV += '}';
  DIV += '</script>';
  DIV += '</div>';

  $('#plinko-arena').append(DIV);
}

const plinkoGame_addHistory = (history) => {
  $('#plinko_history .history_message').remove();

  const { id, game, amount, multiplier, commission, user, roll } = history;
  let profit = 0;
  const formattedAmount = getFormatAmount(amount * multiplier);

  profit =
    getFormatAmount(
      formattedAmount - getFeeFromCommission(formattedAmount, commission)
    ) - amount;

  const class_history =
    getFormatAmount(profit) >= 0 ? 'text-success' : 'text-danger';

  let DIV =
    '<div class="table-row plinko_historyitem ' +
    class_history +
    '" data-id="' +
    id +
    '">';
  DIV += '<div class="table-column text-left">';
  DIV += '<div class="flex items-center gap-1">';
  DIV += createAvatarField(user, 'small', '', '');
  DIV += '<div class="text-left width-full ellipsis">' + user.name + '</div>';
  DIV += '</div>';
  DIV += '</div>';
  DIV +=
    '<div class="table-column text-left">' +
    getFormatAmountString(amount) +
    '</div>';
  DIV +=
    '<div class="table-column text-left">' +
    roundedToFixed(multiplier, 2).toFixed(2) +
    'x</div>';
  DIV +=
    '<div class="table-column text-left">' + capitalizeText(game) + '</div>';
  DIV += '<div class="table-column text-left">' + roll + '</div>';
  DIV +=
    '<div class="table-column text-left">' +
    getFormatAmountString(profit) +
    '</div>';
  DIV += '</div>';

  $('#plinko_history').prepend(DIV);
  $('#plinko_history .plinko_historyitem[data-id="' + history.id + '"]')
    .slideUp(0)
    .slideDown('fast');

  while ($('#plinko_history .plinko_historyitem').length > 10)
    $('#plinko_history .plinko_historyitem').last().remove();
};

const getFeeFromCommission = (amount, commission) => {
  return roundedToFixed((amount * commission) / 100, 5);
};

$(document).ready(function () {
  $(document).on('click', '.plinko_bet', function () {
    $(this).addClass('disabled');

    var amount = $('#betamount_plinko').val();
    var game = $(this).data('game');

    send_request_socket({
      type: 'plinko',
      command: 'bet',
      amount: amount,
      game: game,
    });
  });
});

/* END PLINKO */

/* CRYPTO OFFERS */

$(document).ready(function () {
  $(document).on('click', '#deposit_bonus_apply', function () {
    var code = $('#deposit_bonus_code').val();

    requestRecaptcha(function (render) {
      send_request_socket({
        type: 'account',
        command: 'deposit_bonus',
        code: code,
        recaptcha: render,
      });
    });
  });

  $(document).on('input', '#currency_coin_from', function () {
    var currency = $(this).attr('data-currency');

    var value = $('.currency-panel #currency_coin_from').val();
    var amount = getNumberFromString(value);

    $('.currency-panel #currency_coin_from').val(value);

    if (offers_currencyValues[currency] === undefined)
      $('.currency-panel #currency_coin_to').val('0.00000000');
    else
      $('.currency-panel #currency_coin_to').val(
        (getFormatAmount(amount) / offers_currencyValues[currency]).toFixed(8)
      );

    var $input_check = $('.currency-panel #currency_coin_to');
    changeInputFieldLabel($input_check.closest('.input_field'));
  });

  $(document).on('input', '#currency_coin_to', function () {
    var currency = $(this).attr('data-currency');

    var value = $('.currency-panel #currency_coin_to').val();
    var amount = getNumberFromString(value);

    if (offers_currencyValues[currency] === undefined)
      $('.currency-panel #currency_coin_from').val('0.00');
    else
      $('.currency-panel #currency_coin_from').val(
        getFormatAmountString(offers_currencyValues[currency] * amount)
      );

    $('.currency-panel #currency_coin_to').val(value);

    var $input_check = $('.currency-panel #currency_coin_from');
    changeInputFieldLabel($input_check.closest('.input_field'));
  });

  $(document).on('click', '#generate_address', function () {
    var currency = $(this).attr('data-currency');

    requestRecaptcha(function (render) {
      send_request_socket({
        type: 'currency',
        command: 'generate_address',
        currency: currency,
        recaptcha: render,
      });
    });
  });

  $(document).on('click', '#crypto_withdraw', function () {
    var currency = $(this).attr('data-currency');
    var address = $('.currency-panel #currency_withdraw_address').val();
    var amount = $('.currency-panel #currency_coin_from').val();

    requestRecaptcha(function (render) {
      send_request_socket({
        type: 'currency',
        command: 'withdraw',
        currency: currency,
        amount: amount,
        address: address,
        recaptcha: render,
      });
    });
  });
});

/* END CRYPTO OFFERS */

/* STEAM & P2P OFFERS */

var offers_maxSelectItems = 20;
var offers_selectedItems = 0;

var offers_nameGames = {
  csgo: 'CS:GO',
  rust: 'RUST',
};

function offers_generateItem(items, data, feathers, classes, header, footer) {
  var price = 0;
  var offset = 0;
  var games = [];

  items.forEach(function (item) {
    price += item.price;
    offset += item.offset;
    if (!games.includes(offers_nameGames[item.game]))
      games.push(offers_nameGames[item.game]);
  });

  items.sort(function (a, b) {
    return b.price - a.price;
  });

  var ITEM =
    '<div class="listing-item flex column ' + classes + '" ' + data + '>';
  ITEM += header;

  ITEM +=
    '<div class="listing-slot rounded-0" style="border-bottom: solid 3px ' +
    items[0].color +
    ' !important;">';
  ITEM += feathers;

  if (items.length == 1) {
    var name = getInfosByItemName(items[0].name);

    if (name.exterior != null)
      ITEM += '<div class="item-quality text-left">' + name.exterior + '</div>';

    ITEM +=
      '<div class="item-image-content flex items-center justify-center p-2">';
    ITEM +=
      '<img class="item-image transition-5" src="' + items[0].image + '">';
    ITEM += '</div>';

    if (items[0].stickers !== undefined) {
      if (items[0].stickers.length > 0) {
        ITEM += '<div class="item-stickers-content flex justify-end">';
        ITEM += '<div class="item-stickers flex">';
        items[0].stickers.forEach(function (sticker) {
          ITEM +=
            '<div class="item-sticker flex justify-start" title="' +
            sticker.name +
            '">';
          ITEM += '<img src="' + sticker.image + '">';
          ITEM += '</div>';
        });
        ITEM += '</div>';
        ITEM += '</div>';
      }
    }

    ITEM += '<div class="item-name-content text-left">';
    if (name.brand != null)
      ITEM += '<div class="item-brand ellipsis">' + name.brand + '</div>';
    if (name.name != null)
      ITEM += '<div class="item-name ellipsis">' + name.name + '</div>';
    ITEM += '</div>';

    if (items[0].wear !== undefined) {
      if (items[0].wear != null) {
        ITEM += '<div class="item-wear-bar flex column justify-end">';
        ITEM +=
          '<div class="wear-bar-pointer flex justify-center width-0" style="left: ' +
          items[0].wear * 100 +
          '%;"></div>';
        ITEM += '<div class="wear-bar-content rounded-1">';
        ITEM += '<div class="wear-bar-exterior wear-bar-content-fn"></div>';
        ITEM += '<div class="wear-bar-exterior wear-bar-content-mw"></div>';
        ITEM += '<div class="wear-bar-exterior wear-bar-content-ft"></div>';
        ITEM += '<div class="wear-bar-exterior wear-bar-content-ww"></div>';
        ITEM += '<div class="wear-bar-exterior wear-bar-content-bs"></div>';
        ITEM += '</div>';
        ITEM += '</div>';

        ITEM +=
          '<div class="item-wear text-right">~' +
          items[0].wear.toString().slice(0, 6) +
          '</div>';
      }
    }
  } else if (items.length > 1) {
    ITEM +=
      '<div class="item-image-content item-bundle-content flex items-center justify-center p-2">';
    for (var i = 1; i <= 3; i++) {
      ITEM += '<div class="item-bundle flex items-center">';
      if (items.length >= i) {
        ITEM +=
          '<img class="item-bundle-image transition-5" src="' +
          items[i - 1].image +
          '">';

        if (items[i - 1].stickers !== undefined) {
          if (items[i - 1].stickers.length > 0) {
            ITEM += '<div class="item-bundle-stickers-content">';
            ITEM += '<div class="item-stickers flex">';
            items[i - 1].stickers.forEach(function (sticker) {
              ITEM +=
                '<div class="item-sticker flex justify-start" title="' +
                sticker.name +
                '">';
              ITEM += '<img src="' + sticker.image + '">';
              ITEM += '</div>';
            });
            ITEM += '</div>';
            ITEM += '</div>';
          }
        }
      }
      ITEM += '</div>';
    }

    ITEM += '<div class="item-bundle flex items-center view_more_bundle">';
    if (items.length > 3) {
      ITEM += '<div class="item-bundle-image-more text-center">';
      ITEM += '<div class="font-8">+' + (items.length - 3) + '</div>';
      ITEM += '<div class="font-6">more</div>';
      ITEM += '</div>';
    } else {
      ITEM += '<div class="item-bundle-image-more text-center">';
      ITEM += '<div class="font-8">' + items.length + ' Items</div>';
      ITEM += '<div class="font-6">view</div>';
      ITEM += '</div>';
    }
    ITEM += '</div>';
    ITEM += '</div>';

    ITEM += '<div class="item-name-content text-left">';
    ITEM +=
      '<div class="item-brand ellipsis">ITEM BUNDLE X' +
      items.length +
      '</div>';
    ITEM +=
      '<div class="item-name ellipsis">' + games.sort().join(', ') + '</div>';
    ITEM += '</div>';
  }

  ITEM += '<div class="item-price text-left">';
  ITEM += '<div class="coins"></div> ' + getFormatAmountString(price);

  if (offset > 0)
    ITEM +=
      '<span class="text-danger ml-1 font-6">(+' +
      roundedToFixed(offset / items.length).toFixed(2) +
      '%)</span>';
  if (offset < 0)
    ITEM +=
      '<span class="text-success ml-1 font-6">(-' +
      roundedToFixed(-offset / items.length).toFixed(2) +
      '%)</span>';
  ITEM += '</div>';
  ITEM += '</div>';

  ITEM += footer;
  ITEM += '</div>';

  return ITEM;
}

function offers_addItemInventory(item) {
  var items = [item];

  if (item.tradelocked === undefined) {
    item.tradelocked = {
      tradelocked: false,
      time: 0,
    };
  }

  if (item.accepted === undefined) item.accepted = true;

  var time_tradelocked = getFormatSeconds(item.tradelocked.time);

  var data =
    "data-id='" +
    item.id +
    "' data-game='" +
    item.game +
    "' data-accepted='" +
    (!item.accepted || item.tradelocked.tradelocked ? 0 : 1) +
    "' data-name='" +
    item.name +
    "' data-price='" +
    item.price +
    "' data-items='" +
    JSON.stringify({ items }).replaceAll("'", '') +
    "'";
  if (PATHS[0] == 'withdraw') data += " data-bot='" + item.bot + "'";

  var feathers =
    '<div class="item-selected flex justify-center items-center hidden font-8"><i class="fa fa-check" aria-hidden="true"></i></div>';

  if (!item.accepted || item.tradelocked.tradelocked) {
    feathers += '<div class="item-notaccepted"></div>';
  }
  if (PATHS[0] == 'withdraw') {
    feathers += '<div class="item-tradelocked rounded-0 flex items-center">';
    if (item.tradelocked.tradelocked)
      feathers +=
        '<div class="m-a text-danger"><i class="fa fa-lock" aria-hidden="true"></i> ' +
        time_tradelocked.days +
        'D ' +
        time_tradelocked.hours +
        'H</div>';
    else
      feathers +=
        '<div class="m-a text-success"><i class="fa fa-lock " aria-hidden="true"></i> INSTANT</div>';
    feathers += '</div>';
  } else if (PATHS[0] == 'deposit') {
    if (!item.accepted || item.tradelocked.tradelocked) {
      feathers += '<div class="item-tradelocked rounded-0 flex items-center">';
      if (item.tradelocked.tradelocked)
        feathers +=
          '<div class="m-a text-danger"><i class="fa fa-lock" aria-hidden="true"></i> ' +
          time_tradelocked.days +
          'D ' +
          time_tradelocked.hours +
          'H</div>';
      else if (!item.accepted)
        feathers +=
          '<div class="m-a text-danger"><i class="fa fa-lock" aria-hidden="true"></i> NOT ACCEPTED</div>';
      feathers += '</div>';
    }
  }
  var classes = '';
  if (!item.accepted || item.tradelocked.tradelocked) classes = 'notaccepted';
  var header = '';
  var footer = '';

  $('#list_items').append(
    offers_generateItem([item], data, feathers, classes, header, footer)
  );
}

function offers_addBundleInventory(item) {
  if ($('#list_items .listing-item').length <= 0) $('#list_items').empty();

  var data =
    "data-id='" +
    item.id +
    "' data-game='" +
    item.game +
    "' data-accepted='1' data-name='Bundle' data-price='" +
    item.amount +
    "' data-items='" +
    JSON.stringify({ items: item.items }).replaceAll("'", '') +
    "'";
  var feathers =
    '<div class="item-selected flex justify-center items-center hidden font-8"><i class="fa fa-check" aria-hidden="true"></i></div>';
  var classes = 'bundle';
  var header = '';
  var footer = '<div class="item-bundle-time-content">';
  footer +=
    '<span class="item_bundle_time" data-id="' +
    item.id +
    '">' +
    getFormatTime(item.time * 1000, 'ago') +
    '</span>';
  footer +=
    '<script>setInterval(function(){$(".item_bundle_time[data-id=' +
    item.id +
    ']").text(getFormatTime(' +
    item.time * 1000 +
    ', "ago"))},1000)</script>';
  footer += '</div>';

  $('#list_items').append(
    offers_generateItem(item.items, data, feathers, classes, header, footer)
  );
}

function offers_editPending(offer) {
  if (
    $(
      '#pending-offers .bundle_offer[data-id="' +
        offer.id +
        '"][data-method="' +
        offer.method +
        '"]'
    ).length <= 0
  )
    return;

  var DIV = offers_generatePadding(offer);
  $(
    '#pending-offers .bundle_offer[data-id="' +
      offer.id +
      '"][data-method="' +
      offer.method +
      '"]'
  ).replaceWith(DIV);

  offers_refreshPendingItems();

  offers_addStatusPending(offer);
}

function offers_addPending(offer, notify) {
  var DIV = offers_generatePadding(offer);
  $('#pending-offers').append(DIV);

  offers_refreshPendingItems();

  if (notify) offers_addStatusPending(offer);
}

function offers_generatePadding(offer) {
  var price = 0;

  offer.items.forEach(function (item) {
    price += getFormatAmount(item.price);
  });

  var text_status = '';
  var class_status = '';
  if (offer.method == 'p2p') {
    if (offer.status == -1) {
      text_status = 'Listing Canceled';
      class_status = 'error';
    }
    if (offer.status == 0) text_status = 'Waiting for buyer...';
    if (offer.status == 1) text_status = 'Waiting for seller confirmation...';
    if (offer.status == 2) text_status = 'Buyer found. Tracking for trade...';
    if (offer.status == 3)
      text_status = 'Trade found. Waithing for accepting trade...';
    if (offer.status == 4) {
      text_status = 'Items Delivered';
      class_status = 'success';
    }
  } else if (offer.method == 'steam') {
    if (offer.status == -1) {
      text_status = 'Offer Declined';
      class_status = 'error';
    }
    if (offer.status == 0) text_status = 'Waiting for bot confirmation...';
    if (offer.status == 1) text_status = 'Waiting for accepting...';
    if (offer.status == 2) {
      text_status = 'Offer Accepted';
      class_status = 'success';
    }
  }

  var data =
    "data-id='" +
    offer.id +
    "' data-method='" +
    offer.method +
    "' data-price='" +
    price +
    "' data-offer='" +
    JSON.stringify({
      status: offer.status,
      type: offer.type,
      data: offer.data,
    }) +
    "' data-items='" +
    JSON.stringify({ items: offer.items }).replaceAll("'", '') +
    "'";
  var feathers =
    '<div class="item-bundle-settings transition-5" style="opacity: 0; display: unset;">';
  feathers +=
    '<div class="flex column gap-2 items-center justify-center height-full width-full">';
  feathers +=
    '<button class="site-button purple inspect_pending_offer" data-id="' +
    offer.id +
    '" data-method="' +
    offer.method +
    '">INSPECT</button>';
  feathers += '</div>';
  feathers += '</div>';
  var classes = 'p-1 rounded-1 bundle_offer unselectable ' + class_status;
  var header =
    '<div class="item-pending-title text-left text-upper">' +
    offer.type +
    ' ' +
    offer.method +
    '</div>';
  var footer =
    '<div class="item-pending-status text-center">' + text_status + '</div>';

  return offers_generateItem(
    offer.items,
    data,
    feathers,
    classes,
    header,
    footer
  );
}

function offers_refreshCartItems() {
  var amount = 0;
  var count = 0;

  var offset = 0;
  if (PATHS[0] == 'deposit' && PATHS[1] == 'p2p')
    offset = $('#bundle_offset').val();

  $('#list_items .listing-item.active').each(function (i, e) {
    var price = getFormatAmount($(this).data('price'));

    amount += getFormatAmount(
      price + roundedToFixed((price * offset) / 100, 5)
    );
    count += $(this).data('items').items.length;
  });

  $('#cart_items_total').countToFloat(amount);
  $('#cart_items_count').text(count);

  offers_selectedItems = count;

  if (count == 0) $('.confirm-offer').addClass('disabled');
  else $('.confirm-offer').removeClass('disabled');
}

function offers_refreshPendingItems() {
  var total = 0;
  var amount = 0;
  var count = 0;

  $('#pending-offers .bundle_offer').each(function (i, e) {
    total++;
    amount += getFormatAmount($(this).data('price'));
    count += $(this).data('items').items.length;
  });

  if (total <= 0) $('#pending_count').addClass('hidden');
  else $('#pending_count').removeClass('hidden');

  $('#pending_count').text(total);
  $('#padding_items_total').countToFloat(amount);
  $('#padding_items_count').text(count);
}

function offers_addStatusPending(offer) {
  $('#modal_offers_pending').modal('hide');

  $('#modal_offers_pending .offers_pending_method').addClass('hidden');
  $(
    '#modal_offers_pending .offers_pending_method[data-method="' +
      offer.method +
      '"]'
  ).removeClass('hidden');

  $(
    '#modal_offers_pending .offers_pending_method[data-method="' +
      offer.method +
      '"] .offers_pending_type'
  ).addClass('hidden');
  $(
    '#modal_offers_pending .offers_pending_method[data-method="' +
      offer.method +
      '"] .offers_pending_type[data-type="' +
      offer.type +
      '"]'
  ).removeClass('hidden');

  var $content = $(
    '#modal_offers_pending .offers_pending_method[data-method="' +
      offer.method +
      '"] .offers_pending_type[data-type="' +
      offer.type +
      '"] .offers_pending_status[data-status="' +
      offer.status +
      '"]'
  );

  $(
    '#modal_offers_pending .offers_pending_method[data-method="' +
      offer.method +
      '"] .offers_pending_type[data-type="' +
      offer.type +
      '"] .offers_pending_status'
  ).addClass('hidden');
  $content.removeClass('hidden');

  var data =
    "data-items='" +
    JSON.stringify({ items: offer.items }).replaceAll("'", '') +
    "'";
  var feathers = '';
  var classes = 'bundle_offer unselectable';
  var header = '';
  var footer = '';

  $content
    .find('.bundle_items_pending')
    .html(
      offers_generateItem(offer.items, data, feathers, classes, header, footer)
    );

  if (offer.method == 'p2p') {
    if (offer.status == 0) {
      var COUNTER =
        'Waiting for <span class="counter" id="counter_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        '">00:00:00:00</span>';

      COUNTER += '<script>';
      COUNTER +=
        '$("#counter_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        '").text(getFormatSeconds(' +
        (time() - offer.data.time) +
        ').days + ":" + getFormatSeconds(' +
        (time() - offer.data.time) +
        ').hours + ":" + getFormatSeconds(' +
        (time() - offer.data.time) +
        ').minutes + ":" + getFormatSeconds(' +
        (time() - offer.data.time) +
        ').seconds);';

      COUNTER +=
        'var time_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        ' = ' +
        (time() - offer.data.time) +
        ';';

      COUNTER +=
        'clearInterval(int_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        ');';
      COUNTER +=
        'var int_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        ' = setInterval(function(){';
      COUNTER +=
        'var time = getFormatSeconds(time_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        ');';

      COUNTER +=
        '$("#counter_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        '").text(time.days + ":" + time.hours + ":" + time.minutes + ":" + time.seconds);';

      COUNTER +=
        'time_' + offer.method + '_' + offer.id + '_' + offer.status + ' ++;';
      COUNTER += '}, 1000);';
      COUNTER += '</script>';

      $content.find('.counter_content').html(COUNTER);

      $content.find('#cancel_p2p_listing').attr('data-listing', offer.id);
    }
    if (offer.status == 1 || offer.status == 2 || offer.status == 3) {
      var COUNTER =
        'Expire in <span class="counter" id="counter_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        '">00:00</span>';

      COUNTER += '<script>';
      COUNTER +=
        '$("#counter_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        '").text(getFormatSeconds(' +
        (offer.data.time - time()) +
        ').minutes + ":" + getFormatSeconds(' +
        (offer.data.time - time()) +
        ').seconds);';

      COUNTER +=
        'var time_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        ' = ' +
        (offer.data.time - time()) +
        ';';

      COUNTER +=
        'clearInterval(int_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        ');';
      COUNTER +=
        'var int_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        ' = setInterval(function(){';
      COUNTER +=
        'if(time_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        ' <= 0){';
      COUNTER +=
        'clearInterval(int_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        ');';
      COUNTER += 'return;';
      COUNTER += '}';

      COUNTER +=
        'var time = getFormatSeconds(time_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        ');';

      COUNTER +=
        '$("#counter_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        '").text(time.minutes + ":" + time.seconds);';

      COUNTER +=
        'time_' + offer.method + '_' + offer.id + '_' + offer.status + ' --;';
      COUNTER += '}, 1000);';
      COUNTER += '</script>';

      $content.find('.counter_content').html(COUNTER);
    }
    if (offer.type == 'deposit') {
      if (offer.status == 1)
        $content.find('#confirm_p2p_listing').attr('data-listing', offer.id);
      if (offer.status == 1 || offer.status == 2 || offer.status == 3) {
        var DIV = createAvatarField(offer.data.user, 'medium', '');
        DIV += '<div>' + offer.data.user.name + '</div>';

        $content
          .find('.offer_buyer_profile')
          .attr(
            'href',
            'http://steamcommunity.com/profiles/' + offer.data.steamid
          );
        $content.find('.offer_buyer_profile').html(DIV);
      }
      if (offer.status == 2 || offer.status == 3)
        $content.find('.trade_link_offer').attr('href', offer.data.tradelink);
    }
    if (offer.type == 'withdraw') {
      if (offer.status == 3) {
        $content.find('.trade_link_offer').attr('href', offer.data.tradeoffer);
      }
    }
  } else if (offer.method == 'steam') {
    if (
      offer.status == -1 ||
      offer.status == 0 ||
      offer.status == 1 ||
      offer.status == 2
    )
      $content.find('.offer_id').text(offer.data.tradeofferid);
    if (offer.status == 0 || offer.status == 1)
      $content.find('.offer_code').text(offer.data.code);
    if (offer.type == 'deposit') {
      if (offer.status == 2) {
        $content.find('.offer_coins').text(offer.data.amount);

        if (offer.data.refill)
          $content.find('.offer_got_coins').addClass('hidden');
        else $content.find('.offer_got_coins').removeClass('hidden');
      }
    }
    if (offer.type == 'withdraw') {
      if (offer.status == -1)
        $content.find('.offer_coins').text(offer.data.amount);
    }
    if (offer.status == 1) {
      var COUNTER =
        'Expire in <span class="counter" id="counter_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        '">00:00</span>';

      COUNTER += '<script>';
      COUNTER +=
        '$("#counter_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        '").text(getFormatSeconds(' +
        (offer.data.time - time()) +
        ').minutes + ":" + getFormatSeconds(' +
        (offer.data.time - time()) +
        ').seconds);';

      COUNTER +=
        'var time_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        ' = ' +
        (offer.data.time - time()) +
        ';';

      COUNTER +=
        'clearInterval(int_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        ');';
      COUNTER +=
        'var int_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        ' = setInterval(function(){';
      COUNTER +=
        'if(time_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        ' <= 0){';
      COUNTER +=
        'clearInterval(int_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        ');';
      COUNTER += 'return;';
      COUNTER += '}';

      COUNTER +=
        'var time = getFormatSeconds(time_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        ');';

      COUNTER +=
        '$("#counter_' +
        offer.method +
        '_' +
        offer.id +
        '_' +
        offer.status +
        '").text(time.minutes + ":" + time.seconds);';

      COUNTER +=
        'time_' + offer.method + '_' + offer.id + '_' + offer.status + ' --;';
      COUNTER += '}, 1000);';
      COUNTER += '</script>';

      $content.find('.counter_content').html(COUNTER);

      $content
        .find('.offer_trade')
        .attr(
          'href',
          'https://steamcommunity.com/tradeoffer/' +
            offer.data.tradeofferid +
            '/'
        );
    }
  }

  setTimeout(function () {
    $('#modal_offers_pending').modal('show');
  }, 500);
}

$(document).ready(function () {
  $(document).on('mouseover', '.bundle_offer', function () {
    var $DIV = $(this);

    $DIV.find('.item-bundle-settings').css('display', 'unset');

    setTimeout(function () {
      $DIV.find('.item-bundle-settings').css('opacity', 1);
    }, 10);
  });

  $(document).on('mouseleave', '.bundle_offer', function () {
    var $DIV = $(this);

    $DIV.find('.item-bundle-settings').css('opacity', 0);

    setTimeout(function () {
      $DIV.find('.item-bundle-settings').css('display', 'none');
    }, 500);
  });

  $(document).on('click', '.bundle_offer .view_more_bundle', function () {
    var $bundle = $(this).parent().parent().parent();

    var items = $bundle.data('items').items;

    $('#modal_view_bundle').modal('show');
    $('#modal_view_bundle .bundle-items').empty();

    items.forEach(function (item) {
      var data = '';
      var feathers = '';
      var classes = 'bundle_offer';
      var header = '';
      var footer = '';

      $('#modal_view_bundle .bundle-items').append(
        offers_generateItem([item], data, feathers, classes, header, footer)
      );
    });
  });

  $(document).on('click', '#cancel_p2p_listing', function () {
    var listing = $(this).attr('data-listing');

    requestRecaptcha(function (render) {
      send_request_socket({
        type: 'p2p',
        command: 'cancel_listing',
        id: listing,
        recaptcha: render,
      });
    });
  });

  $(document).on('click', '#confirm_p2p_listing', function () {
    var listing = $(this).data('listing');

    requestRecaptcha(function (render) {
      send_request_socket({
        type: 'p2p',
        command: 'confirm_listing',
        id: listing,
        recaptcha: render,
      });
    });
  });

  $('#items_order').on('change', function () {
    var type = $(this).val();
    if (type == 0) {
      tinysort('#list_items .listing-item', {
        data: 'price',
        order: 'desc',
      });
    } else if (type == 1) {
      tinysort('#list_items .listing-item', {
        data: 'price',
        order: 'asc',
      });
    } else if (type == 2) {
      tinysort('#list_items .listing-item', {
        data: 'name',
        order: 'asc',
      });
    } else if (type == 3) {
      tinysort('#list_items .listing-item', {
        data: 'name',
        order: 'desc',
      });
    }

    tinysort('#list_items .listing-item', {
      data: 'accepted',
      order: 'desc',
    });
  });

  var timeout_items = null;
  $('#items_search').on('input', function () {
    var search = $(this).val().toLowerCase();

    if (timeout_items) clearTimeout(timeout_items);

    timeout_items = setTimeout(function () {
      $('#list_items .history_message').remove();

      $('#list_items .listing-item')
        .addClass('hidden')
        .filter(function (i, e) {
          var name = $(this).data('name');

          if (name.toLowerCase().indexOf(search) >= 0) return true;
        })
        .removeClass('hidden');

      tinysort('#list_items .listing-item', {
        data: 'accepted',
        order: 'desc',
      });

      if ($('#list_items .listing-item:not(.hidden)').length <= 0) {
        if (PAGE == 'deposit')
          $('#list_items').append(
            '<div class="in-grid font-8 history_message">Your Inventory is currently empty.</div>'
          );
        if (PAGE == 'withdraw')
          $('#list_items').append(
            '<div class="in-grid font-8 history_message">The Marketplace is currently empty.</div>'
          );
      }
    }, 1000);
  });

  $(document).on(
    'click',
    '#list_items .listing-item:not(.notaccepted):not(.unselectable)',
    function () {
      var dataPos = $(this).data('id');

      if ($(this).hasClass('active')) {
        $(this).removeClass('active').find('.item-selected').addClass('hidden');

        $(
          '#cart-items .item-selected-content[data-id="' + dataPos + '"]'
        ).remove();
      } else {
        if (
          $(this).hasClass('bundle') ||
          offers_selectedItems < offers_maxSelectItems
        ) {
          var items = $(this).data('items').items;

          if (items.length == 1) {
            var name = getInfosByItemName(items[0].name);

            if ($(this).hasClass('bundle')) {
              $('#list_items .listing-item.active')
                .removeClass('active')
                .find('.item-selected')
                .addClass('hidden');
              $('#cart-items').empty();
            }

            $(this)
              .addClass('active')
              .find('.item-selected')
              .removeClass('hidden');

            var DIV =
              '<div class="item-selected-content p-2 flex gap-1 items-center justify-between rounded-0" style="border-left: solid 4px ' +
              items[0].color +
              '" data-id="' +
              dataPos +
              '" data-price="' +
              getFormatAmount(items[0].price) +
              '">';
            DIV += '<div class="flex ellipsis gap-2">';
            DIV += '<img class="icon-large" src="' + items[0].image + '">';
            DIV += '<div class="ellipsis text-left">';
            DIV += '<div class="mb-2">';
            DIV +=
              '<div class="ellipsis font-6 text-bold">' +
              items[0].name +
              '</div>';
            if (name.exterior != null)
              if (name.exterior.trim())
                DIV +=
                  '<div class="ellipsis font-5 text-gray">' +
                  name.exterior +
                  '</div>';
            DIV += '</div>';
            DIV +=
              '<div class="font-7"><div class="coins mr-1"></div><span class="price">' +
              getFormatAmountString(items[0].price) +
              '</span></div>';
            DIV += '</div>';
            DIV += '</div>';
            DIV +=
              '<div class="pointer" id="remove_item" data-id="' +
              dataPos +
              '">';
            DIV += '<i class="fa fa-times" aria-hidden="true"></i>';
            DIV += '</div>';
            DIV += '</div>';

            $('#cart-items').append(DIV);
          } else {
            var bundle_total = getFormatAmount($(this).data('price'));

            $('#modal_select_bundle').modal('show');
            $('#modal_select_bundle .bundle-items').empty();

            $('#modal_select_bundle #select_bundle').attr(
              'data-bundle',
              dataPos
            );
            $('#modal_select_bundle #bundle_total_amount').text(
              getFormatAmountString(bundle_total)
            );

            items.forEach(function (item) {
              var data = '';
              var feathers = '';
              var classes = 'bundle_offer';
              var header = '';
              var footer = '';

              $('#modal_select_bundle .bundle-items').append(
                offers_generateItem(
                  [item],
                  data,
                  feathers,
                  classes,
                  header,
                  footer
                )
              );
            });
          }
        } else {
          notify(
            'error',
            'Error: You can select maximum ' + offers_maxSelectItems + ' item!'
          );
        }
      }

      offers_refreshCartItems();
    }
  );

  $(document).on('click', '#select_bundle', function () {
    var dataPos = $(this).attr('data-bundle');

    $('#list_items .listing-item.active')
      .removeClass('active')
      .find('.item-selected')
      .addClass('hidden');

    $('#cart-items').empty();

    $('#list_items .listing-item[data-id="' + dataPos + '"]')
      .addClass('active')
      .find('.item-selected')
      .removeClass('hidden');

    var items = $(
      '#list_items .listing-item.bundle[data-id="' + dataPos + '"]'
    ).data('items').items;

    items.sort(function (a, b) {
      return b.price - a.price;
    });

    items.forEach(function (item) {
      var name = getInfosByItemName(item.name);

      var DIV =
        '<div class="item-selected-content p-2 flex gap-1 items-center justify-between rounded-0" style="border-left: solid 4px ' +
        item.color +
        '" data-id="' +
        dataPos +
        '" data-price="' +
        getFormatAmount(item.price) +
        '">';
      DIV += '<div class="flex ellipsis gap-2">';
      DIV += '<img class="icon-large" src="' + item.image + '">';
      DIV += '<div class="ellipsis text-left">';
      DIV += '<div class="mb-2">';
      DIV += '<div class="ellipsis font-6 text-bold">' + item.name + '</div>';
      if (name.exterior != null)
        if (name.exterior.trim())
          DIV +=
            '<div class="ellipsis font-5 text-gray">' +
            name.exterior +
            '</div>';
      DIV += '</div>';
      DIV +=
        '<div class="font-7"><div class="coins mr-1"></div><span class="price">' +
        getFormatAmountString(item.price) +
        '</span></div>';
      DIV += '</div>';
      DIV += '</div>';
      DIV += '<div class="pointer" id="remove_item" data-id="' + dataPos + '">';
      DIV += '<i class="fa fa-times" aria-hidden="true"></i>';
      DIV += '</div>';
      DIV += '</div>';

      $('#cart-items').append(DIV);
    });

    offers_refreshCartItems();
  });

  $(document).on('click', '#refresh_inventory', function () {
    if (PATHS[1] == 'p2p') {
      if (PATHS[0] == 'deposit') {
        send_request_socket({
          type: 'p2p',
          command: 'load_inventory',
          game: PATHS[2],
        });
      } else if (PATHS[0] == 'withdraw') {
        send_request_socket({
          type: 'p2p',
          command: 'load_shop',
          game: PATHS[2],
        });
      }
    } else if (PATHS[1] == 'steam') {
      if (PATHS[0] == 'deposit') {
        send_request_socket({
          type: 'steam',
          command: 'load_inventory',
          game: PATHS[2],
        });
      } else if (PATHS[0] == 'withdraw') {
        send_request_socket({
          type: 'steam',
          command: 'load_shop',
          game: PATHS[2],
        });
      }
    }

    $('#refresh_inventory')
      .addClass('disabled')
      .html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
    $('#list_items').html(createLoader());
    $('#cart-items').empty();
  });

  $(document).on('click', '#remove_item', function () {
    var id = $(this).data('id');

    $('#list_items .listing-item[data-id="' + id + '"]')
      .removeClass('active')
      .find('.item-selected')
      .addClass('hidden');

    $('#cart-items .item-selected-content[data-id="' + id + '"]').remove();

    offers_refreshCartItems();
  });

  $(document).on('click', '.steam-bot', function () {
    var bot = $(this).data('bot');

    $('.steam-bot').removeClass('active');
    $(this).addClass('active');

    $('#list_items>.listing-item')
      .addClass('hidden')
      .filter(function (i, e) {
        if ($(this).data('bot') == bot) return true;
      })
      .removeClass('hidden');
  });

  $(document).on('click', '.confirm-offer', function () {
    var confirm = $(this).data('confirm');

    var items = [];
    $('#list_items .listing-item.active').each(function (i, e) {
      items.push({
        id: $(this).data('id').toString(),
        game: $(this).data('game').toString(),
      });
    });

    requestRecaptcha(function (render) {
      if (PATHS[1] == 'steam') {
        if (confirm == 'refill' && PATHS[0] != 'deposit') return;

        if (PATHS[0] == 'deposit') {
          send_request_socket({
            type: 'steam',
            command: PATHS[0],
            items: items,
            game: PATHS[2],
            refill: confirm == 'refill',
            recaptcha: render,
          });
        } else if (PATHS[0] == 'withdraw') {
          var bot = $('.steam-bot.active').data('bot');

          send_request_socket({
            type: 'steam',
            command: PATHS[0],
            items: items,
            game: PATHS[2],
            bot: bot,
            recaptcha: render,
          });
        }
      } else if (PATHS[1] == 'p2p') {
        if (confirm == 'refill') return;

        if (PAGE == 'deposit') {
          var offset = $('#bundle_offset').val();

          send_request_socket({
            type: 'p2p',
            command: 'create_listing',
            items: items,
            game: PATHS[2],
            offset: offset,
            recaptcha: render,
          });
        } else if (PAGE == 'withdraw') {
          send_request_socket({
            type: 'p2p',
            command: 'buy_listing',
            bundles: items,
            recaptcha: render,
          });
        }
      }
    });
  });

  $(document).on('click', '.inspect_pending_offer', function () {
    var $placeholder = $(
      '#pending-offers .bundle_offer[data-id="' +
        $(this).data('id') +
        '"][data-method="' +
        $(this).data('method') +
        '"]'
    );

    var offer = JSON.parse($placeholder.attr('data-offer').toString());

    offers_addStatusPending({
      id: $(this).data('id'),
      type: offer.type,
      method: $(this).data('method'),
      status: offer.status,
      game: offer.game,
      items: $placeholder.data('items').items,
      data: offer.data,
    });
  });

  $(document).on('input', '#bundle_offset', function () {
    var offset = $(this).val();

    $('#cart-items .item-selected-content').each(function (i, e) {
      var price = getFormatAmount($(this).data('price'));

      $(this)
        .find('.price')
        .text(
          getFormatAmountString(
            price + roundedToFixed((price * offset) / 100, 5)
          )
        );
    });

    offers_refreshCartItems();
  });
});

/* END STEAM & P2P OFFERS */

/* CASE CREATOR */

function pagination_addCaseCreatorItems(list) {
  $('#casecreator_items').html(
    '<div class="in-grid flex justify-center items-center font-8 p-4 history_message">No data found</div></div>'
  );

  if (list.length > 0) $('#casecreator_items .history_message').remove();

  list.forEach(function (item) {
    $('#casecreator_items').append(casecreator_generateItem(item));
  });

  $('#casecreator_case_items .table-row').each(function (i, e) {
    var id = $(this).data('id');

    $('#casecreator_items .listing-item[data-id="' + id + '"]')
      .addClass('active')
      .find('.item-selected')
      .removeClass('hidden');
  });
}

function casecreator_generateItem(item) {
  var ITEM =
    "<div class='listing-item flex column' data-id='" +
    item.id +
    "' data-item='" +
    JSON.stringify(item).replaceAll("'", '') +
    "'>";
  ITEM +=
    '<div class="listing-slot rounded-0" style="border-bottom: solid 3px ' +
    item.color +
    ' !important;">';
  var name = getInfosByItemName(item.name);

  ITEM +=
    '<div class="item-selected flex justify-center items-center hidden font-8"><i class="fa fa-check" aria-hidden="true"></i></div>';

  if (name.exterior != null)
    ITEM += '<div class="item-quality text-left">' + name.exterior + '</div>';

  ITEM +=
    '<div class="item-image-content flex items-center justify-center p-2">';
  ITEM += '<img class="item-image transition-5" src="' + item.image + '">';
  ITEM += '</div>';

  ITEM += '<div class="item-name-content text-left">';
  if (name.brand != null)
    ITEM += '<div class="item-brand ellipsis">' + name.brand + '</div>';
  if (name.name != null)
    ITEM += '<div class="item-name ellipsis">' + name.name + '</div>';
  ITEM += '</div>';

  ITEM += '<div class="item-price text-left">';
  ITEM += '<div class="coins"></div> ' + getFormatAmountString(item.price);
  ITEM += '</div>';
  ITEM += '</div>';
  ITEM += '</div>';

  return ITEM;
}

function casecreator_refreshSelectedItems() {
  var price = 0;
  var chance = 0;

  var allowed = true;

  $('#casecreator_case_items .table-row').each(function (i, e) {
    var item_price = getFormatAmount($(this).data('price'));
    var item_chance = roundedToFixed(
      $(this).find('.casecreator_chance').val(),
      5
    );

    price += (item_price * item_chance) / 100;
    chance = roundedToFixed(chance + item_chance, 5);

    if (item_chance == 0) allowed = false;
  });

  price = getFormatAmount(
    price * (1 + roundedToFixed($('#casecreator_case_offset').val(), 2) / 100)
  );

  $('#casecreator_chance').text(roundedToFixed(chance, 5).toFixed(5));

  if (
    chance == 100 &&
    allowed &&
    $('#casecreator_case_items .table-row').length > 1
  ) {
    $('#casecreator_case_create').removeClass('disabled');
    $('#casecreator_case_edit').removeClass('disabled');

    $('#casecreator_price').text(getFormatAmountString(price));
  } else {
    $('#casecreator_case_create').addClass('disabled');
    $('#casecreator_case_edit').addClass('disabled');

    $('#casecreator_price').text('N/A');
  }
}

function casecreator_selectItem(item, chance) {
  $('#casecreator_case_items .history_message').remove();

  var name = getInfosByItemName(item.name);

  $('#casecreator_items .listing-item[data-id="' + item.id + '"]')
    .addClass('active')
    .find('.item-selected')
    .removeClass('hidden');

  var DIV =
    '<div class="table-row" data-id="' +
    item.id +
    '" data-price="' +
    item.price +
    '">';
  DIV += '<div class="table-column text-left">';
  DIV += '<div class="flex items-center gap-2">';
  DIV += '<img style="width: 50px;" src="' + item.image + '">';
  DIV += '<div class="text-left width-full ellipsis">' + item.name + '</div>';
  DIV += '</div>';
  DIV += '</div>';
  DIV +=
    '<div class="table-column text-center"><div class="coins mr-1"></div><span class="price">' +
    getFormatAmountString(item.price) +
    '</span></div>';
  DIV += '<div class="table-column text-center">';
  DIV +=
    '<div class="input_field bet_input_field transition-5" data-border="#de4c41">';
  DIV += '<div class="field_container">';
  DIV += '<div class="field_content">';
  DIV +=
    '<input type="text" class="field_element_input casecreator_chance" data-id="' +
    item.id +
    '" value="' +
    chance +
    '">';

  DIV += '<div class="field_label transition-5">Chance</div>';
  DIV += '</div>';

  DIV += '<div class="field_extra">';
  DIV += '<div class="flex column gap-1 rounded-0 overflow-h">';
  DIV +=
    '<div class="button-count changeshort_action" data-id=".casecreator_chance[data-id=\'' +
    item.id +
    '\']" data-fixed="0" data-action="+1">˄</div>';
  DIV +=
    '<div class="button-count changeshort_action" data-id=".casecreator_chance[data-id=\'' +
    item.id +
    '\']" data-fixed="0" data-action="-1">˅</div>';
  DIV += '</div>';
  DIV += '</div>';
  DIV += '</div>';

  DIV += '<div class="field_bottom"></div>';
  DIV += '</div>';
  DIV += '</div>';
  DIV += '<div class="table-column text-right text-danger font-10">';
  DIV +=
    '<button class="site-button purple casecreator_item_remove" data-id="' +
    item.id +
    '">Remove</button>';
  DIV += '</div>';
  DIV += '</div>';

  $('#casecreator_case_items').prepend(DIV);

  changeInputFieldLabel(
    $(
      '#casecreator_case_items .table-row[data-id="' +
        item.id +
        '"] .input_field'
    )
  );

  casecreator_refreshSelectedItems();
}

function casecreator_addCase(casecreator, creator) {
  $('#casecreator_cases .history_message').remove();

  var DIV =
    '<div class="case-item flex column gap-1" data-id="' +
    casecreator.id +
    '">';
  DIV += '<div class="case-slot rounded-0">';
  DIV +=
    '<div class="case-image-content flex items-center justify-center p-2">';
  DIV +=
    '<img class="case-image transition-5" src="' +
    ROOT +
    'template/img/' +
    creator +
    '/' +
    casecreator.image +
    '">';
  DIV += '</div>';

  DIV +=
    '<div class="case-name-content text-center ellipsis">' +
    casecreator.name +
    '</div>';

  DIV += '<div class="case-action flex row gap-1">';
  DIV +=
    '<a href="' +
    ROOT +
    'admin/casecreator/edit/' +
    creator +
    '/' +
    casecreator.id +
    '" target="_blank"><button type="button" class="site-button purple" >EDIT</button></a>';
  DIV +=
    '<button type="button" class="casecreator-remove site-button red" data-id="' +
    casecreator.id +
    '">REMOVE</button>';
  DIV += '</div>';
  DIV += '</div>';
  DIV += '</div>';

  $('#casecreator_cases').append(DIV);
}

$(document).ready(function () {
  $(document).on(
    'click',
    '#pagination_casecreator_items .pagination-item',
    function () {
      $('#casecreator_items').html(createLoader());

      var page = $(this).attr('data-page');
      var order = parseInt($('#casecreator_items_order').val());
      var search = $('#casecreator_items_search').val();

      send_request_socket({
        type: 'pagination',
        command: 'casecreator_items',
        page: page,
        order: order,
        search: search,
      });
    }
  );

  var timeout_casecreator_items = null;
  $('#casecreator_items_search').on('input', function () {
    if (timeout_casecreator_items) clearTimeout(timeout_casecreator_items);

    timeout_casecreator_items = setTimeout(function () {
      $('#casecreator_items').html(createLoader());

      var order = parseInt($('#casecreator_items_order').val());
      var search = $('#casecreator_items_search').val();

      send_request_socket({
        type: 'pagination',
        command: 'casecreator_items',
        page: 1,
        order: order,
        search: search,
      });
    }, 1000);
  });

  $('#casecreator_items_order').on('change', function () {
    $('#casecreator_items').html(createLoader());

    var order = parseInt($('#casecreator_items_order').val());
    var search = $('#casecreator_items_search').val();

    send_request_socket({
      type: 'pagination',
      command: 'casecreator_items',
      page: 1,
      order: order,
      search: search,
    });
  });

  $(document).on('input', '.casecreator_chance', function () {
    casecreator_refreshSelectedItems();
  });

  $(document).on('input', '#casecreator_case_offset', function () {
    casecreator_refreshSelectedItems();
  });

  $(document).on('click', '#casecreator_case_create', function () {
    var name = $('#casecreator_case_name').val();
    var image = document.querySelector('#casecreator_case_image').files[0];
    var items = [];

    $('#casecreator_case_items .table-row').each(function (i, e) {
      var id = $(this).data('id');
      var chance = roundedToFixed($(this).find('.casecreator_chance').val(), 5);

      items.push({ id, chance });
    });

    var data = {};

    if (PATHS[3] == 'cases') {
      var offset = parseFloat($('#casecreator_case_offset').val());
      var battle = $('#casecreator_case_battle').is(':checked') ? 1 : 0;

      data = { offset, battle };
    } else if (PATHS[3] == 'dailycases') {
      var level = parseInt($('#casecreator_case_level').val());

      data = { level };
    }

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'casecreator_create',
        creator: PATHS[3],
        name: name,
        image: image,
        items: items,
        data: data,
        secret: secret,
      });
    });
  });

  $(document).on('click', '#casecreator_case_edit', function () {
    var name = $('#casecreator_case_name').val();
    var image = document.querySelector('#casecreator_case_image').files[0];
    var items = [];

    $('#casecreator_case_items .table-row').each(function (i, e) {
      var id = $(this).data('id');
      var chance = roundedToFixed($(this).find('.casecreator_chance').val(), 5);

      items.push({ id, chance });
    });

    var data = {};

    if (PATHS[3] == 'cases') {
      var offset = parseFloat($('#casecreator_case_offset').val());
      var battle = $('#casecreator_case_battle').is(':checked') ? 1 : 0;

      data = { offset, battle };
    } else if (PATHS[3] == 'dailycases') {
      var level = parseInt($('#casecreator_case_level').val());

      data = { level };
    }

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'casecreator_edit',
        creator: PATHS[3],
        id: PATHS[4],
        name: name,
        image: image,
        items: items,
        data: data,
        secret: secret,
      });
    });
  });

  $(document).on('click', '.casecreator-remove', function () {
    var id = $(this).attr('data-id');

    confirm_identity(function (confirmed, secret) {
      if (!confirmed) return;

      send_request_socket({
        type: 'admin',
        command: 'casecreator_remove',
        creator: PATHS[3],
        id: id,
        secret: secret,
      });
    });
  });

  $(document).on('click', '.casecreator_item_remove', function () {
    var id = $(this).attr('data-id');

    $('#casecreator_items .listing-item[data-id="' + id + '"]')
      .removeClass('active')
      .find('.item-selected')
      .addClass('hidden');

    $('#casecreator_case_items .table-row[data-id="' + id + '"]').remove();

    if ($('#casecreator_case_items .table-row').length <= 0)
      $('#casecreator_case_items').html(
        '<div class="in-grid bg-light flex justify-center items-center font-8 p-4 history_message">No items selected</div>'
      );

    casecreator_refreshSelectedItems();
  });

  $(document).on('click', '#casecreator_items .listing-item', function () {
    var dataPos = $(this).attr('data-id');

    if ($(this).hasClass('active')) {
      $(this).removeClass('active').find('.item-selected').addClass('hidden');

      $(
        '#casecreator_case_items .table-row[data-id="' + dataPos + '"]'
      ).remove();

      if ($('#casecreator_case_items .table-row').length <= 0)
        $('#casecreator_case_items').html(
          '<div class="in-grid bg-light flex justify-center items-center font-8 p-4 history_message">No items selected</div>'
        );

      casecreator_refreshSelectedItems();
    } else {
      var item = $(this).data('item');

      casecreator_selectItem(item, 0);
    }
  });
});

/* END CASE CREATOR */

/* GAME BOTS */

function gamebots_addBot(bot) {
  $('#gamebots_list .history_message').remove();

  var DIV =
    '<div class="gamebot-item bg-light rounded-1 b-l2 pl-4 pr-4" data-userid="' +
    bot.user.userid +
    '">';
  DIV +=
    '<div class="gamebot-selected flex justify-center items-center font-8"><i class="fa fa-check" aria-hidden="true"></i></div>';

  DIV += '<div class="flex row items-center gap-2 height-full">';
  DIV += createAvatarField(bot.user, 'medium', '', '');

  DIV += '<div class="flex column gap-1 items-start">';
  DIV += '<div class="flex column items-start">';
  DIV += '<div class="gamebot-name">' + bot.user.name + '</div>';
  DIV +=
    '<a class="gamebot-profile" href="' +
    ROOT +
    'profile/' +
    bot.user.userid +
    '" target="_black">Profile</a>';
  DIV += '</div>';

  var winning_rate =
    bot.bets > 0
      ? roundedToFixed((bot.winnings / bot.bets) * 100, 2).toFixed(2) + '%'
      : 'N/A';

  DIV += '<div class="gamebot-rate">Winning Rate: ' + winning_rate + '</div>';
  DIV += '</div>';
  DIV += '</div>';
  DIV += '</div>';

  $('#gamebots_list').append(DIV);
}

$(document).ready(function () {
  $(document).on('click', '#gamebots_list .gamebot-item', function () {
    $('#gamebots_list .gamebot-item').removeClass('active');

    $(this).addClass('active');
  });

  $(document).on('click', '.gamebots_show', function () {
    $('#gamebots_list').html(createLoader());
    $('#gamebots_confirm').addClass('disabled');

    $('#modal_gamebots_list').modal('show');

    var game = $(this).attr('data-game');
    var data = JSON.parse(stringUnescape($(this).attr('data-data')));

    send_request_socket({
      type: 'gamebots',
      command: 'show',
      game: game,
      data: data,
    });
  });

  $(document).on('click', '#gamebots_confirm', function () {
    var userid = $('#gamebots_list .gamebot-item.active').attr('data-userid');

    var game = $(this).attr('data-game');
    var data = JSON.parse(stringUnescape($(this).attr('data-data')));

    send_request_socket({
      type: 'gamebots',
      command: 'confirm',
      userid: userid,
      game: game,
      data: data,
    });
  });
});

/* END GAME BOTS */

/* INVENTORY */

function pagination_addInventoryItems(list) {
  $('#inventory_list').html(
    '<div class="in-grid flex justify-center items-center font-8 p-4 history_message">Empty</div></div>'
  );

  if (list.length > 0) $('#inventory_list .history_message').remove();

  list.forEach(function (item) {
    $('#inventory_list').append(inventory_generateItem(item));
  });
}

function inventory_generateItem(item) {
  var classes = '';
  //if(item.status != 0) classes = 'notaccepted';

  var ITEM =
    "<div class='listing-item inventory_item flex column " +
    classes +
    "' data-id='" +
    item.item.id +
    "'>";
  ITEM +=
    '<div class="listing-slot rounded-0" style="border-bottom: solid 3px ' +
    item.item.color +
    ' !important;">';
  var name = getInfosByItemName(item.item.name);

  ITEM +=
    '<div class="item-inventory-settings transition-5" style="opacity: 0; display: unset;">';
  ITEM +=
    '<div class="flex column gap-2 items-center justify-center height-full width-full">';
  ITEM +=
    '<button class="site-button purple inventory_sell_item" data-id="' +
    item.item.id +
    '">SELL ITEM</button>';
  ITEM += '</div>';
  ITEM += '</div>';

  //ITEM += '<div class="item-notaccepted"></div>';

  if (name.exterior != null)
    ITEM += '<div class="item-quality text-left">' + name.exterior + '</div>';

  ITEM +=
    '<div class="item-image-content flex items-center justify-center p-2">';
  ITEM += '<img class="item-image transition-5" src="' + item.item.image + '">';
  ITEM += '</div>';

  ITEM += '<div class="item-name-content text-left">';
  if (name.brand != null)
    ITEM += '<div class="item-brand ellipsis">' + name.brand + '</div>';
  if (name.name != null)
    ITEM += '<div class="item-name ellipsis">' + name.name + '</div>';
  ITEM += '</div>';

  //ITEM += '<div class="item-info text-danger text-right">Sold</div>';

  ITEM += '<div class="item-price text-left">';
  ITEM += '<div class="coins"></div> ' + getFormatAmountString(item.item.price);
  ITEM += '</div>';
  ITEM += '</div>';
  ITEM += '</div>';

  return ITEM;
}

$(document).ready(function () {
  $(document).on('mouseover', '.inventory_item:not(.notaccepted)', function () {
    var $DIV = $(this);

    $DIV.find('.item-inventory-settings').css('display', 'unset');

    setTimeout(function () {
      $DIV.find('.item-inventory-settings').css('opacity', 1);
    }, 10);
  });

  $(document).on(
    'mouseleave',
    '.inventory_item:not(.notaccepted)',
    function () {
      var $DIV = $(this);

      $DIV.find('.item-inventory-settings').css('opacity', 0);

      setTimeout(function () {
        $DIV.find('.item-inventory-settings').css('display', 'none');
      }, 500);
    }
  );

  $(document).on('click', '.inventory_sell_item', function () {
    var id = $(this).attr('data-id');

    send_request_socket({
      type: 'inventory',
      command: 'sell_item',
      id: id,
    });
  });

  $(document).on('click', '#inventory_sell_all', function () {
    send_request_socket({
      type: 'inventory',
      command: 'sell_all',
    });
  });

  $(document).on('show', '#modal_user_inventory', function () {
    $('#inventory_list').html(createLoader());

    send_request_socket({
      type: 'pagination',
      command: 'inventory_items',
      page: 1,
    });
  });

  $(document).on(
    'click',
    '#pagination_inventory_items .pagination-item',
    function () {
      $('#inventory_list').html(createLoader());

      var page = $(this).attr('data-page');

      send_request_socket({
        type: 'pagination',
        command: 'inventory_items',
        page: page,
      });
    }
  );
});

/* END INVENTORY */

/* FAQ */

$(document).ready(function () {
  $(document).on('click', '.faq-open', function () {
    if ($(this).parent().parent().hasClass('active')) {
      $(this).parent().parent().removeClass('active');
    } else {
      $(this).parent().parent().addClass('active');
    }
  });
});

/* END FAQ */

/* SUPPORT */

$(document).ready(function () {
  $(document).on('click', '.support-ticket .title', function () {
    if (!$(this).parent().hasClass('active')) {
      $('.support-ticket').removeClass('active');
      $(this).parent().addClass('active');
    } else $(this).parent().removeClass('active');
  });

  $(document).on('click', '.support-open', function () {
    var status = $(this).data('status');

    $('.support-open').removeClass('active');
    $(this).addClass('active');

    if (status == 'all') {
      $('.support-content .support-ticket').removeClass('hidden');
    } else {
      $('.support-content .support-ticket').addClass('hidden');
      $(
        '.support-content .support-ticket[data-status="' + status + '"]'
      ).removeClass('hidden');
    }
  });

  initializeSupportForm();
  function initializeSupportForm() {
    $('.form_support').on('submit', function (e) {
      e.preventDefault();

      $.ajax({
        url: $(this).attr('action'),
        type: $(this).attr('method'),
        data:
          $(this).serialize() +
          '&' +
          $(this).find('[type="submit"]:focus').attr('name'),
        success: function (data) {
          try {
            data = JSON.parse(data);

            if (data.success) {
              notify('success', data.message);

              $('#page_loader').load(' #page_content', function () {
                //initializeInputFields();
                //initializeDropdownFields();
                //initializeSwitchFields();
                //initializeSliderFields();

                initializeSupportForm();
              });
            } else {
              notify('error', data.error);
            }
          } catch (err) {
            notify('error', err.message);
          }
        },
        error: function (err) {
          notify('error', 'Error 500');
        },
      });
    });
  }

  $(document).on('click', '#open_tickets', function () {
    var id = $(this).data('id');

    if ($('.support-tickets[data-id="' + id + '"]').hasClass('hidden')) {
      $('.support-tickets[data-id="' + id + '"]').removeClass('hidden');
    } else {
      $('.support-tickets[data-id="' + id + '"]').addClass('hidden');
    }
  });

  $(document).on('change', '#type_ticket_support', function () {
    $('.support-content').removeClass('hidden');

    if ($(this).is(':checked')) {
      $('.support-content[data-type="closed"]').addClass('hidden');
    } else {
      $('.support-content[data-type="opened"]').addClass('hidden');
    }
  });
});

/* END SUPPORT */

/* FAIR */

$(document).ready(function () {
  $(document).on('click', '.fair-category .title', function () {
    if (!$(this).parent().hasClass('active')) {
      $('.fair-category').removeClass('active');
      $(this).parent().addClass('active');
    } else $(this).parent().removeClass('active');
  });

  $(document).on('click', '.fair-results', function () {
    var fair = JSON.parse($(this).attr('data-fair').toString());

    var game = fair.game;
    var draw = fair.draw;

    $('#fair_server_seed_hashed').text('-');
    $('#fair_server_seed').text('-');
    $('#fair_public_seed').text('-');
    $('#fair_nonce').text('-');
    $('#fair_block').text('-');
    $('#fair_block_link').attr('href', '');

    $('#fair_server_seed_hashed').attr('data-text', '');
    $('#fair_server_seed').attr('data-text', '');
    $('#fair_public_seed').attr('data-text', '');
    $('#fair_nonce').attr('data-text', '');

    if (game.server_seed_hashed !== undefined)
      $('#fair_server_seed_hashed').text(game.server_seed_hashed);
    if (game.server_seed !== undefined)
      $('#fair_server_seed').text(game.server_seed);
    if (game.public_seed !== undefined)
      $('#fair_public_seed').text(game.public_seed);
    if (game.nonce !== undefined) $('#fair_nonce').text(game.nonce);
    if (game.block !== undefined) {
      $('#fair_block').text(game.block);
      $('#fair_block_link').attr(
        'href',
        'https://eosflare.io/block/' + game.block
      );
    }

    $('#fair_server_seed_hashed').attr('data-text', game.server_seed_hashed);
    $('#fair_server_seed').attr('data-text', game.server_seed);
    $('#fair_public_seed').attr('data-text', game.public_seed);
    $('#fair_nonce').attr('data-text', game.nonce);

    if (draw) {
      $('#fair_draw').removeClass('hidden');

      $('#fair_draw_public_seed').text('-');
      $('#fair_draw_block').text('-');
      $('#fair_draw_block_link').attr('href', '');

      if (draw.public_seed !== undefined)
        $('#fair_draw_public_seed').text(draw.public_seed);

      if (draw.block !== undefined) {
        $('#fair_draw_block').text(draw.block);
        $('#fair_draw_block_link').attr(
          'href',
          'https://eosflare.io/block/' + draw.block
        );
      }
    } else {
      $('#fair_draw').addClass('hidden');
    }

    $('#modal_fair_round').modal('show');
  });

  $(document).on('click', '.fair-results-casebattle', function () {
    var roll = JSON.parse($(this).attr('data-roll').toString());

    $('#modal_fair_casebattle_results .fair-results').empty();

    var players = roll[0].length;
    var DIV =
      '<div class="width-full flex justify-center items-center row gap-2">';
    DIV +=
      '<div class="font-6" style="width: calc(100% / ' + players + ');"></div>';

    for (var i = 1; i <= players; i++)
      DIV +=
        '<div class="font-6 text-bold" style="width: calc(100% / ' +
        players +
        ');">Player ' +
        i +
        '</div>';
    DIV += '</div>';

    roll.forEach(function (item, i) {
      DIV +=
        '<div class="width-full flex justify-center items-center row gap-2">';
      DIV +=
        '<div class="font-6 text-bold" style="width: calc(100% / ' +
        players +
        ');">Round #' +
        (i + 1) +
        '</div>';

      item.forEach(function (value) {
        DIV +=
          '<div class="font-6" style="width: calc(100% / ' +
          players +
          ');">' +
          value +
          '</div>';
      });
      DIV += '</div>';
    });

    $('#modal_fair_casebattle_results .fair-results').html(DIV);
    $('#modal_fair_casebattle_results').modal('show');
  });
});

/* END FAIR */

function getInfosByItemName(name) {
  var infos = {
    brand: null,
    name: null,
    exterior: null,
  };

  var stage1 = name.split(' | ');

  if (stage1.length > 0) {
    infos.brand = stage1[0];

    if (stage1.length > 1) {
      if (stage1[1].indexOf('(') >= 0 && stage1[1].indexOf(')') >= 0) {
        var stage2 = stage1[1].split(' (');
        infos.name = stage2[0];

        var stage3 = stage2[1].split(')');
        infos.exterior = stage3[0];
      } else infos.name = stage1[1];
    }
  }

  return infos;
}

function createLoader() {
  var DIV =
    '<div class="flex in-grid justify-center items-center width-full height-full history_message">';
  DIV += '<div class="loader">';
  DIV += '<div class="loader-part loader-part-1">';
  DIV += '<div class="loader-dot loader-dot-1"></div>';
  DIV += '<div class="loader-dot loader-dot-2"></div>';
  DIV += '</div>';

  DIV += '<div class="loader-part loader-part-2">';
  DIV += '<div class="loader-dot loader-dot-1"></div>';
  DIV += '<div class="loader-dot loader-dot-2"></div>';
  DIV += '</div>';
  DIV += '</div>';
  DIV += '</div>';

  return DIV;
}

function createAvatarField(user, type, more, classes) {
  var level_class = [
    'tier-steel',
    'tier-bronze',
    'tier-silver',
    'tier-gold',
    'tier-diamond',
  ][parseInt(user.level / 25)];

  var DIV =
    '<div class="avatar-field rounded-full ' +
    classes +
    ' ' +
    level_class +
    ' relative">';
  DIV +=
    '<img class="avatar icon-' +
    type +
    ' rounded-full" src="' +
    user.avatar +
    '">';
  DIV +=
    '<div class="level sup-' +
    type +
    '-left flex justify-center items-center b-d2 bg-dark rounded-full">' +
    user.level +
    '</div>';
  DIV += more;
  DIV += '</div>';

  return DIV;
}

function roundedToFixed(number, decimals) {
  if (isNaN(Number(number))) return 0;

  number = Number(Number(number).toFixed(5));

  var number_string = number.toString();
  var decimals_string = 0;

  if (number_string.split('.')[1] !== undefined)
    decimals_string = number_string.split('.')[1].length;

  while (decimals_string - decimals > 0) {
    number_string = number_string.slice(0, -1);

    decimals_string--;
  }

  return Number(number_string);
}

function getFormatAmount(amount) {
  return roundedToFixed(amount, 2);
}

function getFormatAmountString(amount) {
  return getFormatAmount(amount).toFixed(2);
}

function getNumberFromString(amount) {
  if (amount.toString().trim().length <= 0) return 0;
  if (isNaN(Number(amount.toString().trim()))) return 0;

  return amount;
}

function stringEscape(string) {
  return string.toString().replace(/"/g, '&quot;');
}

function stringUnescape(string) {
  return string.toString().replace(/(&quot;)/g, '"');
}

function generate_code(field, length) {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  $(field).val(text);
  changeInputFieldLabel($(field).closest('.input_field'));
}

function getFormatSeconds(time) {
  var days = parseInt(time / (24 * 60 * 60));
  var hours = parseInt((time - days * 24 * 60 * 60) / (60 * 60));
  var minutes = parseInt((time - days * 24 * 60 * 60 - hours * 60 * 60) / 60);
  var seconds = parseInt(
    time - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60
  );

  if (days < 10) days = '0'.concat(days);
  if (hours < 10) hours = '0'.concat(hours);
  if (minutes < 10) minutes = '0'.concat(minutes);
  if (seconds < 10) seconds = '0'.concat(seconds);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function capitalizeText(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function time() {
  return parseInt(new Date().getTime() / 1000);
}
