import React from 'react'
import styled from 'styled-components'


function InputWithLabelDefault({autoFocus, inputType, inputId, inputValue, inputPaceholder, 
  onChange, onBlur, validMessage, width, labelText, className, inputRef, disabled,}) {
  return (
    <>
      { labelText
      ? <StLabelWrap><StLabelDefault htmlfor={inputId}>{labelText}</StLabelDefault> 
          {validMessage && <StValidMessageSpan> {validMessage}</StValidMessageSpan>}
      </StLabelWrap>
      : validMessage && <StValidMessageSpan> {validMessage}</StValidMessageSpan>
      }
      <StInputDefault type={inputType} id={inputId} value={inputValue} 
      placeholder={inputPaceholder}
      onChange={onChange}
      onBlur={onBlur}
      required
      autoFocus={autoFocus||null}
      width={width}
      className={className||null}
      ref={inputRef}
      disabled={disabled}
      />
    </>
  )
}


const StValidMessageSpan=styled.span`
  color:red;
`
const StLabelWrap=styled.span`
  margin-bottom: 10px;
`
const StLabelDefault=styled.label`
  margin-right: 10px;
`
const StInputDefault=styled.input.attrs(props=>({
    type:props.type || 'text',
    size:props.size || '10'
}))`
  display: block;
  width: ${(props) => props.width || "auto"};
  height: 15px;
  padding: 10px;
  border: 1px solid #d2d2d2;
  border-radius: 5px;
  margin-bottom: 15px;

`


export default InputWithLabelDefault
