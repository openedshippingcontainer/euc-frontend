// Copy-pasted from https://github.com/EfogDev/react-process-string/blob/master/index.js
type MatchFunction = (key: number, result: Array<string>) => React.ReactNode;

interface ConfigType {
  regex: RegExp;
  match: MatchFunction;
}

export function ReactProcessString(
  configs: Array<ConfigType>
): (input: React.ReactNode) => React.ReactNode {
  let key = 0;

  function ProcessInputWithRegex(
    config: ConfigType,
    input: React.ReactNode
  ): React.ReactNode {
    if (typeof input === "string") {
      const output = [];
      const string_input = input as string;

      let results = null;
      let last_index = 0;
      while ((results = config.regex.exec(string_input)) != null) {
        const index = results.index;

        output.push(string_input.substring(last_index, index));
        output.push(config.match(++key, results));

        last_index = index + results[0].length;

        input = string_input.substring(
          last_index,
          string_input.length + 1
        );
      }

      output.push(input);
      return output;
    } else if (Array.isArray(input)) {
      return input.map((chunk) => ProcessInputWithRegex(config, chunk));
    } else return input;
  }

  return function (input: React.ReactNode): React.ReactNode {
    if (!configs || !Array.isArray(configs) || !configs.length)
      return input;

    configs.forEach((option) => {
      input = ProcessInputWithRegex(option, input);

      // Reset last match index, so we can match again with a new config
      option.regex.lastIndex = 0;
    });

    return input;
  };
}