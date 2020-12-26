import React, { useState, useEffect, useCallback } from "react";
import * as _ from 'lodash'
import gql from "graphql-tag";

import BaseEdit from "../../components/editor/edit"
import { Form } from "react-bootstrap";
import { TControl } from "../../components/editor/control";


const CREATE_MUTATION = gql`
  mutation createProject($userId: ID!, $name: String!, $models: String!) {
    createProject(userId: $userId, name: $name, models: $models) {
      id
      name
      models
    }
  }
`;

const UPDATE_MUTATION = gql`
  mutation updateProject($id: ID!, $name: String!, $models: String!) {
    updateProject(id: $id, name: $name, models: $models) {
      id
      name
      models
    }
  }
`;

const QUERY = gql`
  query project($id:ID){ Project(id:$id) {
      id,
      name,
      models
    }}
`;

const ProjectSchemaControl:React.FC<TControl> = ({onChange, value}) => (
    <Form.Control as="textarea" rows={30} {...{onChange, value}} />
)

export const ProjectEdit = (data:any) => {
  const projectId = _.get(data, 'match.params.projectId')
  

  return (
    <>
      <BaseEdit 
        id={projectId} 
        name={'Project'}
        fields={['name', {
          name:'models',
          label: 'Schema',
          control: ProjectSchemaControl
        }]}
        query={{
            CREATE_MUTATION,
            UPDATE_MUTATION,
            QUERY
        }}
      />
    </>
  );
};
