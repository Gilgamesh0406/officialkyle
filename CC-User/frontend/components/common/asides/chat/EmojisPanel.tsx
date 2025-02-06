import React from 'react';
import EmojiCategory from './EmojiCategory';

type Props = {
  emojis: string[];
  pepe: string[];
  faces: string[];
  gifs: string[];
  messages: string[];
  emojiBarOpen: boolean;
  onHandleEmoji: (s: string) => void;
};

function EmojisPanel({
  emojis,
  pepe,
  faces,
  gifs,
  messages,
  emojiBarOpen,
  onHandleEmoji,
}: Props) {
  return (
    <div
      className={`${
        emojiBarOpen ? 'show-animation' : 'hide-animation'
      } emojis-panel text-center`}
    >
      {emojis.length > 0 && (
        <EmojiCategory
          category={emojis}
          title='Emojis'
          onHandleEmoji={onHandleEmoji}
        />
      )}
      {pepe.length > 0 && (
        <EmojiCategory
          category={pepe}
          title='Pepe'
          onHandleEmoji={onHandleEmoji}
        />
      )}
      {faces.length > 0 && (
        <EmojiCategory
          category={faces}
          title='Faces'
          onHandleEmoji={onHandleEmoji}
        />
      )}
      {gifs.length > 0 && (
        <EmojiCategory
          category={gifs}
          title='Gifs'
          onHandleEmoji={onHandleEmoji}
        />
      )}
      {messages.length > 0 && (
        <EmojiCategory
          category={messages}
          title='Messages'
          onHandleEmoji={onHandleEmoji}
        />
      )}
    </div>
  );
}

export default EmojisPanel;
