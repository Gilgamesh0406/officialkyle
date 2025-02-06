'use client';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';

const page = () => {
  useEffect(() => {
    const handleClick = (event: any) => {
      event.stopPropagation(); // Stop event propagation

      const faqItem = event.currentTarget.closest('.faq-item');
      if (faqItem) {
        faqItem.classList.toggle('active');
      }
    };

    const allChevron = document.querySelectorAll('.faq-open');
    allChevron.forEach((chevron) => {
      chevron.addEventListener('click', handleClick);
    });

    return () => {
      // Cleanup function to remove event listeners when component unmounts
      allChevron.forEach((chevron) => {
        chevron.removeEventListener('click', handleClick);
      });
    };
  }, []);

  return (
    <div className='grid split-column-3 gap-4 responsive'>
      <div className='flex nowarp column gap-2'>
        <div className='faq-panel p-4'>
          <div className='mt-2 mb-4 font-10 text-bold'>General</div>

          <div className='flex nowarp column gap-2'>
            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>What is Crazycargo.gg?</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                </div>
              </div>

              <div className='description transition-2'>
                <div>
                  Crazycargo.gg is a case battling site for Rust and
                  Counter-Strike skins. Players deposit skins or cryptocurrency
                  for diesel to play games such as case battling, coinflip,
                  unboxing, plinko.
                </div>
                <div>
                  It doesn't matter how big your inventory is, or how much you
                  bet, your odds are always the same.
                </div>
                <div>
                  Bets occur in real time, across the entire site, meaning you
                  bet, win, and lose along with other players.
                </div>
                <div>
                  All rolls are generated using a provably fair system ensuring
                  a fair roll each and every time.
                </div>
              </div>
            </div>

            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>Chat Rules</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <ol type='1'>
                  <li>To send diesel you need have level 1.</li>
                  <li>Don't beg for diesel.</li>
                  <li>Don't post your affiliates codes in chat.</li>
                  <li>Don't advertise other websites.</li>
                  <li>
                    Technical problems are not solved in the chat but through
                    the support page.
                  </li>
                  <li>
                    Do not ask about support tickets in chat. You can expect a
                    response within 48 hours of sending your ticket.
                  </li>
                  <li>
                    Do not lie about transactions on support tickets, as this
                    can result in a ban.
                  </li>
                  <li>
                    Respect our staff. Any rude remarks or attempts to belittle
                    them will result in a mute.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className='faq-panel p-4'>
          <div className='mt-2 mb-4 font-10 text-bold'>Contact Support</div>

          <div className='flex nowarp column gap-2'>
            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>I Can't Find An Answer To A Question</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>
                  Feel free to contact us every time, if you need help or have
                  some questions about the website and our service.
                </div>
                <div>
                  Our Support Team is available around the clock, 24/7, to
                  assist you. You can contact us{' '}
                  <a href='support' target='_blank' className='text-color'>
                    here
                  </a>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='faq-panel p-4'>
          <div className='mt-2 mb-4 font-10 text-bold'>Promotion</div>

          <div className='flex nowarp column gap-2'>
            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>
                  Partnership / Sponsorship - Would You Like To Sponsor Me?
                </div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>
                  For business related questions, we advise you to contact
                  Business@Crazycargo.gg
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='faq-panel p-4'>
          <div className='mt-2 mb-4 font-10 text-bold'>Responsible Gaming</div>

          <div className='flex nowarp column gap-2'>
            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>How To Play Responsibly</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>
                  Responsible Gaming is a set of social responsibility
                  initiatives by the industry to ensure the integrity and
                  fairness of their operations and to promote awareness of harm
                  associated with it.
                </div>
                <div>Tips on how to play responsibly:</div>
                <ol type='1'>
                  <li>
                    Don't treat playing on Crazycargo.gg as a way to make money
                  </li>
                  <li>
                    Only play with money you're willing to lose - play with your
                    disposable income
                  </li>
                  <li>
                    Never chase your losses, there is no guarantee you will come
                    out ahead
                  </li>
                  <li>
                    Don't play while under the influence of alcohol, drugs or
                    other controlled substances
                  </li>
                  <li>Never play when you're being depressed or upset</li>
                  <div>
                    If you'd like to take a forced break from playing, you can
                    go to your profile and lock yourself.
                  </div>
                  <div>We will not remove this restriction for any reason.</div>
                </ol>
              </div>
            </div>
            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>What If I Can't Stop?</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>
                  Like all forms of online activities, it can become an
                  addiction that can have serious negative effects on your life.
                </div>
                <div>
                  If you lose more than you planned to or can’t safely afford
                  and find yourself struggling to control time and/or money
                  spent, please check these sites for information that could
                  help you:
                </div>
                <div>
                  HELP:{' '}
                  <a
                    href='http://www.psychguides.com/'
                    target='_blank'
                    className='text-color'
                  >
                    http://www.psychguides.com/
                  </a>
                </div>
                <div>
                  Self Help:{' '}
                  <a
                    href='http://www.gamblersanonymous.org/ga/'
                    target='_blank'
                    className='text-color'
                  >
                    http://www.gamblersanonymous.org/ga/
                  </a>
                </div>
              </div>
            </div>
            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>Can I Self-request A Ban?</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>
                  Yes. If you feel like you can't control your habits, you can
                  use self exclusion.
                </div>
                <div>
                  If you enable it, you won't be able to bet, claim rewards,
                  send diesel or deposit anything until the restriction expires.
                </div>
                <div>
                  Withdraws and chat privileges will remain active. Use it if
                  you'd like to take a break from playing for an extended
                  period. For custom restrictions, you can always contact us.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='faq-panel p-4'>
          <div className='mt-2 mb-4 font-10 text-bold'>Fairness</div>

          <div className='flex nowarp column gap-2'>
            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>Are The Games Fair?</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>
                  Absolutely! We can prove it. Please see our{' '}
                  <a href='/fair' target='_blank' className='text-color'>
                    provably fair
                  </a>{' '}
                  page for technical details.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex nowarp column gap-2'>
        <div className='faq-panel p-4'>
          <div className='mt-2 mb-4 font-10 text-bold'>Affiliates</div>

          <div className='flex nowarp column gap-2'>
            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>How Can I Earn Extra Diesel By Referring New Users?</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>
                  Create your unique code in the affiliate tab and receive up to
                  4.50% deposit commission from every user who used your code.
                </div>
                <div>
                  The code will also generate 0.00 diesel for the person who
                  uses the code.
                </div>
                <div className='text-italic'>
                  Note: The code should not be misleading or violate any
                  trademarks.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='faq-panel p-4'>
          <div className='mt-2 mb-4 font-10 text-bold'>Diesel</div>

          <div className='flex nowarp column gap-2'>
            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>What Is Diesel?</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>1 Dollar = 1 Diesel</div>
                <div>
                  Diesel has no real monetary value, but it's used to withdraw
                  skins and play games on our website.
                </div>
              </div>
            </div>

            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>Can I Send My Diesel To Other Players?</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>
                  To send diesel you must be level 1. You can send diesel to
                  other players by clicking on their username in the chat and
                  then on the gift icon.
                </div>
              </div>
            </div>

            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>I Logged Into My Account And All My Diesel Is Gone?</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>
                  When unexpected issues arise, there could be numerous
                  potential causes.
                </div>
                <div>
                  Viruses, exploits, and harmful browser extensions. We strongly
                  advise all Crazycargo.gg users against using any browser
                  extensions while playing on our site, as they can cause
                  various problems. We recommend securing your account using a
                  two-factor login method.
                </div>
                <div>
                  It’s important to understand that we do not offer refunds for
                  these types of incidents. We only provide refunds for issues
                  that we can verify and validate through our logs and database.
                </div>
                <div>
                  There are a lot of more things that can cause problems, here
                  are only 2 mentioned above. Lastly, we do NOT refund these
                  types of incidents. We only refund what we can see and prove
                  in our logs/Database.
                </div>
                <div>
                  Lastly, please be aware that Crazycargo.gg Admins, Bots, or
                  Moderators will never add you on Steam, nor will they ever
                  request any of your items. Always be cautious of giveaway and
                  impersonation scams. Stay safe!
                </div>
              </div>
            </div>

            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>How Can I Get Free Diesel?</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>
                  Head over to your profile tab and make sure your account is
                  verified.
                </div>
                <div>
                  There is a couple of ways you can earn free diesel on
                  Crazycargo.gg
                </div>
                <ol type='1'>
                  <li>
                    Daily Reward:
                    <div>
                      You can earn up to 0.00 diesel daily by claiming your
                      Daily Reward.
                    </div>
                    <div>
                      <i>
                        Don't forget that you'll receive more diesel as you
                        level up!
                      </i>
                    </div>
                  </li>
                  <li>Daily Case:</li>
                  <div>
                    Every 24 hours depending on your level you can open a daily
                    case. All you need to do is have crazycargo.gg in your steam
                    name.
                  </div>
                  <li>Refuel:</li>
                  <div>
                    Approximately every hour, a unique event called the Refuel
                    takes place. It initiates with a base of one diesel and
                    allocates 1% of all wagers placed during this interval into
                    a communal pool.
                  </div>
                  <div>
                    This accumulated bounty is then equitably distributed among
                    the participating users, ensuring that everyone gets a share
                    of the rewards!
                  </div>
                  <li>Siphon:</li>
                  <div>
                    Everytime you do a Case Battle you Siphon 1% of the total
                    cost back!
                  </div>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className='faq-panel p-4'>
          <div className='mt-2 mb-4 font-10 text-bold'>Games</div>

          <div className='flex nowarp column gap-2'>
            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>Is There A Minimum Bet?</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>The minimum bet is 1.00 diesel</div>
              </div>
            </div>

            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>What Is Crazy Mode??</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>
                  In this unique game mode, victory goes to the player who
                  unboxes items of the least total value. The winner takes all -
                  every item unboxed in the battle is theirs to keep.
                </div>
              </div>
            </div>

            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>How Do I Withdraw A Skin I Unboxed</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>
                  The skins you unbox and crate battle from games on CrazyCargo
                  are solely for your viewing, they are not real skins.
                </div>
                <div>
                  To view our selection of real skins you can click the withdraw
                  menu and game you wish to see skins for.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='faq-panel p-4'>
          <div className='mt-2 mb-4 font-10 text-bold'>Commission</div>

          <div className='flex nowarp column gap-2'>
            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>Do You Charge Commission?</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>Our commission rates are as follows</div>
                <div>Case Battles: 0%</div>
                <div>Unboxing: 0%</div>
                <div>Plink: 3%</div>
                <div>Coinflip: 3%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex nowarp column gap-2'>
        <div className='faq-panel p-4'>
          <div className='mt-2 mb-4 font-10 text-bold'>Withdraw</div>

          <div className='flex nowarp column gap-2'>
            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>What Withdraw Methods Do You Offer?</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>
                  We only offer withdrawing skins via steam. Our system for
                  withdrawing skins is based on our peer-to-peer network,
                  complemented by our curated selection of in-house skins.
                </div>
              </div>
            </div>
            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>Do You Offer Cryptocurrency As A Withdraw?</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>
                  No sorry at this time we only allow withdraws via CSGO and
                  Rust skins.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='faq-panel p-4'>
          <div className='mt-2 mb-4 font-10 text-bold'>Deposit</div>

          <div className='flex nowarp column gap-2'>
            <div className='faq-item flex nowarp column gap-2 pb-2'>
              <div className='flex nowarp row justify-between items-center gap-2'>
                <div>What Deposit Methods Do You Allow?</div>

                <div className='faq-open pointer transition-2 font-7'>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <i className='fa fa-angle-down' aria-hidden='true'></i>
                </div>
              </div>

              <div className='description transition-2'>
                <div>
                  You can effortlessly make deposits using your preferred
                  cryptocurrency, or directly with your CSGO and Rust skins. We
                  also support skin deposits through our peer-to-peer (P2P)
                  system.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
