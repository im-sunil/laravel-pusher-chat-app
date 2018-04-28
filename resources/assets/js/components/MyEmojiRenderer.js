import React from 'react';
import Emoji from 'react-emoji-render';

const MyEmojiRenderer = ({children, ...rest}) => {
  const options = {
    baseUrl: "/emojione_64",
    ext: 'png'
  };

  return (
    <Emoji options={options} {...rest} />
  );
}

export default MyEmojiRenderer;

