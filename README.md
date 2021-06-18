# React Wrap 🌯

A straight-forward react component logic reusing and close-coupling prevention utility

## Quick start

### Installation

npm:

```
npm install @atlasgroup/react-wrap
```

yarn:

```
yarn add @atlasgroup/react-wrap
```

### Usage

`react-wrap` enables a typesafe and highly flexible way of implementing logic for presentational components, or extending/simplifying others.

A component and a hook are passed as arguments to `wrap`.

`wrap` creates a component where the input props are preprocessed by the controller hook before passing them to the original component, essentially working as middleware, but for react components.

#### Basic scheme

```tsx
const Component = wrap(BaseComponent, useMyHook);
```

```
|  pass props to Component              <Component prop1={value1}>
|  props are intercepted by useMyHook   useMyHook({prop1: value1})
|                                       *do stuff in useMyHook*
V  return new props for BaseComponent   <BaseComponent prop2={value2} />
```

### Examples

#### Implementing a presentational component

```tsx
const useTogglableButton = (): ButtonProps => {
    const [isToggled, setIsToggled] = useState<boolean>(false);

    const onClick = useCallback(() => setIsToggled((current) => !current), []);

    return {
        color: isToggled ? 'red' : 'green',
        onClick,
    };
};

const TogglableButton = wrap(Button, useTogglableButton);
```

#### Extending and/or hydrating an existing component

```tsx
type CalendarWithEventsProps = CalendarProps & { showEvents?: boolean };

const useEvents = ({
    showEvents,
    ...props
}: CalendarWithEventsProps): CalendarProps => {
    // Don't query if events will not be shown
    const { data } = useEvents({ skip: !showEvents });

    const events = data?.events;

    return {
        events,
        ...props,
    };
};

const CalendarWithEvents = wrap(Calendar, useEvents);
```

#### Simplifying an existing component

```tsx
type LessComplicatedComponentProps = Omit<
    SuperComplicatedComponentProps,
    'some' | 'random' | 'stuff'
>;

const useLessComplicatedComponent = (
    props: LessComplicatedComponentProps
): SuperComplicatedComponentProps => {
    // Evaluate "some random stuff"
    // ...

    return {
        some,
        random,
        stuff,
        ...props,
    };
};

const LessComplicatedComponent = wrap(
    SuperComplicatedComponent,
    useLessComplicatedComponent
);
```

---

### react-wrap variants

`react-wrap` exposes three slightly different variants of itself:

-   `wrap` - gives `children` special treatment as a prop and passes them down to the wrapped component directly
-   `fastWrap` - ignores `children`, absolute control over the flow of props is given to the hook passed as an argument
-   `memoWrap` - wraps the resulting component in a `React.memo`, useful for optimizations, exposes a third parameter, a custom `arePropsEqual`, treats `children` like `wrap`

---

### Bug reports, feature requests and questions

Feel free to file a bug report, feature request or a question in the issues section with the correspoding **[BUG]** | **[FEATURE]** | **[QUESTION]** prefix in the title.

### Contributing

Any contributions must pass CI checks and a code review by a project maintainer. Please rebase your branches with the current `master` before submitting a pull request.
