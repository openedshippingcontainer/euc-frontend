// eslint-disable-next-line @typescript-eslint/no-var-requires
const PackageJSON = require("./package.json");

const GetUpdateCommand = (version) => (
  `npm --no-git-tag-version version ${version}`
);

const UpdatePackageVersion = () => {
  // Major.Minor.Patch
  const version = PackageJSON.version.split(".");
  if (version.length !== 3)
    throw "package.json property \"version\" must be in Major.Minor.Patch format";

  const patch = +version.pop();
  if (patch === undefined || isNaN(patch))
    return GetUpdateCommand("patch");

  const minor = +version.pop();
  if (minor === undefined || isNaN(minor))
    return GetUpdateCommand("minor");

  // Update major if minor is >= 10
  // Update minor if patch is >= 10
  // Otherwise update patch
  return GetUpdateCommand(
    minor >= 10 ? "major" : (patch >= 10 ? "minor" : "patch")
  );
}

const AsTask = (arr) => arr.join(" && ");

module.exports = {
  "hooks": {
    "pre-commit": AsTask([
      "echo \"Updating package version\"",
      UpdatePackageVersion(),
      "git add ."
    ])
  }
}