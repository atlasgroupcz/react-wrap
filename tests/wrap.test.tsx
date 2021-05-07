import { wrap } from '@library';
import { render } from '@testing-library/react';
import React, { FC, useEffect, useState } from 'react';

describe('wrap', () => {
    it('should be defined', () => {
        expect(wrap).toBeDefined();
    });

    it('should render', async () => {
        const match = 'ahoj';

        const View: FC<{ text: string }> = ({ text }) => <div>{text}</div>;

        const WrappedComponent = wrap(View, () => {
            const text = match;
            return { text };
        });

        const componentRender = render(<WrappedComponent />);
        expect(componentRender).toBeDefined();

        const queryResult = await componentRender.findByText(match);

        expect(queryResult.textContent).toBe(match);
    });

    it('should not render excessively', async () => {
        const fn = jest.fn();
        const View: FC<{ text: string }> = ({ text }) => {
            useEffect(fn);

            return <div>{text}</div>;
        };
        const useText = () => {
            const [text, setText] = useState<string>('some text');

            // update text
            useEffect(() => {
                setText('some other text');
            }, []);

            return { text };
        };
        const WrappedComponent = wrap(View, useText);

        render(<WrappedComponent />);

        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should pass through children', async () => {
        const match = 'children';

        const View: FC<{ text: string }> = ({ children }) => {
            return <div>{children}</div>;
        };
        const useText = () => {
            const text = 'some text';
            return { text };
        };

        const WrappedComponent = wrap(View, useText);

        const componentRender = render(
            <WrappedComponent>{match}</WrappedComponent>
        );

        const queryResult = await componentRender.findByText(match);

        expect(queryResult.textContent).toBe(match);
    });
});
