import React, { useState, useContext } from 'react'
import gql from 'graphql-tag'
import { useQuery, useLazyQuery } from '@apollo/client'
import { useHistory } from "react-router-dom";
import { User, useUserDispatch, USER_LOGIN } from '../../contexts/userContext';
import { Modal, Form, Button, Alert } from 'react-bootstrap'

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
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <div>
                        <Modal.Title>Delete {'>>'} {deleteObject && deleteObject.name}  {'<<'}</Modal.Title>
                    </div>
                    
                </Modal.Header>

                <Modal.Body>
                    {!deleting ? (<p>Are you sure, you want delete {category} item with name <b>'{deleteObject && deleteObject.name}'</b> and id <i>'{deleteObject && deleteObject.id}'</i></p>) : 
                                (<p>Deleting {category} item with name '{deleteObject && deleteObject.name}' and id '{deleteObject && deleteObject.id}' ...</p>) }
                </Modal.Body>

                <Modal.Footer>
                    <Button disabled={deleting} variant="danger" type="submit" onClick={onDeleteAction}>Delete</Button>
                    <Button disabled={deleting} variant="primary" onClick={onHide}>Close</Button>
                </Modal.Footer>
            </Modal>


        </div>
    )
}

export default DeleteModal