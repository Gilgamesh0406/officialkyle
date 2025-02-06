const Content = () => {
  return (
    <div className='flex column height-full width-full overflow-a p-2 gap-4 text-left'>
      <div>
        <div className='home-options-name'>Casino</div>
        <div className='home-options-description text-gray'>
          Enjoy casino games at the comforts of your home!
        </div>

        <div className='home-options medium mt-2'>
          <a className='disabled' href='/slots'>
            <div className='home-option p-2 rounded-2'>
              <div className='home-option-image-content slots rounded-1'></div>

              <div className='home-option-name flex justify-center items-center'></div>
              <div className='home-option-description flex justify-center items-center'></div>

              <div className='home-option-info font-5 pl-2 pr-2 pt-1 pb-1 rounded-1'></div>
            </div>
          </a>

          <a className='disabled' href='/match_betting'>
            <div className='home-option p-2 rounded-2'>
              <div className='home-option-image-content match_betting rounded-1'></div>

              <div className='home-option-name flex justify-center items-center'></div>
              <div className='home-option-description flex justify-center items-center'></div>

              <div className='home-option-info font-5 pl-2 pr-2 pt-1 pb-1 rounded-1'></div>
            </div>
          </a>
        </div>
      </div>

      <div>
        <div className='home-options-name1'>Originals</div>
        <div className='home-options-description text-gray'>
          Play one of our classic games!
        </div>

        <div className='home-options small mt-2'>
          <a href='/coinflip'>
            <div className='home-option p-2 rounded-2'>
              <div className='home-option-image-content coinflip rounded-1'></div>

              <div className='home-option-name flex justify-center items-center'>
                Coinflip
              </div>
              <div className='home-option-description flex justify-center items-center'>
                Fate on a toss
              </div>
            </div>
          </a>

          <a href='/unboxing'>
            <div className='home-option p-2 rounded-2'>
              <div className='home-option-image-content unboxing rounded-1'></div>

              <div className='home-option-name flex justify-center items-center'>
                Unboxing
              </div>
              <div className='home-option-description flex justify-center items-center'>
                Unveil the mystery
              </div>
            </div>
          </a>

          <a href='/casebattle'>
            <div className='home-option p-2 rounded-2'>
              <div className='home-option-image-content casebattle rounded-1'></div>

              <div className='home-option-name flex justify-center items-center'>
                Case Battle
              </div>
              <div className='home-option-description flex justify-center items-center'>
                Unveil the mystery
              </div>
            </div>
          </a>

          <a href='/plinko'>
            <div className='home-option p-2 rounded-2'>
              <div className='home-option-image-content plinko rounded-1'></div>

              <div className='home-option-name flex justify-center items-center'>
                Plinko
              </div>
              <div className='home-option-description flex justify-center items-center'>
                Bounce to win
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Content;
