import { Colors } from "../../styles";

type Color = keyof typeof Colors;

type Asset =
    "util-arrow-bottom"

type IconProps = {
    color: Color,
    clickable?: boolean
}

export type {
    Asset,
    Color,
    IconProps
}