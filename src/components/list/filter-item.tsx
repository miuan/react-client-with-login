import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core'
import React, {useState, useEffect, useCallback} from 'react'
import './filter-item.scss'

const basicOptionsName = {
    contains : 'contains',
    not_contains : 'not contains',
    starts_with : 'starts with',
    not_starts_with : 'not starts with',
    ends_with : 'ends with',
    not_ends_with : 'not ends with',
    isEmpty : 'is empty',
}

type basicOptionsNameType = 'contains' | 'not_contains' | 'starts_with' | 'not_starts_with' | 'ends_with' | 'not_ends_with' | 'isEmpty'



export interface IFilterItemParam {
    fields: any[]
    onChange: (filter: string | null) => void
}

  

export const FilterItem: React.FC<IFilterItemParam> = ({fields, onChange}) => {
    const [fieldSelected, setFieldSelected] = useState(fields[0])
    const [optionSelected, setOptionSelected] = useState('contains')
    const [filterText, setFilterText] = useState('')
    const [filter, setFilter] = useState<string|null>('null')

    const onFieldChange = (field:any) => {
        console.log('onFieldChange', field)
        setFieldSelected(field)
        processFilter(field, optionSelected, filterText)
    }

    const onOptionChange = (option:any) => {
        console.log('onOptionChange', option)
        setOptionSelected(option)
        processFilter(fieldSelected, option, filterText)
    }

    const onFilterChange = (e:any) => {
        const text = e.target.value
        console.log('onFilterChange', e, text)
        setFilterText(text)
        processFilter(fieldSelected, optionSelected, text)
    }

    const doFilter = useCallback((f: string | null) => {
        if(filter != f){
            console.log('useFilter>>>', f)
            setFilter(f)
            onChange(f)
        }
    }, [filter, onChange, setFilter])

    const processFilter = useCallback((field, option, text) => {
        if(!text && option != 'isEmpty') {
            doFilter(null)
            return
        }

        const f = {} as any
        f[`${field}_${option}`] = text
        doFilter(f)

    }, [doFilter] )

    const gc = (o:any) => {
        const o2 = o
        return () => {onFieldChange(o2)}
    }

    const go = (o:any) => {
        const o2 = o
        return () => {onOptionChange(o2);}
    }


    return (<FormControl>
    <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={fieldSelected}
        //   onChange={handleChange}
        >
            {fields.map((o)=> (<MenuItem value={o} onClick={gc(o)}>{o}</MenuItem>))}
         
        </Select>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select2"
          value={fieldSelected}
        //   onChange={handleChange}
        >
           {Object.getOwnPropertyNames(basicOptionsName).map((o)=> (<MenuItem value={o} onClick={go(o)}>{basicOptionsName[o as basicOptionsNameType]}</MenuItem>))}
         
        </Select>
        <TextField id="standard-basic" label="Standard" value={filterText} onChange={onFilterChange} />
      </FormControl>)

    // return (
    //     <InputGroup className="mb-3">
    //         <DropdownButton
    //             className="field-option"
    //             as={InputGroup.Prepend}
    //             variant="success"
    //             title={fieldSelected}
    //             id="input-group-dropdown-1" >
    //                 {fields.map((o)=> (<Dropdown.Item key={o} onClick={gc(o)}>{o}</Dropdown.Item>))}
    //         </DropdownButton>
    //         <DropdownButton
    //             className="select-option"
    //             as={InputGroup.Prepend}
    //             variant="outline-link"
    //             title={basicOptionsName[optionSelected as basicOptionsNameType]}
    //             id="input-group-dropdown-1" >
    //                 {Object.getOwnPropertyNames(basicOptionsName).map((o)=> (<Dropdown.Item key={o} onClick={go(o)}>{basicOptionsName[o as basicOptionsNameType]}</Dropdown.Item>))}
    //         </DropdownButton>
    //         <Form.Control value={filterText} onChange={onFilterChange}/>
    //     </InputGroup>)

}

export default FilterItem