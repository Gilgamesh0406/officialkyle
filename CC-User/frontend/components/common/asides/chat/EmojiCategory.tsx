import React from 'react';

type Props = {
  category: string[];
  title: string;
  onHandleEmoji: (s: string) => void;
};

export default function EmojiCategory({
  category,
  title,
  onHandleEmoji,
}: Props) {
  return (
    <div className='emojis-content m-2' key={title}>
      <div className='title-panel text-left rounded-0 p-1 mb-1'>{title}</div>
      <div className='flex flex-wrap justify-center'>
        {category.map((emoji) => (
          <img
            onClick={() => onHandleEmoji(emoji)}
            key={emoji}
            title={':' + emoji + ':'}
            data-emoji={':' + emoji + ':'}
            src={`/imgs/emojis/${emoji}${title === 'Gifs' ? '.gif' : '.png'}`}
          />
        ))}
      </div>
    </div>
  );
}
