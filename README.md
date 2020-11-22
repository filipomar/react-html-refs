# react-html-refs
A collection of react hooks/providers to help you scroll by through life and focus on the right stuff.<br />

Tired of React Object Refs chains all-over your project?<br />
Tired of query selectors in a React app?<br />
Do you want to focus on a html input across the application or scroll the user to a specific element? Yeah, me neither<br />

Well this project is for you!<br />

With the code below you can manage all your scrolling/html needs, just:
- Wrap your React app in a `Destinations` provider, with your base scrollers and loggers
- Use the `useDestination` hook or `Destination` component to register html element destinations
- Use `useDestination` to apply code to your registered destinations

See the example:

```tsx
import React from 'react';
import { render } from 'react-dom';

import { useDestination, Destinations, Destination, Handler, chain, DebugLogger, silence, wrapUnknown } from 'react-html-refs';

type DestinationType = 'A';
type HandlerCategory = 'Focus' | 'Scroll';

const App = (): JSX.Element => {
    const { handle } = useDestination<DestinationType, HandlerCategory>('A');

    return (
        <>
            <Destination<DestinationType> destinationId="A">I am a destination</Destination>
            <button onClick={() => handle(wrapUnknown((el) => el.scrollIntoView({ behavior: 'smooth' })))}>Scroll!</button>
            <button onClick={() => handle('Focus')}>Scroll!</button>
        </>
    );
};

render(
    <Destinations<HandlerCategory>
        defaulHandler={chain(
            silence(wrapUnknown((el) => el.scrollIntoView({ behavior: 'smooth' }))),
            silence(wrapUnknown((el) => el.scrollTo({ behavior: 'smooth' }))),
            wrapUnknown((el) => window.scrollTo(0, el.offsetTop)),
        )}
        handlers={{
            Scroll: wrapUnknown((el) => window.scrollTo(0, el.offsetTop)),
            Focus: wrapUnknown((el) => el.focus()),
        }}
        logger={new DebugLogger()}
    >
        <App />
    </Destinations>,
    document.querySelector('#app'),
);
```

You can even type your ids, to ensure they are properly used and referenced every where.
