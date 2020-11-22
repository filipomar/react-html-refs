import React, { FC, CSSProperties } from 'react';

export const Component: FC<Pick<CSSProperties, 'height' | 'width' | 'backgroundColor'>> = ({ height, width, backgroundColor, children }) => (
    <div style={{ height, width, backgroundColor }}>{children}</div>
);
