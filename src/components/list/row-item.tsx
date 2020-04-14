import React from "react";
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap'
import './row.scss'

export interface IListRowParams {
  item: any
  name: string
}
export const ListRowItem: React.FC<IListRowParams> = ({ item, name }) => {
  const names = name.split('.')
  const element = item[names[0]]

  if(!element) {
    return (<>ERR NOT EXIST:{name}</>)
  }

  if(element.substr && element.length > 50) {
    return (<>{element.substr(0, 47)}...</>)
  }

  if(element.push && element.reduce && names.length > 1) {
    return (<>{(element as any[]).reduce((p, e)=>p + e[names[1]], '')}</>)
  }

  return (
    <>
    {element}
    </>
  );
};

