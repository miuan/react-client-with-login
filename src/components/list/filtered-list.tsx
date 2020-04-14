import React, {useState, useEffect, useCallback} from 'react'
import {Link, useHistory} from 'react-router-dom'
import Table, {ITableQueries} from './table'
import FilterItem from './filter-item'
import {Navbar, Button} from 'react-bootstrap'
import './filtered-list.scss'

export interface IProjectFilterList {
    name: string,
    userId?: string 
    adminMode?: boolean
    queries: ITableQueries
    fields: string[]
}

const createFilter = () => {
    let obj:any = []
    obj.name = 'AND'
    return {AND: obj}
}

const addAnd = (node:any, filter:any) => {

    let obj:any = filter

    if(node.name != 'AND'){
        obj = [obj]
        obj.name = 'AND'
    }

    node.push(obj)
}

const filterDestructNode = (node: any) => {
    let filter = ''

    for(const n of node) {
        if(n.name && n.length > 0) {
            filter += `,${filterDestructNode(n)}` 
        } else {
            filter += `,{${n.filter}}`
        }
    }

    return `{${node.name}:[${filter.substr(1)}]}`
}

const filterDestruct = (filter: any) => {
    let fo = {
        filter: '',
        params: '',
    }

    fo.filter = filter.AND.length > 0 ? `(filter: ${filterDestructNode(filter.AND)})` : ''
    fo.params = fo.params.length> 2 ? `(${fo.params.substr(1)})` : ''

    return fo
}


export const FilteredList:React.FC<IProjectFilterList> = ({name, userId, adminMode=false, queries, fields}) => {

    const [filter, setFilter] = useState(createFilter())
    const history = useHistory()

    // console.log(filter, listFilter)
    const createDefaultFilter = (userId? : string) => {
        const defaultFilter = createFilter()
        
        if(userId){
            addAnd(defaultFilter.AND, {user_every:{id:userId}})
        }
        
        return defaultFilter
    }

    const processFilter = (filter: any) => {
        const filterDestructed = filterDestruct(filter)
        
        console.log('processFilter', {filter, filterDestructed})

        setFilter(filter)
    }

    useEffect(()=>{
        const defaultFilter = createDefaultFilter(userId)
        processFilter(defaultFilter)
        
    }, [userId])

    const onFilterChange = useCallback((f: string | null) => {
        const defaultFilter = createDefaultFilter(userId)
        
        if(f) {
            addAnd(defaultFilter.AND,f)
        }
        
        processFilter(defaultFilter)

    }, [userId])

    const onCreateNew = () => {
        history.push('/user/' + name.toLowerCase() + '/create' )
    }


    return (
        <div>
            <div className="row-head">
                <div>
                <h3>{name}</h3>
                </div>
                <FilterItem fields={fields} onChange={onFilterChange} />
                <div>
                <Button onClick={onCreateNew}>Create New</Button>
                </div>
                
            </div>
            <div className="row-table">
           
            <Table name={name} filter={filter} queries={queries} adminMode={adminMode} fields={fields} />
            </div>
            
        </div>
        
    )
}

export default FilteredList