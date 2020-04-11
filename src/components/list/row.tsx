import React from "react";
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap'
import './row.scss'
export interface IListRowItem {
  id: string;
  name: string;
  user: any
}

export interface IListRowParams {
  item: any;
  fields?: string[]
  onDelete: (obj: any) => void
}
export const ListRow: React.FC<IListRowParams> = ({ item, onDelete, fields=['id'] }) => {
  return (
    <tr className="row1">
      
      <td className="id"><Link to={`/user/project/${item.id}`}>{item.id}</Link></td>
      {fields.map(fieldName=>(fieldName !=='id' && <td>{item[fieldName].substr(0,15)}</td>))}
      {item.user && (<td>{item.user.email}</td>)}
      
      <td className="right">
        <Button variant="danger" size="sm" onClick={()=>{onDelete(item)}}>delete</Button>
      </td>
    </tr>
  );
};

