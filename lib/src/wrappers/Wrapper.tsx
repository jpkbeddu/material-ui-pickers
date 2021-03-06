import React from 'react';
import ModalWrapper, { ModalWrapperProps } from './ModalWrapper';
import InlineWrapper, { InlineWrapperProps } from './InlineWrapper';
import { Omit } from '@material-ui/core';
import { PureDateInputProps } from '../_shared/PureDateInput';
import { KeyboardDateInputProps } from '../_shared/KeyboardDateInput';

export type WrapperVariant = 'dialog' | 'inline';

export interface WrapperProps<T> {
  open: boolean;
  onAccept: () => void;
  onDismiss: () => void;
  onClear: () => void;
  onSetToday: () => void;
  InputComponent: React.FC<T>;
  DateInputProps: T;
  wider?: boolean;
}

type OmitInnerWrapperProps<T extends WrapperProps<any>> = Omit<
  T,
  keyof WrapperProps<any> | 'showTabs'
>;

export type ModalRoot = { variant?: 'dialog' } & OmitInnerWrapperProps<ModalWrapperProps>;

export type InlineRoot = { variant?: 'inline' } & OmitInnerWrapperProps<InlineWrapperProps>;

// prettier-ignore
export type ExtendWrapper<TInput extends PureDateInputProps | KeyboardDateInputProps> =
  Omit<TInput, 'inputValue' | 'format' | 'validationError' | 'format' | 'forwardedRef'> & (
    ModalRoot | InlineRoot
  )

export function getWrapperFromVariant<T>(
  variant?: WrapperVariant
): React.ComponentClass<InlineWrapperProps<T> | ModalWrapperProps<T>> {
  switch (variant) {
    case 'inline':
      return InlineWrapper as any;

    default:
      return ModalWrapper as any;
  }
}

type Props<T> = {
  variant?: WrapperVariant;
  children?: React.ReactChild;
} & (ModalWrapperProps<T> | InlineWrapperProps<T>);

export const Wrapper: <T extends KeyboardDateInputProps | PureDateInputProps>(
  p: Props<T>
) => React.ReactElement<Props<T>> = ({ variant, ...props }) => {
  const Component = getWrapperFromVariant<typeof props.DateInputProps>(variant);

  return <Component {...props} />;
};
