import React from 'react';
import { render } from 'react-dom';
import { useScrollDestination, ScrollDestinations, ScrollDestination, Scroller, chain, DebugLogger, silence, wrapUnknown } from '../../src/infrastructure';

type ScrollId = 'Anakin' | 'Kenobi' | 'Yoda';

const Button = ({
    scrollId,
    scroller,
    ...others
}: { scrollId: ScrollId; scroller?: Scroller } & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>): JSX.Element => {
    const { scroll } = useScrollDestination<ScrollId>(scrollId);
    return <button {...others} onClick={() => scroll(scroller)} />;
};

const css = `
    html, body { margin: 0; }
    button { margin: 5px; }
`;

render(
    <ScrollDestinations
        scroller={chain(
            silence(wrapUnknown((el) => el.scrollIntoView({ behavior: 'smooth' }))),
            silence(wrapUnknown((el) => el.scrollTo({ behavior: 'smooth' }))),
            wrapUnknown((el) => window.scrollTo(0, el.offsetTop)),
        )}
        logger={new DebugLogger()}
    >
        <style type="text/css">{css}</style>
        <div style={{ backgroundColor: 'red', padding: '30vh 0', textAlign: 'center' }}>
            <ScrollDestination<ScrollId> scrollId="Anakin">I killed them all</ScrollDestination>
        </div>
        <div style={{ backgroundColor: 'blue', padding: '30vh 0', textAlign: 'center' }}>
            <ScrollDestination<ScrollId> scrollId="Kenobi">I am space jesus</ScrollDestination>
        </div>
        <div style={{ backgroundColor: 'green', padding: '30vh 0', textAlign: 'center' }}>
            <ScrollDestination<ScrollId> scrollId="Yoda">Got any of that ketamine bro?</ScrollDestination>
        </div>
        <div style={{ backgroundColor: 'yellow', padding: '20px', textAlign: 'center' }}>
            <Button scrollId="Anakin" scroller={wrapUnknown((el) => el.scrollIntoView({ behavior: 'smooth' }))}>
                Kill younglings
            </Button>
            <Button scrollId="Yoda">Get Addicted to ketamine</Button>
            <Button scrollId="Anakin">Do the most war crimes</Button>
            <Button scrollId="Anakin">Be a space fascist</Button>
            <Button scrollId="Kenobi">Have the highground</Button>
        </div>
    </ScrollDestinations>,
    document.querySelector('#app'),
);
