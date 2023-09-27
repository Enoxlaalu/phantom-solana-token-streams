import styles from "./styles.module.scss";
import React, {
  memo,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import debounce from "src/utils/debounce";

interface IInput {
  id: string;
  value: string | number;
  onChange: (v: string) => void;
  onFocus?: () => void;
  className?: string;
  endIcon?: string;
  placeholder?: string;
}

const Input: React.FC<IInput> = memo(
  ({ id, value, onChange, className, endIcon, onFocus, placeholder }) => {
    const [inputValue, setValue] = useState(value);

    console.log(inputValue);

    useEffect(() => {
      setValue(value);
    }, [value]);

    const debouncedChange = useCallback(
      debounce((v: string) => {
        onChange(v);
      }, 500),
      [],
    );

    const handleChange = (e: SyntheticEvent) => {
      const value = (e.target as HTMLInputElement).value;

      setValue(value);
      debouncedChange(value);
    };

    return (
      <div className={`${styles.input} ${className}`}>
        <input
          id={id}
          type="text"
          value={inputValue || ""}
          onChange={handleChange}
          onFocus={onFocus}
          placeholder={placeholder}
        />
        {endIcon && <span className={styles.endIcon}>{endIcon}</span>}
      </div>
    );
  },
);

export default Input;
