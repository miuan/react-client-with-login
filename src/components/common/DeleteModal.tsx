import React, { useState, useContext } from 'react'
import gql from 'graphql-tag'
import { useQuery, useLazyQuery } from '@apollo/client'
import { useHistory } from "react-router-dom";
import { User, useUserDispatch, USER_LOGIN } from '../../contexts/userContext';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle  } from '@material-ui/core';

export interface IDeleteModalParams { 
    show: boolean, 
    onHide: () => void, 
    onDelete: (deleteObject: any) => void,
    category: string,
    deleteObject? : any
    deleting? : boolean
}

export const DeleteModal: React.FC<IDeleteModalParams> = ({ show, onHide, onDelete, category, deleteObject, deleting }) => {

    const onDeleteAction = () => {
        if(!deleting){
            onDelete(deleteObject)
        }
    }

    return (
        <div>
            <Dialog  open={show} onClose={onHide}>
                <DialogTitle >
                    <>{'Delete >>'} {deleteObject && deleteObject.name}  {'<<'}</>
                    
                    
                </DialogTitle>

                <DialogContent>
                    {!deleting ? (<p>Are you sure, you want delete {category} item with name <b>'{deleteObject && deleteObject.name}'</b> and id <i>'{deleteObject && deleteObject.id}'</i></p>) : 
                                (<p>Deleting {category} item with name '{deleteObject && deleteObject.name}' and id '{deleteObject && deleteObject.id}' ...</p>) }
                </DialogContent>

                <DialogActions>
                    <Button disabled={deleting} color="secondary" type="submit" onClick={onDeleteAction}>Delete</Button>
                    <Button disabled={deleting} color="primary" onClick={onHide}>Close</Button>
                </DialogActions>
            </Dialog>


        </div>
    )
}

export default DeleteModal