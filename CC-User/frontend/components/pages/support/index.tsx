'use client';
import Input from '@/components/ui/Input';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import axios from 'axios';

const dropdownList = [
  'General / Others',
  'Bug report',
  'Trade offer issue',
  'Improvements / Ideas',
  'Marketing / Partnership',
  'Ranking up',
];
const SupportPage = () => {
  const [formValues, setFormValues] = useState({
    title: '',
    department: 0,
    message: '',
    image: '',
  });

  const [errors, setErrors] = useState({
    title: false,
    message: false,
  });

  const [tickets, setTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'opened' | 'closed'>(
    'all'
  );
  const [activeIndex, setActiveIndex] = useState(-1);
  const [reply, setReply] = useState('');
  const [replyImage, setReplyImage] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Fetch tickets from the backend
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
        setFilteredTickets(data); // Initially display all tickets
      } else {
        alert('Failed to fetch tickets.');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      alert('An error occurred while loading tickets.');
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets based on status
  const filterTickets = async (status: 'all' | 'opened' | 'closed') => {
    await fetchTickets();
    setFilterStatus(status);
    switch (status) {
      case 'closed':
        setFilteredTickets(tickets.filter((ticket) => ticket.closed === true));
        break;
      case 'opened':
        setFilteredTickets(tickets.filter((ticket) => ticket.closed === false));
        break;
      default:
        setFilteredTickets(tickets);
        break;
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    setReply('');
  }, [activeIndex]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleReplyChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setReply(e.target.value);
  };

  const handleDropdownSelect = (value: string) => {
    setFormValues({
      ...formValues,
      department: dropdownList.findIndex((v) => v === value),
    });
  };

  const validateForm = () => {
    const newErrors = {
      title: !formValues.title.trim(),
      message: formValues.message.trim().length < 10,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        alert('Ticket created successfully!');
        setFormValues({
          title: '',
          department: 0,
          message: '',
          image: '',
        });
        fetchTickets(); // Refresh the ticket list
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to create ticket'}`);
      }
    } catch (error) {
      alert(
        'An error occurred while creating the ticket. Please try again later.'
      );
    }
  };

  const handleCloseTicket = async (id: number) => {
    try {
      const response = await fetch('/api/tickets/close', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supportid: id,
        }),
      });

      if (response.ok) {
        toast.success('Successfuly closed.');
        fetchTickets(); // Refresh the ticket list
      } else {
        toast.error('Failed to close');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to close');
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadError('');

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/support/upload', formData);
      setReplyImage(response.data.filename);
    } catch (err: any) {
      setUploadError(err.response?.data?.error || 'Error uploading image');
      toast.error(err.response?.data?.error || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSendReply = async (id: number) => {
    try {
      const response = await fetch('/api/tickets/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supportid: id,
          message: reply,
          image: replyImage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Successfully replied.');
        let tmpTickets = [...filteredTickets];
        const index = tmpTickets.findIndex(
          (v) => parseInt(v.id) === parseInt(data.supportid)
        );
        tmpTickets[index].messages.push(data);
        setFilteredTickets(tmpTickets);
        setReply('');
        setReplyImage('');
      } else {
        toast.error('Failed to reply');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to reply');
    }
  };

  const handleNewTicketImageUpload = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadError('');

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/support/upload', formData);
      setFormValues((prev) => ({ ...prev, image: response.data.filename }));
    } catch (err: any) {
      setUploadError(err.response?.data?.error || 'Error uploading image');
      toast.error(err.response?.data?.error || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='grid split-column-2 gap-2 responsive p-2'>
      {/* Left Panel */}
      <div className='flex column gap-2'>
        <div className='flex justify-between items-center responsive bg-dark rounded-0 p-2'>
          <div className='text-bold text-left font-10 mb-2'>Ticket</div>
          <div className='flex row gap-2'>
            <button
              className={`site-button black support-open ${
                filterStatus === 'all' ? 'active' : ''
              }`}
              onClick={() => filterTickets('all')}
            >
              All{' '}
              <div className='inline-block bg-main-transparent rounded-0 pl-1 pr-1 ml-2'>
                {tickets.length}
              </div>
            </button>
            <button
              className={`site-button black support-open ${
                filterStatus === 'opened' ? 'active' : ''
              }`}
              onClick={() => filterTickets('opened')}
            >
              Opened{' '}
              <div className='inline-block bg-main-transparent rounded-0 pl-1 pr-1 ml-2'>
                {tickets.filter((ticket) => ticket.closed === false).length}
              </div>
            </button>
            <button
              className={`site-button black support-open ${
                filterStatus === 'closed' ? 'active' : ''
              }`}
              onClick={() => filterTickets('closed')}
            >
              Closed{' '}
              <div className='inline-block bg-main-transparent rounded-0 pl-1 pr-1 ml-2'>
                {tickets.filter((ticket) => ticket.closed === true).length}
              </div>
            </button>
          </div>
        </div>
        <div className='support-content flex column rounded-0 overflow-h'>
          {loading ? (
            <div className='text-center p-4 font-8 history_message'>
              Loading tickets...
            </div>
          ) : filteredTickets.length > 0 ? (
            <div className='fair-grid width-full overflow-h'>
              {filteredTickets.map((ticket, idx) => (
                <div
                  className={`fair-category transition-2 ${activeIndex === idx ? 'active' : ''}`}
                >
                  <div
                    key={ticket.id}
                    className='p-4 pointer'
                    onClick={() =>
                      setActiveIndex(activeIndex === idx ? -1 : idx)
                    }
                  >
                    <div className='flex justify-between'>
                      <div className='text-left'>
                        <span className='mr-2 text-gray'>#{ticket.id}</span>
                        {ticket.title}
                      </div>
                      <div className='text-right'>
                        <span>
                          {new Date(parseInt(ticket.time)).toLocaleString(
                            'en-US',
                            {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            }
                          )}
                        </span>
                        <span
                          className={`ml-2 ${ticket.closed ? 'text-danger' : 'text-success'}`}
                        >
                          {ticket.closed ? 'Closed' : 'Opened'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='description overflow-h pr-4 pl-4'>
                    <div className='flex column gap-2'>
                      <div className='flex column'>
                        <div className='flex column gap-2'>
                          <div className='bg-dark rounded-1 p-2 text-left mb-4'>
                            <div className='flex justify-content'>
                              <div>
                                <p>
                                  Department:
                                  <span className='ml-2 text-danger'>
                                    {dropdownList[parseInt(ticket.department)]}
                                  </span>
                                </p>
                                <p>
                                  Staff Name:
                                  <span className='ml-2 text-success'>
                                    Administrator
                                  </span>
                                </p>
                              </div>
                              {!ticket.closed ? (
                                <button
                                  className='site-button purple w-[120px] ml-auto'
                                  onClick={() =>
                                    handleCloseTicket(parseInt(ticket.id))
                                  }
                                >
                                  CLOSE TICKET
                                </button>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                          {ticket.messages.map((message: any) => (
                            <div>
                              <div className='flex justify-content'>
                                <div className='flex w-full'>
                                  <img
                                    className='icon-medium rounded-full'
                                    src={message.avatar}
                                    alt={'avatar' + message.id}
                                  />
                                  <div className='pl-2'>{message.name}</div>
                                </div>
                                <div className='w-full text-right'>
                                  <span>
                                    {new Date(
                                      parseInt(message.time)
                                    ).toLocaleString('en-US', {
                                      day: '2-digit',
                                      month: 'long',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true,
                                    })}
                                  </span>
                                </div>
                              </div>

                              <div className='bg-dark rounded-1 p-2 ml-6 mt-2 text-left mb-4'>
                                {message.message}
                                {message.image && (
                                  <div className='mt-2'>
                                    <img
                                      src={message.image}
                                      alt='Ticket attachment'
                                      className='object-cover rounded-md'
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {!ticket.closed ? (
                            <div className='flex column gap-2 pb-4'>
                              <div className='flex justify-content'>
                                <div
                                  className='input_field transition-5 flex-1'
                                  data-border='#de4c41'
                                >
                                  <Input
                                    label='Reply to Ticket'
                                    name='reply'
                                    value={reply}
                                    onInput={handleReplyChange}
                                  />
                                </div>
                                <div className='flex items-center gap-2 pl-2'>
                                  <label className='relative cursor-pointer'>
                                    <input
                                      type='file'
                                      accept='image/*'
                                      onChange={handleImageUpload}
                                      className='hidden'
                                      disabled={uploading}
                                    />
                                    <div className='site-button black p-2'>
                                      {uploading ? (
                                        <span className='loading loading-spinner loading-sm'></span>
                                      ) : (
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          className='h-5 w-5'
                                          fill='none'
                                          viewBox='0 0 24 24'
                                          stroke='currentColor'
                                        >
                                          <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                                          />
                                        </svg>
                                      )}
                                    </div>
                                  </label>
                                  <button
                                    className='site-button purple w-[80px]'
                                    onClick={() =>
                                      handleSendReply(parseInt(ticket.id))
                                    }
                                    disabled={uploading}
                                  >
                                    REPLY
                                  </button>
                                </div>
                              </div>

                              {uploadError && (
                                <div className='text-danger text-sm'>
                                  {uploadError}
                                </div>
                              )}

                              {replyImage && (
                                <div className='relative w-32 h-32 mt-2'>
                                  <img
                                    src={replyImage}
                                    alt='Upload preview'
                                    className='object-cover rounded-md'
                                  />
                                  <button
                                    type='button'
                                    onClick={() => setReplyImage('')}
                                    className='absolute -top-2 -right-2 bg-danger rounded-full p-1 hover:opacity-80'
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center p-4 font-8 history_message'>
              No tickets found for this filter.
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div>
        <div className='bg-dark rounded-0 p-2'>
          <div className='text-bold text-left font-10 mb-2'>New Ticket</div>
          <form
            className='form_support flex column gap-2'
            onSubmit={handleSubmit}
          >
            {/* Title Input */}
            <div className='input_field transition-5' data-border='#de4c41'>
              <Input
                label='Ticket Title'
                name='title'
                value={formValues.title}
                onInput={handleInputChange}
              />
              {errors.title && (
                <div className='field_bottom'>
                  <div className='field_error active' data-error='required'>
                    This field is required
                  </div>
                </div>
              )}
            </div>

            {/* Department Dropdown */}
            <div className='dropdown_field transition-5 width-full'>
              <Input
                label='Department'
                name='department'
                dropdownData={[
                  { value: 'General / Others' },
                  { value: 'Bug report' },
                  { value: 'Trade offer issue' },
                  { value: 'Improvements / Ideas' },
                  { value: 'Marketing / Partnership' },
                  { value: 'Ranking up' },
                ]}
                activeVal={dropdownList[formValues.department]}
                onSelect={handleDropdownSelect}
                value=''
              />
            </div>

            {/* Message Textarea */}
            <div className='input_field transition-5' data-border='#de4c41'>
              <div className='field_container'>
                <textarea
                  className='field_element_input'
                  name='message'
                  value={formValues.message}
                  onChange={handleInputChange}
                />
                <div className='field_label transition-5'>Ticket Message</div>
              </div>
              {errors.message && (
                <div className='field_bottom'>
                  <div
                    className='field_error active'
                    data-error='minimum_10_characters'
                  >
                    This field must be at least 10 characters long
                  </div>
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div className='input_field transition-5'>
              <div className='field_container'>
                <div className='flex items-center gap-2'>
                  <label className='relative cursor-pointer flex-1'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleNewTicketImageUpload}
                      className='hidden'
                      disabled={uploading}
                    />
                    <div className='site-button black w-full flex items-center justify-center gap-2 p-2'>
                      {uploading ? (
                        <span className='loading loading-spinner loading-sm'></span>
                      ) : (
                        <>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                            />
                          </svg>
                          Attach Image
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {uploadError && (
              <div className='text-danger text-sm mb-4'>{uploadError}</div>
            )}

            {formValues.image && (
              <div className='relative w-32 h-32 mb-4'>
                <img
                  src={formValues.image}
                  alt='Upload preview'
                  className='object-cover rounded-md w-full h-full'
                />
                <button
                  type='button'
                  onClick={() =>
                    setFormValues((prev) => ({ ...prev, image: '' }))
                  }
                  className='absolute -top-2 -right-2 bg-danger rounded-full p-1 hover:opacity-80'
                >
                  ✕
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button className='site-button purple width-full' type='submit'>
              SEND TICKET
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
