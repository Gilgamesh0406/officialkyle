import React from 'react';
import CaseBattleModeButton from '../pages/casebattle/create/CaseBattleModeButton';
import BattleTypeSection from '../pages/casebattle/create/BattleTypeSection';
import ToggleSwitch from '@/components/pages/casebattle/create/ToggleSwitch';
interface FormData {
  privacy: boolean;
  crazy: boolean;
  mode: number;
}

type Props = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: FormData;
  setFormData: (f: FormData) => void;
};

function CaseBattleCreateMode({ onChange, formData, setFormData }: Props) {
  const updateMode = (mode: number) => {
    setFormData({
      ...formData,
      mode: mode,
    });
  };
  return (
    <div className='flex row responsive justify-between items-center gap-2 width-full p-2 mt-2 bg-light b-d2 rounded-1'>
      <div className='flex row gap-4'>
        <BattleTypeSection title='STANDARD BATTLE'>
          <CaseBattleModeButton
            mode={0}
            currentMode={formData.mode}
            onClick={updateMode}
          >
            1v1
          </CaseBattleModeButton>
          <CaseBattleModeButton
            mode={1}
            currentMode={formData.mode}
            onClick={updateMode}
          >
            1v1v1
          </CaseBattleModeButton>
          <CaseBattleModeButton
            mode={2}
            currentMode={formData.mode}
            onClick={updateMode}
          >
            1v1v1v1
          </CaseBattleModeButton>
        </BattleTypeSection>
        <BattleTypeSection title='TEAM BATTLE'>
          <CaseBattleModeButton
            mode={3}
            currentMode={formData.mode}
            onClick={updateMode}
          >
            2v2
          </CaseBattleModeButton>
        </BattleTypeSection>
      </div>

      <div className='flex row items-center gap-6'>
        <ToggleSwitch
          title='PRIVACY'
          description='Game privacy settings'
          name='privacy'
          checked={formData.privacy}
          onChange={onChange}
        />
        <ToggleSwitch
          title='CRAZY MODE'
          description='Select your Case Battle mode'
          name='crazy'
          checked={formData.crazy}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default CaseBattleCreateMode;
