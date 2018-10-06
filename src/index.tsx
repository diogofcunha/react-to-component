import React from "react";

import SyncComponentify from "./SyncComponentify";
import { Props } from "./types";

export { Props };

export default class ToComponent<T, P> extends React.Component<Props<T, P>> {
  public render() {
    return (
      <React.Fragment>
        <SyncComponentify {...this.props} />
      </React.Fragment>
    );
  }
}
