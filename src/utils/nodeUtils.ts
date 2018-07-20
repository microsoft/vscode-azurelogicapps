import * as path from "path";
import { ext } from "../extensionVariables";

export interface IThemedIconPath {
    dark: string;
    light: string;
}

export function getIconPath(iconName: string): string {
    return ext.context.asAbsolutePath(path.join("resources", `${iconName}.svg`));
}

export function getStatusIconPath(iconName: string): string {
    return ext.context.asAbsolutePath(path.join("resources", "status", `${iconName}.svg`));
}

export function getThemedIconPath(iconName: string): IThemedIconPath {
    return {
        dark: ext.context.asAbsolutePath(path.join("resources", "dark", `${iconName}.svg`)),
        light: ext.context.asAbsolutePath(path.join("resources", "light", `${iconName}.svg`))
    };
}
