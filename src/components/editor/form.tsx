import Button from "@material-ui/core/Button";
import React, { useState, useEffect } from "react";

import BaseControl, { TField } from './control'

export type TBaseForm = {
  model: any;
  doUpdate: (model:any) => void;
  edit?: boolean
  fields: TField[]
}

export const BaseForm: React.FC<TBaseForm> = ({ model, fields, doUpdate, edit = false }) => {
  
  const onUpdate = () => {
      doUpdate(model)
  }

  const onChange = (field:string, value:any) => {
    model[field] = value
  }

  return (
    <div>
      <form>
        {fields.map((field:any)=>(<BaseControl model={model} field={field} onChange={onChange}/>))}
        <Button onClick={onUpdate}>{edit ? 'Update' : 'Create'}</Button>
      </form>
    </div>
  );
};
