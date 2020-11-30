import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Cross-origin iframe', module).add('Single story', () => {
  return <iframe width='100%' height='100%' src="http://localhost:7373/cors_frames/cors.hbs"></iframe>
})
