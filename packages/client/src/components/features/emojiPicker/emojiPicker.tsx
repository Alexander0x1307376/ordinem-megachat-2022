import React, { useEffect, useRef } from "react";
import Picker, { SKIN_TONE_LIGHT } from 'emoji-picker-react';


const EmojiPicker: React.FC = () => {
  return (
    <Picker onEmojiClick={(e, data) => {
      console.log('onEmojiClick', data);
    }} />
  )
}

export default EmojiPicker;