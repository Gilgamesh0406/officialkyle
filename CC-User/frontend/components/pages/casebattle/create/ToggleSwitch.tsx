interface ToggleSwitchProps {
  title: string;
  description: string;
  name: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const ToggleSwitch = ({
  title,
  description,
  name,
  checked,
  onChange,
}: ToggleSwitchProps) => (
  <div className='flex column justify-between items-start gap-2'>
    <div className='flex column items-start'>
      <div className='text-color text-bold'>{title}</div>
      <div className='text-left text-gray font-6'>{description}</div>
    </div>
    <div className='switch_field transition-5 mb-0'>
      <div className='field_container'>
        <div className='field_content'>
          <input
            type='checkbox'
            className='field_element_input admin_switch_settings !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
            name={name}
            onChange={onChange}
            checked={checked}
            id={`casebattle_set_${name}`}
          />
          <div className='field_switch'>
            <div
              className={`field_switch_bar ${checked ? '!bg-green-400' : '!bg-red-500 before:!left-0'}`}
            ></div>
          </div>
          <div className='field_label active transition-5'>{title}</div>
        </div>
        <div className='field_extra'></div>
      </div>
      <div className='field_bottom'></div>
    </div>
  </div>
);

export default ToggleSwitch;
