# react-html-refs
React hooks to help us scroll by through life and focus on the right stuff<br />

Tired of React Object Refs chains through your project?<br />
Tired of query selectors in a React app?<br />
Do you want to focus on a html input across the application or scroll the user to a specific element?<br />

Well this project is for you!<br />

With the code below you can manage all your scrolling needs, just:
- Wrap your React app in a `Destinations` provider, with your base scrollers and loggers
- Use the `useDestination` hook or `Destination` component to register scroll destinations
- Use `useDestination` to scroll to the destinations

```tsx
import React from 'react';
import { render } from 'react-dom';

import { useDestination, Destinations, Destination, Handler, chain, DebugLogger, silence, wrapUnknown } from 'react-html-refs';

type ScrollId = 'A';

const Button: FC<{ scrollId: ScrollId; handlerOrCategory?: Handler | string }> = ({ scrollId, handlerOrCategory, ...others }) => {
    const { handle } = useDestination<ScrollId>(scrollId);
    return <button {...others} onClick={() => handle(handlerOrCategory)} />;
};

render(
    <Destinations
        scroller={chain(
            silence(wrapUnknown((el) => el.scrollIntoView({ behavior: 'smooth' }))),
            silence(wrapUnknown((el) => el.scrollTo({ behavior: 'smooth' }))),
            wrapUnknown((el) => window.scrollTo(0, el.offsetTop)),
        )}
        handlers={{
            Focus: wrapUnknown((el) => el.focus()),
        }}
        logger={new DebugLogger()}
    >
        <Destination<ScrollId> scrollId="A">I am a destination</Destination>
        <Button scrollId="A" handlerOrCategory={wrapUnknown((el) => el.scrollIntoView({ behavior: 'smooth' }))}>Scroll!</Button>
        <Button scrollId="A" handlerOrCategory="Focus">Scroll!</Button>
    </Destinations>,
    document.querySelector('#app'),
);
```

You can even type your ids, to ensure they are properly used and referenced every where.

## Future Improvements
- TODO Make this generic (to work with focus and other html actions)
- Add lint/prettier hooks
- TODO Review git hub repo config
- TODO Review npmignore files/and publish
