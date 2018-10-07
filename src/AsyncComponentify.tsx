import React from "react";
import { Props } from "./types";

import deepEquals from "fast-deep-equal";

interface State {
  data: any | null;
  error: Error | null;
}

export default class AsyncComponentify extends React.Component<
  Props<any, any>,
  State
> {
  public static defaultProps = {
    parametersDidChange: (p: any[], c: any[]) => !deepEquals(p, c)
  };

  public state: State = {
    data: null,
    error: null
  };

  private mounted = true;

  public componentWillUnmount() {
    this.mounted = false;
  }

  public componentDidMount() {
    this.execute();
  }

  public componentDidUpdate(prevProps: Props<any, any>) {
    const { parametersDidChange, params } = this.props;

    if (parametersDidChange(prevProps.params, params)) {
      this.execute();
    }
  }

  public render() {
    const { data, error } = this.state;
    const { children } = this.props;
    const loading = data === null && error === null;

    return (
      <React.Fragment>{children({ loading, data, error })}</React.Fragment>
    );
  }

  private getNonFunctionParams = (params: any[]) =>
    params.filter(p => typeof p !== "function");

  private execute = async () => {
    const { original, params } = this.props;
    const state: State = { data: null, error: null };

    try {
      const data = await original(...params);

      if (
        deepEquals(
          this.getNonFunctionParams(params),
          this.getNonFunctionParams(this.props.params)
        ) &&
        this.mounted
      ) {
        this.setState({ ...state, data });
      }
    } catch (error) {
      if (
        deepEquals(
          this.getNonFunctionParams(params),
          this.getNonFunctionParams(this.props.params)
        ) &&
        this.mounted
      ) {
        this.setState({ ...state, error });
      }
    }
  };
}
