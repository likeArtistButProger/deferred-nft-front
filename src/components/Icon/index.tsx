import React, { ComponentPropsWithoutRef, FC } from "react";
import { Asset, Color } from "./types";

import {
    ArrowBottom,
} from "./styled";

interface Props extends ComponentPropsWithoutRef<"svg"> {
    asset: Asset,
    color: Color,
    clickable?: boolean,
}

const Icon: FC<Props> = ({asset, ...props}: Props) => {

    switch(asset) {
        case "util-arrow-bottom":
            return <ArrowBottom {...props} />
        default:
            return (
                <></>
            )
    }
}

export default Icon;