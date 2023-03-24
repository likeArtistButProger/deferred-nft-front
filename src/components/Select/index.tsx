import React, { useCallback, useState, useRef } from "react";
import { useClickOutside } from "../../hooks";
import Text from "../Text";
import { AnchorContainer, Option, Options, SelectedOption } from "./styled";
import { Option as OptionT } from "./types";

interface Props {
    selected: OptionT,
    onSelect: (option: OptionT)=>void,
    options: OptionT[]
}

const Select = ({ selected, onSelect, options }: Props) => {
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const showOptions = useCallback(() => {
        setIsOptionsVisible(true);
    }, [setIsOptionsVisible]);
    const hideOptions = useCallback(() => {
        setIsOptionsVisible(false);
    }, [setIsOptionsVisible]);
    const SelectRef = useRef(null);
    useClickOutside(SelectRef, hideOptions);

    return (
        <AnchorContainer ref={SelectRef}>
            <SelectedOption opened={isOptionsVisible} onClick={showOptions}>
                {selected.label}
            </SelectedOption>
            {
                isOptionsVisible &&
                <Options>
                    {
                        options.map(option => (
                            <Option
                                key={option.label}
                                onClick={() => { if(selected.label !== option.label) { onSelect(option); hideOptions(); } }}
                                pickable={selected.label !== option.label}
                            >
                                <Text variant="m" color="Yellow">{option.label}</Text>
                            </Option>
                        ))
                    }
                </Options>
            }
        </AnchorContainer>
    )
}

export default Select;