import React from 'react';
import { storiesOf } from '@storybook/react';
import WithScript from './withScript';
import './storybook.css';
import smurfs from '../smurfs.jpg';
import {wait, within, fireEvent} from '@testing-library/dom';

const isRTL = new URL(window.location).searchParams.get('eyes-variation') === 'rtl';

if (isRTL) {
  document.documentElement.setAttribute('dir', 'rtl')
}

const circular = {param: true}
circular.inner = circular

storiesOf('Button', module)
  .add('with text', () => (
    <div style={{position: 'relative'}}>with text
      <span style={{position: 'absolute', top: -20}} className="ignore-this">{Date.now()}</span>
      <span style={{position: 'absolute', top: -50}} className="ignore-this">{Date.now()}</span>
    </div>
  ), {
    someParam: 'i was here, goodbye',
    eyes: {
      ignoreRegions: [{selector: '.ignore-this'}]
    }
  })
  .add('with some emoji', () => (
    <div style={{position: 'relative'}} className="amit">😀 😎 👍 💯</div>
  ), { eyes: {circular} }); // do not fail this

storiesOf('Image', module)
  .add('image', () => (<React.Fragment>
    <img src="http://localhost:7272/smurfs.jpg" alt="cross origin url"/>
    <img src="smurfs.jpg" alt="relative url"/>
    <img src={smurfs} alt="imported image from code"/>
  </React.Fragment>));

storiesOf('Nested', module)
  .add('story 1', () => <div>story 1
      <span className="global-ignore-this">{Date.now()}</span>
      <span className="global-ignore-this">{Date.now()}</span>
    </div>);

storiesOf('Nested/Component', module)
  .add('story 1.1', () => <div>story 1.1</div>)
  .add('story 1.2', () => <div>story 1.2</div>);

storiesOf('Button with-space yes-indeed', module)
  .add('a yes-a b', () => (
    <div>with text</div>
  ))

storiesOf('Button with-space yes-indeed/nested with-space yes', module)
  .add('b yes-a b', () => <div>story 1.1</div>);

storiesOf('Button with-space yes-indeed/nested with-space yes/nested again-yes a', module)
  .add('c yes-a b', () => <div>story 1.1</div>);

storiesOf('SOME section|Nested/Component', module)
  .add('story 1.1', () => <div>story 1.1</div>)
  .add('story 1.2', () => <div>story 1.2</div>);

storiesOf('Wow|one with-space yes-indeed/nested with-space yes/nested again-yes a', module)
  .add('c yes-a b', () => <div>story 1.1</div>);

storiesOf('RTL', module)
  .add('should also do RTL', () => {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    return (<div>{isRTL ? 'rtl' : 'ltr'}</div>)
  })
  .add('local RTL config', () => {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    return (<div>{isRTL ? 'rtl' : 'ltr'}</div>)
  }, { eyes: {variations: ['rtl']}});

storiesOf('skipped tests', module)
  .add(
    'this story should not be checked visually by eyes-storybook because of local parameter',
    () => <div>this story should not be checked visually by eyes-storybook because of local parameter</div>,
    {eyes: {include: false}}
  )
  .add('[SKIP] this story should not be checked visually by eyes-storybook because of global config',
    () => <div>this story should not be checked visually by eyes-storybook because of global config</div>)

storiesOf('Text', module)
  .add(
    'appears after a delay',
    () =>
      <WithScript script={() => {
          window.setTimeout(() => {
            document.getElementById('delay').innerText = 'Now Ready - snapshot me!'
            document.getElementById('delay').className = 'ready'
          }, 1000)
        }}
      >
        <div id="delay">Not Ready - do not take snapshot!</div>
      </WithScript>,
    {eyes: {waitBeforeScreenshot: '.ready'}}
  );

storiesOf('Interaction', module)
  .add('Popover', () => <Popover />, {
    eyes: {
      runBefore({rootEl, story}) {
        rootEl.querySelector('.main').style.background = story.parameters.bgColor;
        fireEvent.click(within(rootEl).getByText('Open'))
        return wait(() => within(rootEl).getByText('Close'))
      }
    },
    bgColor: 'lime',
  })

storiesOf('Responsive UI', module)
  .add('Red/green', () =>
    <div style={{background: window.innerWidth < 1000 && window.innerHeight < 1000 ? 'lime' : 'red'}}>test should pass if background is lime</div>
  )

class Popover extends React.Component {
  state = {isOpen: false, transition: undefined};

  toggle = () => {
    if (this.state.transition) return;
    this.setState(({isOpen}) => ({transition: isOpen ? 'closing' : 'opening'}))
    setTimeout(() => {
      this.setState(({isOpen}) => ({isOpen: !isOpen, transition: undefined}))
    }, 1000)
  }

  render() {
    return <div>
      <button onClick={this.toggle} disabled={!!this.state.transition}>{this.state.transition || (this.state.isOpen ? 'Close' : 'Open')}</button>
      {this.state.isOpen && <div>I show up only after button is clicked</div>}
    </div>
  }
}
