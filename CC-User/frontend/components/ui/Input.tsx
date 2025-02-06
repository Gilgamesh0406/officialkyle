'use client';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, useEffect, useState } from 'react';

const Input = ({
  label,
  value,
  name,
  type,
  dropdownData,
  onSelect,
  onInput,
  activeVal,
  extra,
}: {
  label?: string;
  value: string;
  name: string;
  type?: string;
  dropdownData?: { value: string }[];
  onSelect?: (value: string, name?: string) => void;
  activeVal?: string;
  onInput?: (e: ChangeEvent<HTMLInputElement>) => void;
  extra?: React.ReactNode;
}) => {
  useEffect(() => {
    const allInput = document.querySelectorAll('.field_element_input');
    if (allInput) {
      allInput.forEach((input) => {
        input.addEventListener('focus', () => {
          input.parentElement
            ?.querySelector('.field_label')
            ?.classList.add('active');
        });
        input.addEventListener('blur', (e: any) => {
          if (e.target.value.length > 0) {
            return;
          }
          input.parentElement
            ?.querySelector('.field_label')
            ?.classList.remove('active');
        });
      });
    }
  }, []);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const onDropdown = () => {
    if (dropdownData && !dropdownOpen) {
      setDropdownOpen(true);
    }
  };
  return (
    <div onClick={onDropdown} className='field_container'>
      <div className='field_content'>
        <input
          type={type}
          className='field_element_input'
          id={name}
          value={value}
          name={name}
          onInput={onInput || undefined}
          onChange={onInput}
        />

        {dropdownData && onSelect && (
          <>
            <div className='field_dropdown'>{activeVal}</div>
            <div
              className={`field_element_dropdowns ${
                dropdownOpen ? 'active' : ''
              }`}
            >
              {dropdownData.map((dropdownValue: any, index: number) => {
                if (dropdownValue.value === activeVal) {
                  return (
                    <div
                      onClick={() => {
                        onSelect(dropdownValue.value, name);
                        setDropdownOpen(false);
                      }}
                      className={`field_element_dropdown ${
                        activeVal === dropdownValue.value ? 'active' : ''
                      }`}
                      key={index}
                    >
                      {dropdownValue.value}
                    </div>
                  );
                }
                return null;
              })}
              {dropdownData.map((dropdownValue: any, index: number) => {
                if (dropdownValue.value !== activeVal) {
                  return (
                    <div
                      onClick={() => {
                        onSelect(dropdownValue.value, name);
                        setDropdownOpen(false);
                      }}
                      className={`field_element_dropdown ${
                        activeVal === dropdownValue.value ? 'active' : ''
                      }`}
                      key={index}
                    >
                      {dropdownValue.value}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </>
        )}
        {label && (
          <div
            className={`field_label transition-all ${
              (dropdownData || value.length > 0) && 'active'
            } `}
          >
            {label}
          </div>
        )}
      </div>
      {dropdownData && (
        <div className='field_extra'>
          <div className='field_caret'>
            <FontAwesomeIcon icon={faCaretDown} className='w-[16px]' />
          </div>
        </div>
      )}
      {extra && <div className='field_extra flex gap-1 flex-wrap'>{extra}</div>}
    </div>
  );
};

export default Input;
