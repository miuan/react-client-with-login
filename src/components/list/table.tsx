import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { useQuery, useMutation } from '@apollo/client';
import { ListRow } from './row';
import Loading from '../common/loading';
import DeleteModal from '../common/DeleteModal';
import Unauthorized from '../common/unauthorized';
import { DocumentNode } from 'graphql';
import { IFilteredField } from './row-item';
import { TableContainer, Table as CTable, TableBody, TableHead, TableRow, TableCell, Paper } from '@material-ui/core';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell)

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow)

export interface IFilterWithParams {
  filter?: string
  params?: string
}

export interface ITableQueries {
  ADMIN_LIST_QUERY: DocumentNode
  USER_LIST_QUERY: DocumentNode
  DELETE_MUTATION: DocumentNode
}

export interface IProjectList {
    userId?: string
    adminMode?: boolean
    filter: any
    queries: ITableQueries
    fields?: IFilteredField[]
    name: string
}

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
})

export const Table : React.FC<IProjectList> = ({filter, name, adminMode = false, queries, fields}) => {
  const classes = useStyles()

  const [unauthorized, setUnauthorized] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteObject, setDeleteObject] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingOnDeleteDialog, setDeletingOnDeleteDialog] = useState(false)

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>([])
  const [error, setError] = useState()

  const { refetch: userRefetch, loading: userLoading } = useQuery(adminMode? queries.ADMIN_LIST_QUERY : queries.USER_LIST_QUERY, {
    onError: (e) => {
      console.log('onError >>> ', e.message)
      if(e.message == 'GraphQL error: Unauhorized'){
        setUnauthorized(true)
      } else {
        //setError(e.toString())
      }
    }, onCompleted: (d) => {
      console.log('user: onCompleted', d)
      setLoading(false)

      const dataFields = Object.getOwnPropertyNames(d)
      if(dataFields.length > 0 && d[dataFields[0]].length > 0){
        setData(d[dataFields[0]])
      } else {
        setData([])
      }
      
    },
    variables: {filter}
  });


  

    const [
      deleteProjectMutation,
      { loading: deleteLoading, error: deleteError }
    ] = useMutation(queries.DELETE_MUTATION, {
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
            {/* {error && (<div>{`Error! ${error.message}`}</div>)} */}
            
            <TableContainer component={Paper}>
              <CTable className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    {fields?.map(f => (f!=='id' && <StyledTableCell>{(f as any).name ? (f as any).name : f}</StyledTableCell>))}
                    {adminMode && <StyledTableCell>User</StyledTableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                { data.length && data.map((projectItem:any)=>(<StyledTableRow><ListRow name={name} item={projectItem} onDelete={onDelete} fields={fields} /></StyledTableRow>)) }
                  {/* {rows.map((row) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell component="th" scope="row">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="right">{row.calories}</StyledTableCell>
                      <StyledTableCell align="right">{row.fat}</StyledTableCell>
                      <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                      <StyledTableCell align="right">{row.protein}</StyledTableCell>
                    </StyledTableRow> ))} */}
                </TableBody>
              </CTable>
            </TableContainer>


            {/* <BTable responsive>
              <thead>
                <tr>
                  <th>Id</th>
                  {fields?.map(f => (f!=='id' && <th>{(f as any).name ? (f as any).name : f}</th>))}
                  {adminMode && <th>User</th>}
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {
                data.length && data.map((projectItem:any)=>(<ListRow name={name} item={projectItem} onDelete={onDelete} fields={fields} />))
              }
              </tbody>
            
            </BTable> */}
            
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

export default Table