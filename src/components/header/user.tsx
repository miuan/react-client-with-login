import React from 'react'
import { Link } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from 'react-bootstrap/Nav'
import Badge from 'react-bootstrap/Badge'

const UserHeader = ({user, onLogout}:any) => {

    return (
        <div>
        <Nav>
            <Nav.Item>
            <Dropdown>
            <Dropdown.Toggle variant="secondary" size="sm" id="dropdown-basic">
            ...
            </Dropdown.Toggle>

            <Dropdown.Menu>
            <Dropdown.Item ><Link to={'project-list'}>My Projects</Link><Badge variant="secondary">Create</Badge></Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#/action-2">User</Dropdown.Item>
            <Dropdown.Item href="#/action-3" onClick={onLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </Nav.Item>
        
        <Nav.Item>
        
        <Dropdown>
            <Dropdown.Toggle variant="secondary" size="sm" id="dropdown-basic">
            Admin
            </Dropdown.Toggle>

            <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">All Projects</Dropdown.Item>
            <Dropdown.Item href="#/action-2">All Users</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </Nav.Item>

    </Nav>

    </div>

    )
}

export default UserHeader