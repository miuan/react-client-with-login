import React, {useState, useEffect, useCallback} from 'react'
import ProjectLIst from './list'
import FilterItem from './filteritem'

export interface IProjectFilterList {
    userId?: string 
    adminMode?: boolean
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


export const ProjectFilterList:React.FC<IProjectFilterList> = ({userId, adminMode=false}) => {

    const [filter, setFilter] = useState(createFilter())

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


    return (
        <div>
            <h1>List projects</h1>
            <div> 
                <FilterItem fields={['name','id','model']} onChange={onFilterChange} />
            </div>
            <ProjectLIst filter={filter} />
        </div>
        
    )
}

export default ProjectFilterList