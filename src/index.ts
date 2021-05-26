import {
    FC,
    ComponentPropsWithoutRef,
    createElement,
    memo,
    PropsWithChildren,
} from 'react';
import { InferProps } from './types/InferProps';

/**
 * Creates an implementation of a *wrapped* component using a View and a Controller hook
 * @param View A view component
 * @param useController A controller hook, can be parametrized with a object parameter
 *
 */
export const wrap = <
    V extends FC<any>,
    C extends (argsObj: any) => ComponentPropsWithoutRef<V>
>(
    View: V,
    useController: C
): FC<InferProps<C>> => (controllerArgs) =>
    createElement(View, useController(controllerArgs), controllerArgs.children);

/**
 * Creates a memoized implementation `wrap`
 * @param View A view component
 * @param useController A controller hook, can be parametrized with a object parameter
 * @param propsAreEqual Like `React.memo`, a custom `propsAreEqual` can be defined to change the way component rerendering behaves
 *
 */
export const memoWrap = <
    V extends FC<any>,
    C extends (argsObj: any) => ComponentPropsWithoutRef<V>
>(
    View: V,
    useController: C,
    propsAreEqual?: (
        prevProps: Readonly<InferProps<C>>,
        nextProps: Readonly<InferProps<C>>
    ) => boolean
) =>
    memo<PropsWithChildren<InferProps<C>>>(
        (controllerArgs) =>
            createElement(
                View,
                useController(controllerArgs),
                controllerArgs.children
            ),
        propsAreEqual
    );

/**
 * Unlike `wrap`, `fastWrap` doesn't allow `children` to fall through
 * @param View A view component
 * @param useController A controller hook, can be parametrized with a object parameter
 *
 */
export const fastWrap = <
    V extends FC<any>,
    C extends (argsObj: any) => ComponentPropsWithoutRef<V>
>(
    View: V,
    useController: C
): FC<InferProps<C>> => (controllerArgs) =>
    createElement(View, useController(controllerArgs));
