// custom.d.ts ou types.d.ts

declare module '*.yml' {
  const content: Record<string, any>; 
  export default content;
}

declare module '*.yaml' {
  const content: Record<string, any>;
  export default content;
}
