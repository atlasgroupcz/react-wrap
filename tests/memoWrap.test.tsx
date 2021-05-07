import { memoWrap } from '@library';
import { render } from '@testing-library/react';
import React, { FC, useEffect, useState } from 'react';

describe('memoWrap', () => {
    it('should be defined', () => {
        expect(memoWrap).toBeDefined();
    });

    it('should render', async () => {
        const match = 'ahoj';

        const View: FC<{ text: string }> = ({ text }) => <div>{text}</div>;

        const WrappedComponent = memoWrap(View, () => {
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

        const WrappedComponent = memoWrap(View, useText);

        render(<WrappedComponent />);

        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should prevent rerender with custom `arePropsEqual`', async () => {
        const inner = jest.fn();
        const outer = jest.fn();
        const View: FC<{ text: string }> = ({ text }) => {
            useEffect(inner);

            return <div>{text}</div>;
        };
        type WrappedComponentProps = {
            initialText?: string;
        };

        const useText = (props?: WrappedComponentProps) => {
            // useText will run twice => an updating effect is fired here, still, props don´t change
            useEffect(outer, [props]);

            const [text, setText] = useState<string>(
                props?.initialText ?? 'some text'
            );

            // update text
            useEffect(() => {
                setText('some other text');
            }, []);

            return { text };
        };

        const useOuterText = (props?: WrappedComponentProps) => {
            const [text, setText] = useState<string>(
                props?.initialText ?? 'some outer text'
            );

            // update text
            useEffect(() => {
                setText('some other outer text');
            }, []);

            return { text };
        };

        const WrappedComponent = memoWrap(View, useText, (_p, _n) => {
            // never update
            return true;
        });

        const Outer: FC = () => {
            const { text } = useOuterText();

            return <WrappedComponent initialText={text} />;
        };

        render(<Outer />);

        expect(inner).toHaveBeenCalledTimes(2);
        expect(outer).toHaveBeenCalledTimes(1);
    });
});
