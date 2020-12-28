import React from 'react'
import { Link } from 'react-router-dom'
import {Button, Menu, MenuItem} from '@material-ui/core'

const UserHeader = ({user, onLogout}:any) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    }
    return (
        <div>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                Open Menu
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem href="/user/projects" onClick={handleClose}>All Projects</MenuItem>
                <MenuItem onClick={handleClose}>User</MenuItem>
                <MenuItem onClick={onLogout}>Logout</MenuItem>
            </Menu>
        {/* <Nav>
            <Nav.Item>
            <Dropdown>
            <Dropdown.Toggle variant="secondary" size="sm" id="dropdown-basic">
            User Menu
            </Dropdown.Toggle>

            <Dropdown.Menu>
            <Dropdown.Item href="/user/projects">All Projects</Dropdown.Item>
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
            <Dropdown.Item href="/admin/projects">All Projects</Dropdown.Item>
            <Dropdown.Item href="/admin/users">All Users</Dropdown.Item>
            <Dropdown.Item href="/admin/roles">All Roles</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </Nav.Item>

    </Nav> */}

    </div>

    )
}

export default UserHeader