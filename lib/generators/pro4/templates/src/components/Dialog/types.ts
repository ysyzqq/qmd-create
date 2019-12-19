import { ReactNode, ElementType, ReactPortal } from 'react';
import { ModalProps } from 'antd/lib/modal/Modal';
import { FormProps } from 'antd/lib/form/Form';
import { TOptions as TOptionsAutodata } from '@/components/HOC/autodata';

export interface IDialogProps {
    title?: string | ReactNode | (ReactPortal & string);
    titleRender?: () => ReactNode;
    footerRender?: () => ReactNode;
    transition?: boolean;
    props?: object;
    formProps?: TFormProps;
    autoClose?: boolean;
    render?: Function;
    content?: string | ReactNode;
    setProps?: (_:any) => void;
    onOk?: () => void;
    onCancel?: () => void;
}

export interface IFormProps {
    action?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE';
    valuesFilter?: (values: object) => object;
    onSubmitted?: Function;
    onError?: Function;
}

export type TFormProps = IFormProps & FormProps;

export type TDialogProps = IDialogProps & ModalProps & FormProps;

export type TBody = ElementType | ReactNode | undefined;

export interface IOpenDialogProps {
    autodata?: TOptionsAutodata | TOptionsAutodata[];
    delay?: number;
    setPropsMerged?: boolean;
    autoClose?: boolean;
    maskClosable?: boolean;

    setPropsMergetd?: boolean;
}

export type TOptions = IOpenDialogProps & TDialogProps & IFormProps;

export interface IPrompt extends TOptions {
    label: string;
    wrappedClassName?: string;
    className?: string;
    name?: string;
    required?: boolean;
    type?: string;
    message?: string;
    component?: ElementType;
    defaultValue?: any;
    placeholder?: string;
}
export interface DialogInstance {
    props: TDialogProps;
    destroy: () => void;
}
