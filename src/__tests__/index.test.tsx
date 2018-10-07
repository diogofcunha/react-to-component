import deepEquals from "fast-deep-equal";
import React from "react";
import { cleanup, render, waitForElement } from "react-testing-library";

import ToComponent, { Props } from "..";

type TestProps = Props<any, any>;

// tslint:disable-next-line:no-console
console.error = x => {
  throw new Error(x);
};

describe("<ToComponent />", () => {
  afterEach(cleanup);

  const setup = (
    p: Pick<TestProps, "original" | "params">,
    parametersDidChange?: (prev: any[], cur: any[]) => boolean
  ) => {
    const props: TestProps = {
      children: jest.fn().mockImplementation(({ error, loading }) => {
        if (loading) {
          return "Loading";
        }

        if (error) {
          return error.message;
        }

        return "Loaded";
      }),
      parametersDidChange,
      ...(p as any)
    };

    return {
      props,
      ...render(<ToComponent {...props} />)
    };
  };

  const waitFor = (ms: number) =>
    new Promise(r => {
      setTimeout(() => {
        r();
      }, ms);
    });

  describe("Sync apis", () => {
    test("should call children with the correct props on success", async () => {
      const original = (name: string, age: number) =>
        `I am ${name} and I am ${age} years old`;
      const params = ["Diogo", 27];

      const { props, getByText } = setup({ original, params });

      await waitForElement(() => getByText("Loaded"));

      expect(props.children).toMatchSnapshot();
    });

    test("should call children with the correct props on failure", async () => {
      const error = new Error("Trolololololol");

      const original = () => {
        throw error;
      };

      const params = ["Diogo", 27];

      const { props, getByText } = setup({ original, params });

      await waitForElement(() => getByText(error.message));

      expect(props.children).toMatchSnapshot();
    });

    test("should use custom parametersDidChange when provided", async () => {
      const original = (
        name: string,
        age: number,
        log: (res: string) => void
      ) => {
        const res = `I am ${name} and I am ${age} years old`;
        log(res);

        return res;
      };

      const params = ["Diogo", 27, () => {}];

      const parametersDidChange = (prevParams: any[], nextParams: any[]) => {
        return !deepEquals(prevParams.slice(0, 2), nextParams.slice(0, 2));
      };

      const { props, rerender, getByText } = setup(
        { original, params },
        parametersDidChange
      );

      await waitForElement(() => getByText("Loaded"));

      rerender(<ToComponent {...props} params={["Diogo", 27, () => {}]} />);

      await waitForElement(() => getByText("Loaded"));

      expect(props.children).toMatchSnapshot();
    });
  });

  describe("Async apis", () => {
    test("should call children with the correct props on success", async () => {
      const original = async (name: string, age: number) => {
        await waitFor(50);

        return `I am ${name} and I am ${age} years old`;
      };

      const params = ["Diogo", 27];

      const { props } = setup({ original, params });

      await waitFor(75);

      expect(props.children).toMatchSnapshot();
    });

    test("should call children with the correct props on failure", async () => {
      const error = new Error("trolololol");

      const original = async () => {
        await waitFor(50);

        throw error;
      };

      const { props, getByText } = setup({ original, params: ["Diogo", 27] });

      await waitForElement(() => getByText(error.message));

      expect(props.children).toMatchSnapshot();
    });

    describe("async flow problems", () => {
      test("should call children with the correct props on success", async () => {
        const original = async (name: string, age: number) => {
          if (name === "Fonseca") {
            await waitFor(100);
          } else {
            await waitFor(50);
          }

          return `I am ${name} and I am ${age} years old`;
        };

        const { props, rerender, getByText } = setup({
          original,
          params: ["Fonseca", 27]
        });

        rerender(<ToComponent {...props} params={["Diogo", 27]} />);

        await waitFor(125);
        await waitForElement(() => getByText("Loaded"));

        expect(props.children).toMatchSnapshot();
      });

      test("should call children with the correct props on success and ignore old errors", async () => {
        const original = async (name: string, age: number) => {
          if (name === "Diogo") {
            return `I am ${name} and I am ${age} years old`;
          } else {
            await waitFor(50);
            throw Error("trololo");
          }
        };

        const { props, rerender, getByText } = setup({
          original,
          params: ["Fonseca", 27]
        });

        rerender(<ToComponent {...props} params={["Diogo", 27]} />);

        await waitFor(75);
        await waitForElement(() => getByText("Loaded"));

        expect(props.children).toMatchSnapshot();
      });

      test("should call children with the correct props on failure", async () => {
        const error = new Error("trolololololololol");

        const original = async (name: string, age: number) => {
          if (name === "Fonseca") {
            await waitFor(100);

            return `I am ${name} and I am ${age} years old`;
          } else {
            await waitFor(50);

            throw new Error("trolololololololol");
          }
        };

        const { props, rerender, getByText } = setup({
          original,
          params: ["Fonseca", 27]
        });

        rerender(<ToComponent {...props} params={["Diogo", 27]} />);

        await waitFor(125);
        await waitForElement(() => getByText(error.message));

        expect(props.children).toMatchSnapshot();
      });

      test("should prevent memory leaks", async () => {
        const original = async () => {
          await waitFor(50);

          return "done";
        };

        const { unmount } = setup({ original, params: [] });

        unmount();

        await waitFor(75);
      });
    });
  });
});
