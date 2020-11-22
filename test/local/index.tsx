import React from 'react';
import { render } from 'react-dom';

import { useDestination, Destinations, Destination, Handler, chain, DebugLogger, silence, wrapUnknown } from '../../src/infrastructure';

type DestinationId = 'Anakin' | 'Kenobi' | 'Yoda';

const Button = ({
    destinationId,
    handler,
    ...others
}: { destinationId: DestinationId; handler?: Handler } & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>): JSX.Element => {
    const { handle } = useDestination<DestinationId>(destinationId);
    return <button {...others} onClick={() => handle(handler)} />;
};

const css = `
    html, body { margin: 0; }
    button { margin: 5px; }
`;

render(
    <Destinations
        handler={chain(
            silence(wrapUnknown((el) => el.scrollIntoView({ behavior: 'smooth' }))),
            silence(wrapUnknown((el) => el.scrollTo({ behavior: 'smooth' }))),
            wrapUnknown((el) => window.scrollTo(0, el.offsetTop)),
        )}
        logger={new DebugLogger()}
    >
        <style type="text/css">{css}</style>
        <div style={{ backgroundColor: 'red', padding: '30vh 0', textAlign: 'center' }}>
            <Destination<DestinationId> destinationId="Anakin">Not just the men</Destination>
        </div>
        <div style={{ backgroundColor: 'blue', padding: '30vh 0', textAlign: 'center' }}>
            <Destination<DestinationId> destinationId="Kenobi">Too centrist for politics</Destination>
        </div>
        <div style={{ backgroundColor: 'green', padding: '30vh 0', textAlign: 'center' }}>
            <Destination<DestinationId> destinationId="Yoda">Into the swamp I must go</Destination>
        </div>
        <div style={{ backgroundColor: 'yellow', padding: '20px', textAlign: 'center' }}>
            <Button destinationId="Anakin" handler={wrapUnknown((el) => el.scrollIntoView({ behavior: 'smooth' }))}>
                Kill younglings
            </Button>
            <Button destinationId="Yoda">Get Addicted to ketamine</Button>
            <Button destinationId="Anakin">Do the most war crimes</Button>
            <Button destinationId="Anakin">Be a space fascist</Button>
            <Button destinationId="Kenobi">Have the highground</Button>
        </div>
    </Destinations>,
    document.querySelector('#app'),
);
