import React, { FC } from 'react';

const ScrollingContext = React.createContext<void>(undefined);

export const Scroll: FC = ({ children }): JSX.Element => {
    return <ScrollingContext.Provider value={void 0}>{children}</ScrollingContext.Provider>;
};
