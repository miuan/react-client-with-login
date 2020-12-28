import React from "react"
import {Dialog } from '@material-ui/core';

export const Unauthorized = ({where = ''}) => {
    return (<Dialog open={true}>{`Unauthorized ${where} access`}</Dialog >)
}

export default Unauthorized