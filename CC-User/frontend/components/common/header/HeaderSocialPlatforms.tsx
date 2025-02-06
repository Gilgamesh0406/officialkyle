import { faSteamSymbol, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

const HeaderSocialPlatforms = () => {
  return (
    <div className='inline-block ml-2 translate-y-1'>
      <div className='inline-block mr-1'>
        <Link href='https://twitter.com' target='_blank'>
          <FontAwesomeIcon icon={faTwitter} className='text-[26px]' />
        </Link>
      </div>
      <div className='inline-block mr-1'>
        <Link href='https://steam.com' target='_blank'>
          <FontAwesomeIcon icon={faSteamSymbol} className='text-[26px]' />
        </Link>
      </div>
    </div>
  );
};

export default HeaderSocialPlatforms;
