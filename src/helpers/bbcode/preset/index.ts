/* eslint-disable indent */
import { IsTagNode } from "../plugin-helper";
import { InterfaceType } from "./DefaultTags";
import { OptionsType } from "../core";

function Process(tags: { [x: string]: (arg0: any, arg1: any, arg2: any) => any; }, tree: { walk: (arg0: (node: any) => any) => void; }, core: any, options: any) {
  tree.walk((node: { tag: string | number; }) => (IsTagNode(node) && tags[node.tag]
      ? tags[node.tag](node, core, options)
      : node));
}

interface InstanceType {
  options?: OptionsType;
}

interface PresetType {
  instance?: InstanceType;
  creator?: InstanceType;
  extend: (arg0: any, arg1: any) => PresetType;
}

/**
 * @param defTags
 * @return {function(*=, *=)}
 */
export function CreatePreset(defTags: InterfaceType): ((tree?: any, core?: any) => any) {
  const instance = (opts: OptionsType = {}): ((tree: any, core: any) => any) => {
    // @ts-ignore
    instance.options = Object.assign(instance.options || {}, opts);

    // @ts-ignore
    const creator = (tree: any, core: any) => Process(defTags, tree, core, instance.options);
    
    // @ts-ignore
    creator.options = instance.options;

    return creator;
  };

  // @ts-ignore
  instance.extend = (callback: (arg0: any, arg1: any) => PresetType) => CreatePreset(callback(defTags, instance.options));
  return instance;
}
