import { useEffect } from "react";
import "../../assets/styles/selectStyle.scss";

const CurrencySelect = (props: any) => {
    const { label, options, setOption, option } = props;

    useEffect(() => {
        if (options.length) setOption(0)
    }, [options]);

    useEffect(() => {
        if(option === "" && options.length) setOption(0)
    }, [option])

    return (
        <div className="select-option-wrapper">
            <div className="input">
                <span className="label">{label}:</span>
                <div className="input-field">
                    <select onChange={(e) => { setOption(e.target.value); }} value={option}>
                        {options.map((option: any, index: any) => (
                            <option key={index} value={index}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default CurrencySelect;
