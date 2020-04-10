import React, {useState, useEffect, useCallback} from 'react'
import { Col, Form, Alert, Button } from "react-bootstrap";


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

    const onFieldChange = (e:any) => {
        const field = e.target.value
        console.log('onFieldChange', e, field)
        setFieldSelected(field)
        processFilter(field, optionSelected, filterText)
    }

    const onOptionChange = (e:any) => {
        const option = e.target.value
        console.log('onOptionChange', e, option)
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




    return (
        <Form>
            <Form.Row>
                {/* <Form.Group  as={Col} md="1">
                    <Button size="sm">and</Button> / <Button size="sm">or</Button>
                </Form.Group> */}
                <Form.Group  as={Col} md="1">
                    <Form.Control as="select" value={fieldSelected} onChange={onFieldChange} size="sm">
                        {fields.map((o)=> (<option key={o}  value={o}>{o}</option>))}
                    </Form.Control>
                </Form.Group>
                <Form.Group  as={Col} md="1">
                    <Form.Control as="select" value={optionSelected}  onChange={onOptionChange} size="sm">
                        {Object.getOwnPropertyNames(basicOptionsName).map((o: string)=> (<option key={o} value={o}>{basicOptionsName[o as basicOptionsNameType]}</option>))}
                    </Form.Control>
                </Form.Group>
                
                <Form.Group  as={Col} md="6">
                    <Form.Control value={filterText} onChange={onFilterChange}/>
                </Form.Group>
            </Form.Row>
        </Form>
    )
}

export default FilterItem