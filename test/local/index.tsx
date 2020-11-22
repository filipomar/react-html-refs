import React from 'react';
import { render } from 'react-dom';
import { ScrollerBuilderKey, useScrollDestination, ScrollDestinations, ScrollDestination } from '../../src/infrastructure';

type ScrollId = 'Anakin' | 'Kenobi' | 'Yoda';

const Button = ({
    scrollId,
    scrollMode,
    ...others
}: { scrollId: ScrollId; scrollMode?: ScrollerBuilderKey } & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>): JSX.Element => {
    const { scroll } = useScrollDestination<ScrollId>(scrollId);
    return <button {...others} onClick={() => scroll(scrollMode)} />;
};

const css = `
    html, body { margin: 0; }
    button { margin: 5px; }
`;

render(
    <ScrollDestinations scrollers={['scrollIntoView']}>
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
            <Button scrollId="Anakin">Kill younglings</Button>
            <Button scrollId="Yoda" scrollMode="scrollIntoCenteredView">
                Get Addicted to ketamine
            </Button>
            <Button scrollId="Anakin">Do the most war crimes</Button>
            <Button scrollId="Anakin">Be a space fascist</Button>
            <Button scrollId="Kenobi">Have the highground</Button>
        </div>
    </ScrollDestinations>,
    document.querySelector('#app'),
);
