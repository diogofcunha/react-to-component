import React from "react";
import { cleanup, render } from "react-testing-library";

import ToComponent, { Props } from "..";

type TestProps = Props<any, any>;

describe("<ToComponent />", () => {
  afterEach(cleanup);

  const setup = (p: Pick<TestProps, "original" | "params">) => {
    const props: TestProps = {
      children: jest.fn(),
      ...p
    };

    return {
      props,
      ...render(<ToComponent {...props} />)
    };
  };

  describe("Sync apis", () => {
    test("should call children with the correct props on success", () => {
      const original = (name: string, age: number) =>
        `I am ${name} and I am ${age} years old`;
      const params = ["Diogo", 27];

      const { props } = setup({ original, params });

      expect(props.children).toHaveBeenCalledWith({
        data: `I am Diogo and I am 27 years old`,
        error: null,
        loading: false
      });
    });

    test("should call children with the correct props on failure", () => {
      const error = new Error("Trolololololol");

      const original = () => {
        throw error;
      };

      const params = ["Diogo", 27];

      const { props } = setup({ original, params });

      expect(props.children).toHaveBeenCalledWith({
        data: null,
        error,
        loading: false
      });
    });
  });
});
