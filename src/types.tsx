export interface Result<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export interface Props<T, P> {
  original: (...params: P[]) => Promise<T> | T;
  params: P[];
  children: (result: Result<T>) => JSX.Element | JSX.Element[] | null;
  parametersDidChange: (previousParams: P[], nextParams: P[]) => boolean;
}
