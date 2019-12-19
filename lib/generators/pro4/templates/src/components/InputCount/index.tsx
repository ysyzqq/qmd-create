import React from 'react';
import { Input } from 'antd';
import texCount from './textCount';
import { InputProps, TextAreaProps } from 'antd/es/input';
import styles from './input.module.less';

const { TextArea } = Input;

export interface IInputCounts extends InputProps {
  maxLength?: number;
  enteredCharacters?: () => void;
}

export interface ITextareaCount extends TextAreaProps {
  maxLength?: number;
  enteredCharacters?: () => void;
}

const Text: React.FC<ITextareaCount> = ({
  maxLength = 200,
  enteredCharacters = () => {},
  ...restProps
}) => {
  return (
    <div className={styles.textarea}>
      <TextArea {...restProps} />
      <span>
        {enteredCharacters()}/{maxLength}
      </span>
    </div>
  );
};

const InputCounts: React.FC<IInputCounts> = ({
  maxLength = 200,
  enteredCharacters = () => {},
  ...restProps
}) => {
  return (
    <Input
      className={styles.inputwrap}
      type="text"
      {...restProps}
      suffix={
        <span>
          {enteredCharacters()}/{maxLength}
        </span>
      }
    />
  );
};

const InputCount = texCount(InputCounts);
const TextareaCount = texCount(Text);

export { InputCount, TextareaCount };
