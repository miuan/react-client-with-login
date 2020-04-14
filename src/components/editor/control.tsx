import React, { useState, useEffect } from "react";

import { Form, FormControl, Button } from "react-bootstrap";



export interface IBaseControl {
  model: any;
  onChange: (name: string, value:any) => void;
  edit?: boolean
  field: string | any
}

export const BaseControl: React.FC<IBaseControl> = ({ model, field, onChange, edit = false }) => {
  const [name, setName] = useState(model[field]);

  useEffect(()=>{
    setName(model[field])
  }, [field, model])

  const onUpdate = (value:string) => {
    const obj = {...model} as any
    obj[field] = value

    setName(value)
    onChange(field, value)
  }

  return (
    <Form.Group controlId="formBasicEmail">
          <Form.Label>{field}</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            onChange={(env: any) => onUpdate(env.target.value)}
            value={name}
          />
          <FormControl.Feedback type="valid">
            Yeah you did it!
          </FormControl.Feedback>
        </Form.Group>
  );
};

export default BaseControl