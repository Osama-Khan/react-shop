import React from 'react';
import P from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default function Popup({
  trigger,
  position = 'bottom center',
  content,
}) {
  return (
    <P trigger={trigger} position={position}>
      {content}
    </P>
  );
}
