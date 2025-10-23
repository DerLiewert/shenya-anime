export type SelectOption<T, L = string> = {
  value: T;
  label: L;
};

export type ExtractOptionValue<T> = T extends SelectOption<infer U>
  ? U
  : T extends SelectOption<infer U>[]
  ? U
  : never;
