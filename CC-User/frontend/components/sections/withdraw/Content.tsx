import Link from "next/link";

const WithdrawContent = () => {
  return (
    <div className='flex column width-full'>
      <div className='wrapper-page flex row'>
        <div className='flex column height-full width-full overflow-a p-2 gap-4 text-left'>
          <div>
            <div className='offers-options-name'>Withdraw with Steam</div>

            <div className='offers-options mt-2'>
              <Link className='' href='/withdraw/steam/csgo'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/csgo_shop.png?v=1714494291'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    CSGO
                  </div>
                </div>
              </Link>
              <Link className='' href='/withdraw/steam/dota2'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/dota2_shop.png?v=1714494291'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    DOTA2
                  </div>
                </div>
              </Link>
              <Link className='' href='/withdraw/steam/tf2'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/tf2_shop.png?v=1714494291'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    TF2
                  </div>
                </div>
              </Link>
              <Link className='' href='/withdraw/steam/rust'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/rust_shop.png?v=1714494291'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    RUST
                  </div>
                </div>
              </Link>
              <Link className='' href='/withdraw/steam/h1z1'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/h1z1_shop.png?v=1714494291'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    H1Z1
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div>
            <div className='offers-options-name'>Withdraw with P2P</div>

            <div className='offers-options mt-2'>
              <Link className='' href='/withdraw/p2p/csgo'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/csgo_shop.png?v=1714494291'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    CSGO
                  </div>
                </div>
              </Link>
              <Link className='' href='/withdraw/p2p/dota2'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/dota2_shop.png?v=1714494291'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    DOTA2
                  </div>
                </div>
              </Link>
              <Link className='' href='/withdraw/p2p/tf2'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/tf2_shop.png?v=1714494291'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    TF2
                  </div>
                </div>
              </Link>
              <Link className='' href='/withdraw/p2p/rust'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/rust_shop.png?v=1714494291'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    RUST
                  </div>
                </div>
              </Link>
              <Link className='' href='/withdraw/p2p/h1z1'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/h1z1_shop.png?v=1714494291'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    H1Z1
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div>
            <div className='offers-options-name'>
              Withdraw with Cryptocurrency
            </div>

            <div className='offers-options mt-2'>
              <Link className='' href='/withdraw/crypto/btc'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/btc_shop.png?v=1714736884'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    Bitcoin (BTC)
                  </div>
                </div>
              </Link>
              <Link className='' href='/withdraw/crypto/eth'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/eth_shop.png?v=1714736884'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    Ethereum (ETH)
                  </div>
                </div>
              </Link>
              <Link className='' href='/withdraw/crypto/ltc'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/ltc_shop.png?v=1714736884'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    Litecoin (LTC)
                  </div>
                </div>
              </Link>
              <Link className='' href='/withdraw/crypto/bch'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/bch_shop.png?v=1714736884'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    Bitcoin Cash (BCH)
                  </div>
                </div>
              </Link>
              <Link className='' href='/withdraw/crypto/usdc'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/usdc_shop.png?v=1714736884'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    USD Coin (USDC)
                  </div>
                </div>
              </Link>
              <Link className='' href='/withdraw/crypto/usdt'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/usdt_shop.png?v=1714736884'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    Tether (USDT)
                  </div>
                </div>
              </Link>
              <Link className='' href='/withdraw/crypto/doge'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/doge_shop.png?v=1714736884'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    Dogecoin (DOGE)
                  </div>
                </div>
              </Link>
              <Link className='' href='/withdraw/crypto/xrp'>
                <div className='offers-option p-2 rounded-2'>
                  <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                    <img
                      className='offers-option-image'
                      src='/imgs/methods/xrp_shop.png?v=1714736884'
                    />
                  </div>

                  <div className='offers-option-name flex justify-center items-center'>
                    Ripple (XRP)
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawContent;
