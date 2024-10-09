import { Dirent } from "fs";

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | Dirent
  | JSONValue[]
  | { [key: string]: JSONValue };
