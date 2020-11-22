# react-scrollhooks
React hooks to help us scroll by through life<br />

Tired of React Object Refs chains through your project?<br />
Tired of query selectors in a React app?<br />

Well this project is for you!<br />

With the code below you can manage all your scrolling needs, just:
- Wrap your React app in a `ScrollDestinations` provider, with your base scrollers and loggers
- Use the `useScrollDestination` hook or `ScrollDestination` component to register scroll destinations
- Use `useScrollDestination` to scroll to the destinations

```tsx
import React from 'react';
import { render } from 'react-dom';

import { useScrollDestination, ScrollDestinations, ScrollDestination, Scroller, chain, DebugLogger, silence, wrapUnknown } from 'react-scrollhooks';

type ScrollId = 'A';

const Button: FC<{ scrollId: ScrollId; scroller?: Scroller }> = ({ scrollId, scroller, ...others }) => {
    const { scroll } = useScrollDestination<ScrollId>(scrollId);
    return <button {...others} onClick={() => scroll(scroller)} />;
};

render(
    <ScrollDestinations
        scroller={chain(
            silence(wrapUnknown((el) => el.scrollIntoView({ behavior: 'smooth' }))),
            silence(wrapUnknown((el) => el.scrollTo({ behavior: 'smooth' }))),
            wrapUnknown((el) => window.scrollTo(0, el.offsetTop)),
        )}
        logger={new DebugLogger()}
    >
        <ScrollDestination<ScrollId> scrollId="A">I am a destination</ScrollDestination>
        <Button scrollId="A" scroller={wrapUnknown((el) => el.scrollIntoView({ behavior: 'smooth' }))}>Scroll!</Button>
    </ScrollDestinations>,
    document.querySelector('#app'),
);
```

You can even type your ids, to ensure they are properly used and referenced every where.
