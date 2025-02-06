'use client';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, useEffect, useState, useCallback } from 'react';
import Input from '../ui/Input';
import { CaseBattleCase, SelectedCasesType } from '@/lib/client/types';
import CaseItem from '../pages/casebattle/create/CaseItem';
import ReactDOM from 'react-dom';

/**
 * A modal component that allows the user to select cases for a battle.
 *
 * @param isOpen - A boolean indicating whether the modal is open or not.
 * @param setIsOpen - A function to set the open state of the modal.
 * @param cases - An array of `CaseBattleCase` objects representing the available cases.
 * @param selectedCases - An object mapping case IDs to the number of cases selected.
 * @param onCountChange - A function to be called when the user changes the number of a selected case.
 * @param total - The total cost of the selected cases.
 */
const CreateBattleModal = ({
  isOpen,
  setIsOpen,
  cases,
  selectedCases,
  onCountChange,
  total,
}: {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
  cases: CaseBattleCase[];
  selectedCases: SelectedCasesType;
  onCountChange: (id: string, value: number) => void;
  total: number;
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    search: '',
    orderBy: 'Name A-Z',
  });
  const [filteredCases, setFilteredCases] = useState<CaseBattleCase[]>(cases);

  const onInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const onSelect = useCallback((value: string, name?: string) => {
    if (name) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  }, []);

  useEffect(() => {
    const searchLower = formData.search.toLowerCase();
    const sortedCases = [...cases]
      .filter((cs) => cs.name.toLowerCase().includes(searchLower))
      .sort((a, b) => {
        switch (formData.orderBy) {
          case 'Name A-Z':
            return a.name.localeCompare(b.name);
          case 'Name Z-A':
            return b.name.localeCompare(a.name);
          case 'Price descending':
            return b.price - a.price;
          default:
            return 0;
        }
      });

    setFilteredCases(sortedCases);
  }, [formData, cases]);

  return ReactDOM.createPortal(
    <div
      className={`modal large active ${isOpen ? 'opacity-100 z-[999]' : 'opacity-0 z-[-999]'}`}
      onClick={() => setIsOpen(false)} // Close modal on overlay click
    >
      <div
        className='modal-dialog flex justify-center items-center'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='modal-content rounded-1'>
          <div className='modal-header flex items-center justify-between'>
            <div className='modal-title text-upper'>Select Cases</div>
            <div
              onClick={() => setIsOpen(false)}
              className='modal-close flex justify-center items-center rounded-0'
              data-modal='hide'
              aria-label='Close modal'
            >
              <FontAwesomeIcon icon={faTimes} className='w-[16px]' />
            </div>
          </div>
          <div className='modal-body font-8'>
            <div className='flex column gap-2 overflow-h'>
              <div className='flex row responsive justify-between gap-2 bg-light p-2'>
                <div className='flex column justify-between gap-2'>
                  <div className='text-color text-bold'>TOTAL COST</div>
                  <div className='text-bold font-8'>
                    <div className='coins mr-1'></div>
                    <span id='casebattle_add_total'>{total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  className='site-button purple'
                  id='casebattle_add_confirm'
                  onClick={() => setIsOpen(false)}
                >
                  Confirm
                </button>
              </div>
              <div className='flex row responsive gap-2'>
                <div
                  className='input_field bet_input_field transition-5'
                  data-border='#de4c41'
                >
                  <Input
                    label='Search Case'
                    name='search'
                    value={formData.search}
                    onInput={onInput}
                  />
                  <div className='field_bottom'></div>
                </div>
                <div className='dropdown_field transition-5'>
                  <Input
                    label='Order by'
                    name='orderBy'
                    value={formData.orderBy}
                    onSelect={onSelect}
                    activeVal={formData.orderBy}
                    dropdownData={[
                      { value: 'Name A-Z' },
                      { value: 'Name Z-A' },
                      { value: 'Price descending' },
                    ]}
                  />
                  <div className='field_bottom'></div>
                </div>
              </div>
              <div id='casebattle_add_list'>
                {filteredCases.length > 0 ? (
                  filteredCases.map((cs: CaseBattleCase) => (
                    <CaseItem
                      key={cs.id} // Use unique id instead of index
                      count={selectedCases[cs.id] || 0}
                      id={cs.id}
                      image={cs.image}
                      name={cs.name}
                      onCountChange={(n: number) => onCountChange(cs.id, n)}
                      price={cs.price}
                      active={true}
                    />
                  ))
                ) : (
                  <div>No cases found.</div> // Handle empty state
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateBattleModal;
