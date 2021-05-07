export type InferProps<T extends (argsObj?: any) => any> = T extends (
    props: infer P
) => any
    ? P extends {}
        ? P
        : {}
    : never;
