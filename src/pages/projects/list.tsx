import React, {useState, useMemo, useCallback, useEffect} from 'react'
import {Link} from 'react-router-dom'
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ListRow, IListRowItem } from './row';
import Loading from '../../components/common/loading';
import DeleteModal from '../../components/common/DeleteModal';
import Unauthorized from '../../components/common/unauthorized';

const USER_PROJECTS_QUERY = gql`
  query allProjects($filter: ProjectFilter){ allProjects(filter: $filter) {
      id
      name,
      models
    }}
`;

const ADMIN_PROJECTS_QUERY = gql`
  query allProjects($filter: ProjectFilter){ allProjects(filter: $filter) {
      id
      name,
      models,
      user {
          id,
          email
      }
    }}
`;

const DELETE_PROJECT_MUTATION = gql`
  mutation deleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`;

export interface IFilterWithParams {
  filter?: string
  params?: string
}

export interface IProjectList {
    userId?: string
    adminMode?: boolean
    filter: any
}

export const ProjectList : React.FC<IProjectList> = ({filter, userId, adminMode = false}) => {
  const [unauthorized, setUnauthorized] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteObject, setDeleteObject] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingOnDeleteDialog, setDeletingOnDeleteDialog] = useState(false)

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>({})
  const [error, setError] = useState()

  const { refetch: userRefetch, loading: userLoading } = useQuery(adminMode? ADMIN_PROJECTS_QUERY : USER_PROJECTS_QUERY, {
    onError: (e) => {
      console.log('onError >>> ', e.message)
      if(e.message == 'GraphQL error: Unauhorized'){
        setUnauthorized(true)
      } else {
        setError(e)
      }
    }, onCompleted: (d) => {
      console.log('user: onCompleted', d)
      setLoading(false)
      setData(d)
    },
    variables: {filter}
  });

  const { refetch: adminRefetch } = useQuery(ADMIN_PROJECTS_QUERY, {
    onError: (e) => {
      console.log('onError >>> ', e.message)
      if(e.message == 'GraphQL error: Unauhorized'){
        setUnauthorized(true)
      } else {
        setError(e)
      }
    }, onCompleted: (d) => {
      console.log('admin: onCompleted', d)
      setLoading(false)
      // setData(d)
    }, skip: true
  });


  

    const [
      deleteProjectMutation,
      { loading: deleteLoading, error: deleteError }
    ] = useMutation(DELETE_PROJECT_MUTATION, {
      errorPolicy: "none",
      onCompleted: (data: any) => {
        console.log("DELETE", data.deleteProject);
        onHideDidaloDelete()
        userRefetch()
      },
      onError: (e) => {
        console.log('onError >>> ', e.message)
        if(e.message == 'GraphQL error: Unauhorized'){
          setUnauthorized(true)
        }
      },
    });

    const onHideDidaloDelete = () => {
      setShowDeleteDialog(false)
      setDeleteObject(null)
    }

    const onDelete = (obj:any) => {
      setDeletingOnDeleteDialog(false)
      setShowDeleteDialog(true)
      setDeleteObject(obj)
    }

    const doDelete = (deleteObject: any) => {
      setDeletingOnDeleteDialog(true)
      deleteProjectMutation({
        variables: {
          id: deleteObject.id
        }
      });
    }
    

    if(unauthorized) {
      return (<Unauthorized where={'projects'} />)
    }
    if (userLoading) return (<Loading what={'projects'} />);

    return (
        <div>
            
            {error && (<div>{`Error! ${error.message}`}</div>)}
            <Link to={'project-create'}>Create</Link>

            {
              data && data.allProjects && data.allProjects.map((projectItem:IListRowItem)=>(<ListRow item={projectItem} onDelete={onDelete} />))
            }
            
            <DeleteModal 
                  show={showDeleteDialog} 
                  onHide={onHideDidaloDelete}
                  onDelete={doDelete}
                  category={'project'}
                  deleteObject={deleteObject}
                  deleting={deletingOnDeleteDialog}
                  />
        </div>
    )
}

export default ProjectList