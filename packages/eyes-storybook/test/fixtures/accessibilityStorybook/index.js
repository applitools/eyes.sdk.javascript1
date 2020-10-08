import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Single category', module).add('Story with local accessibility region', () => {
  return <div className="accessibility-element" style={{width: 50, height: 50}}>single story</div>
  }, { eyes: { accessibilityRegions: [{selector: '.accessibility-element', accessibilityType: 'LargeText'}]}})
