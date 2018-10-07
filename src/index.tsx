import React from "react";

import AsyncComponentify from "./AsyncComponentify";
import { Props } from "./types";

export { Props };

export default class ToComponent<T, P> extends React.Component<Props<T, P>> {
  public render() {
    return (
      <React.Fragment>
        <AsyncComponentify {...this.props} />
      </React.Fragment>
    );
  }
}
