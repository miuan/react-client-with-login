import React, { useState, useEffect } from "react";
import { Form, FormControl, Button } from "react-bootstrap";

import BaseControl from './control'

export interface IProjectModel {
  name: string;
  schema: string;
}

export interface IProjectForm {
  model: any;
  doUpdate: (model:any) => void;
  edit?: boolean
  fields: string[]
}

export const BaseForm: React.FC<IProjectForm> = ({ model, fields, doUpdate, edit = false }) => {
  

  const onUpdate = () => {
      doUpdate(model)
  }

  const onChange = (field:string, value:any) => {
    model[field] = value
  }

  return (
    <div>
      <Form>
        {fields.map((field:any)=>(<BaseControl model={model} field={field} onChange={onChange}/>))}
        <Button onClick={onUpdate}>{edit ? 'Update' : 'Create'}</Button>
      </Form>
    </div>
  );
};
