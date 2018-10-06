import React from "react";
import { Props, Result } from "./types";

const SyncComponentify: React.SFC<Props<any, any>> = ({
  children,
  original,
  params
}) => {
  let result: Result<any> = {
    data: null,
    error: null,
    loading: true
  };

  try {
    const data = original(...params);

    result = { data, error: null, loading: false };
  } catch (error) {
    result = { error, data: null, loading: false };
  }

  return <React.Fragment>{children(result)}</React.Fragment>;
};

export default SyncComponentify;
