export type CommandType = { [key: string]: () => Promise<void> };
export type Winner = { firstName: string };
export type Prize = { [key: number]: number };
