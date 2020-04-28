import React, { useState, useEffect } from "react";
import { Form, FormControl, Button } from "react-bootstrap";

export type TControl = {
  placeholder? : string
  onChange: (env: any) => void
  value: string
}

export type TControlField = {
  name: string
  label?: string
  placeholder?: string
  control?: React.FC<TControl>
  valid?: string
}

export type TField = string | TControlField

export interface IBaseControl {
  model: any;
  onChange: (name: string, value:any) => void;
  edit?: boolean
  field: TField
}

export const BaseControl: React.FC<IBaseControl> = ({ model, field, onChange, edit = false }) => {
  const name = (field as TControlField).name ? (field as TControlField).name : field as string
  const label = (field as TControlField).label ? (field as TControlField).label : name
  const control = (field as TControlField).control ? (field as TControlField).control : null

  const [value, setValue] = useState(model[name]);

  useEffect(()=>{
    setValue(model[name])
  }, [field, model])

  const onUpdate = (value:string) => {
    const obj = {...model} as any
    obj[name] = value

    setValue(value)
    onChange(name, value)
  }

  return (
    <Form.Group controlId="formBasicEmail">
          <Form.Label>{label}</Form.Label>
          {control ? 
            control({onChange:(env: any) => onUpdate(env.target.value), value}) :
            <Form.Control
              type="text"
              placeholder=""
              onChange={(env: any) => onUpdate(env.target.value)}
              value={value}
            />
          }
          <FormControl.Feedback type="valid">
            Yeah you did it!
          </FormControl.Feedback>
        </Form.Group>
  );
};

export default BaseControl