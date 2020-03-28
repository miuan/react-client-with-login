import React from "react";
import { Link } from "react-router-dom";

export interface IListRowItem {
  id: string;
  name: string;
}

export interface IListRowParams {
  item: IListRowItem;
}
export const ListRow: React.FC<IListRowParams> = ({ item }) => {
  return (
    <div>
      {item.id} <Link to={`/project/${item.id}`}>{item.name}</Link>
    </div>
  );
};
