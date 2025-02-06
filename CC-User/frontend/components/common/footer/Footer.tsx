import {
  faSteam,
  faSteamSymbol,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
  return (
    <div className='footer'>
      <div className='flex column gap-6'>
        <div className='footer-top flex row justify-between gap-6 responsive'>
          <div className='footer-logo flex column gap-4'>
            <div className='justify-center'>
              <a className='justify-center flex' href='/'>
                <img src='/imgs/testlogo.png?v=1714120630' />
              </a>
            </div>

            <div>Your favorite place to trade &amp; win skins!</div>
          </div>

          <div className='footer-grid flex row gap-2'>
            <div className='column flex column items-start gap-4'>
              <div className='title font-9 text-bold'>Support</div>

              <div className='flex column text-left gap-2'>
                <a className='text-gray' href='/rewards'>
                  Rewards
                </a>
                <a className='text-gray' href='/faq'>
                  FAQ
                </a>
                <a className='text-gray' href='/tos'>
                  Terms of Service
                </a>
                <a className='text-gray' href='/privacypolicy'>
                  Privacy Policy
                </a>
                <a className='text-gray' href='/support'>
                  Support
                </a>
              </div>
            </div>

            <div className='column flex column items-start gap-4'>
              <div className='title font-9 text-bold'>Games</div>

              <div className='flex column text-left gap-2'>
                <a className='text-gray' href='/coinflip'>
                  Coinflip
                </a>
                <a className='text-gray' href='/unboxing'>
                  Unboxing
                </a>
                <a className='text-gray' href='/casebattle'>
                  Case Battle
                </a>
                <a className='text-gray' href='/plinko'>
                  Plinko
                </a>
              </div>
            </div>

            <div className='column flex column items-start gap-4'>
              <div className='title font-9 text-bold'>Social Medias</div>

              <div className='flex column text-left gap-2'>
                <a
                  className='text-gray'
                  href='https://twitter.com'
                  target='_blank'
                >
                  <FontAwesomeIcon icon={faTwitter} className='w-[16px] mr-2' />
                  Twitter
                </a>
                <a
                  className='text-gray'
                  href='https://steam.com'
                  target='_blank'
                >
                  <FontAwesomeIcon
                    icon={faSteamSymbol}
                    className='w-[16px] mr-2'
                  />
                  Steam
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='footer-bottom flex justify-between items-center responsive gap-2 pt-2 bt-l2'>
          <div className='flex row items-center gap-4'>
            <div className='bg-main-transparent pt-1 pb-1 pr-2 pl-2 rounded-0 text-bold'>
              +18
            </div>
            <div className='text-gray'>
              © 2024 Crazycargo.gg. All rights reserved.
            </div>
          </div>

          <img src='/imgs/fair.png' />
        </div>
      </div>
    </div>
  );
};

export default Footer;
