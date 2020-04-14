import React, { useState, useEffect, useCallback } from "react";
import * as _ from 'lodash'
import gql from "graphql-tag";

import BaseEdit from "../../components/editor/edit"


const CREATE_MUTATION = gql`
  mutation createUserRole($role: String!) {
    createUserRole(role: $role) {
      id
      role
    }
  }
`;

const UPDATE_MUTATION = gql`
  mutation updateUserRole($id:ID!, $role: String!) {
    updateUserRole(id: $id, role: $role) {
      id
      role
    }
  }
`;

const QUERY = gql`
  query userRole($id:ID){ UserRole(id:$id) {
      id,
      role,
    }}
`;

export const UserRoleEdit = (data:any) => {
  const id = _.get(data, 'match.params.id')
  

  return (
    <>
      <BaseEdit 
        id={id} 
        name={'UserRole'}
        fields={['role']}
        query={{
            CREATE_MUTATION,
            UPDATE_MUTATION,
            QUERY
        }}
      />
    </>
  );
};

export default UserRoleEdit