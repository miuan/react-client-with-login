import React, { useState, useEffect } from "react";

import { Form, FormControl, Button } from "react-bootstrap";

export interface IProjectModel {
  name: string;
  schema: string;
}

export interface IProjectForm {
  model: IProjectModel;
  doUpdate: (model: IProjectModel) => void;
  edit?: boolean
}

export const ProjectForm: React.FC<IProjectForm> = ({ model, doUpdate, edit = false }) => {
  const [name, setName] = useState(model.name);
  const [schema, setSchema] = useState(model.schema);

  useEffect(()=>{
    setName(model.name)
    setSchema(model.schema)
  }, [model.name, model.schema])

  const onUpdate = () => {
      doUpdate({
        name,
        schema
      } as IProjectModel)
  }

  return (
    <div>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Project name"
            onChange={(env: any) => setName(env.target.value)}
            value={name}
          />
          <FormControl.Feedback type="valid">
            Yeah you did it!
          </FormControl.Feedback>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            as="textarea"
            rows="10"
            onChange={(env: any) => setSchema(env.target.value)}
            value={schema}
          />
        </Form.Group>
        <Button onClick={onUpdate}>{edit ? 'Update' : 'Create'}</Button>
      </Form>
    </div>
  );
};
