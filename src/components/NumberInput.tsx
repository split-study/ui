import { FC, useCallback, ChangeEvent } from 'react';
import { Input as ChakraInput, InputProps } from '@chakra-ui/react';

type Props = {
  initialValue?: string;
  onChange: (value: string) => void;
  invalidMessage?: string | null;
  onUpdateInvalidMessage?: (message: string | null) => void;
} & Omit<InputProps, 'type' | 'onChange'>;

export const NumberInput: FC<Props> = ({
  initialValue,
  value,
  onChange,
  invalidMessage = null,
  onUpdateInvalidMessage = () => {},
  isDisabled = false,
  ...props
}) => {
  const onChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const targetValue = event.target.value;

      onChange(targetValue);

      if (!targetValue) {
        onUpdateInvalidMessage('Value cannot be ampty');

        return;
      }

      if (!/^\d*\.?\d*$/.test(targetValue)) {
        onUpdateInvalidMessage('Use only digits and the decimal sign');

        return;
      }

      onUpdateInvalidMessage(null);
    },
    [],
  );

  return (
    <div className="flex flex-col gap-1">
      <ChakraInput
        {...props}
        type="text"
        value={value}
        onChange={onChangeHandler}
        isInvalid={!!invalidMessage}
        isDisabled={isDisabled}
      />
      {invalidMessage && <span className="text-red-600">{invalidMessage}</span>}
    </div>
  );
};
