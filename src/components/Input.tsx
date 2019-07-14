import * as React from 'react';
import {WrappedFieldProps} from 'redux-form'

const style = {
    backgroundColor:'#fff',
    border: '1px solid #ddd',
    borderRadius:'4px',
    marginBottom: '10px',
    padding: '10px 15px',
    width: 'calc(100% - 30px)',
}

// as React.CSSProperties se agregar por textTransform ya que da error si no es agregado
const spanStyle = {
    color: '#777',
    fontSize: '10px',
    fontWeight: 900,
    textTransform: 'uppercase',    
} as React.CSSProperties

// label no lleva ? ya que debe ser obligatorio porner una etiqueta. 
interface IInputProps{
    placeholder?: string
    label: string
}
 
const Input: React.StatelessComponent <WrappedFieldProps & IInputProps> = props => {
    const {label} = props
        return (
            <div>
                <span style={spanStyle}> {label} </span>
                <input {...props} {...props.input} style ={style} />
            </div>
        )
}
export default Input 