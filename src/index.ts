import { FC, ComponentPropsWithoutRef, createElement, memo } from 'react';
import { InferProps } from './types/InferProps';

/**
 * Creates an implementation of a *wrapped* component using a View and a Controller hook
 * @param View A view component
 * @param useController A controller hook, can be parametrized with a object parameter
 *
 * Any paramaters passed to controller will be passed as props to the resulting component
 */
export const wrap = <
    V extends FC<any>,
    C extends (argsObj?: object) => ComponentPropsWithoutRef<V>
>(
    View: V,
    useController: C
): FC<InferProps<C>> => (controllerArgs) =>
    createElement(View, useController(controllerArgs));

/**
 * Creates a memoized implementation `wrap`
 * @param View A view component
 * @param useController A controller hook, can be parametrized with a object parameter
 * @param propsAreEqual Like `React.memo`, a custom `propsAreEqual` can be defined to change the way component rerendering behaves
 *
 * Any paramaters passed to controller will be passed as props to the resulting component
 */
export const memoWrap = <
    V extends FC<any>,
    C extends (argsObj?: object) => ComponentPropsWithoutRef<V>
>(
    View: V,
    useController: C,
    propsAreEqual?: (
        prevProps: Readonly<InferProps<C>>,
        nextProps: Readonly<InferProps<C>>
    ) => boolean
) =>
    memo<InferProps<C>>(
        (controllerArgs) => createElement(View, useController(controllerArgs)),
        propsAreEqual
    );
