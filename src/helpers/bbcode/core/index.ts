import { Parse } from "../parser";
import { iterate, match } from "./utils";

function walk(this: any, cb: (child: any) => any) {
  return iterate(this, cb);
}

export interface OptionsType {
  skipParse?: boolean;
  enableEscapeTags?: boolean;
  parser?: any;
  render?: any;
  data?: any;
  onSkip?: any;
  onError?: any;
  onToken?: any;
  createTokenizer?: any;
  onlyAllowTags?: Array<string>;
  openTag?: string;
  closeTag?: string;
}

export function ParserInstance(plugs: any) {
  const plugins = typeof plugs === "function" ? [plugs] : plugs || [];

  let options: OptionsType = {
    skipParse: false
  };

  return {
    process(input: any, opts: OptionsType) {
      options = opts || {};

      const parseFn = options.parser || Parse;
      const renderFn = options.render;
      const data = options.data || null;

      if (typeof parseFn !== "function") {
        throw new Error("\"parser\" is not a function, please pass to \"process(input, { parser })\" right function");
      }

      let tree = options.skipParse
        ? input || []
        : parseFn(input, options);

      // raw tree before modification with plugins
      const raw = tree;

      tree.messages = [];
      tree.options = options;
      tree.walk = walk;
      tree.match = match;

      plugins.forEach((plugin: (arg0: any, arg1: { parse: any; render: any; iterate: (t: any, cb: (child: any) => any) => any; match: (this: { parse: any; render: any; iterate: (t: any, cb: (child: any) => any) => any; match: (expression: any, cb: (child: any) => any) => any; data: any; }, expression: any, cb: (child: any) => any) => any; data: any; }) => any) => {
        tree = plugin(tree, {
          parse: parseFn,
          render: renderFn,
          iterate,
          match,
          data,
        }) || tree;
      });

      return {
        get html() {
          if (typeof renderFn !== "function") {
            throw new Error("\"render\" function not defined, please pass to \"process(input, { render })\"");
          }
          return renderFn(tree, tree.options);
        },
        tree,
        raw,
        messages: tree.messages,
      };
    },
  };
}
