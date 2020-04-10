import React from "react";
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap'

export interface IListRowItem {
  id: string;
  name: string;
  user: any
}

export interface IListRowParams {
  item: IListRowItem;
  onDelete: (obj: any) => void
}
export const ListRow: React.FC<IListRowParams> = ({ item, onDelete }) => {
  return (
    <div>
      {item.id} <Link to={`/project/${item.id}`}>{item.name}</Link> {item.user && item.user.email}
      <Button variant="danger" size="sm" onClick={()=>{onDelete(item)}}>delete</Button>
    </div>
  );
};
