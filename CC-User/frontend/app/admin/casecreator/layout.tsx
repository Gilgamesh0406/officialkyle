const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex column gap-1'>
      <div className='flex column gap-2 bg-dark-transparent bb-d2 p-2'>
        <div className='flex justify-between responsive gap-2 bb-l2 pb-2'>
          <div className='flex row gap-2'>
            <a href='/admin/casecreator/create/cases'>
              <button className='site-button black active'>Cases</button>
            </a>
            <a href='/admin/casecreator/create/dailycases'>
              <button className='site-button black '>Daily Cases</button>
            </a>
          </div>

          <a href='/admin/casecreator/edit'>
            <button className='site-button purple'>Edit Cases</button>
          </a>
        </div>
      </div>
      {children}
    </div>
  );
};

export default layout;
