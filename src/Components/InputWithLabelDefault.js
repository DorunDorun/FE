import React from 'react'
import styled from 'styled-components'


function InputWithLabelDefault({autoFocus, inputType, inputId, inputValue, inputPaceholder, 
  onChange, onBlur, validMessage, width, labelWidth, positionLeft, height, 
  labelText, className, inputRef, disabled, maxLength}) {
  return (
    <>
      { labelText
      ? <StLabelWrap labelWidth={labelWidth}>
          <StLabelDefault htmlfor={inputId} >{labelText}</StLabelDefault> 
          {validMessage && <StValidMessageSpan positionLeft={positionLeft}> {validMessage}</StValidMessageSpan>}
      </StLabelWrap>
      : validMessage && <StValidMessageSpan positionLeft={positionLeft}> {validMessage}</StValidMessageSpan>
      }
      <StInputDefault type={inputType} id={inputId} value={inputValue} 
      placeholder={inputPaceholder}
      onChange={onChange}
      onBlur={onBlur}
      required
      autoFocus={autoFocus||null}
      width={width}
      height={height}
      className={className||null}
      ref={inputRef}
      disabled={disabled}
      maxLength={maxLength}
      />
    </>
  )
}


const StValidMessageSpan=styled.span`
  margin-left: 10px;
  color: red;
  position: absolute;
  left: ${(props)=>props.positionLeft || "0"};
  bottom: -22px;
`
const StLabelWrap=styled.span`
  display: inline-block;
  width: ${(props)=>props.labelWidth || "auto"}
`
const StLabelDefault=styled.label`
  display: inline-block;
  font-weight: bold;
  margin-right: 10px;
`
const StInputDefault=styled.input.attrs(props=>({
    type:props.type || 'text',
    size:props.size || '10'
}))`
  display: block;
  width: ${(props) => props.width || "auto"};
  height: ${(props) => props.height || "auto"};
  padding: 10px;
  border: 1px solid #d2d2d2;
  border-radius: 5px;

`


export default InputWithLabelDefault
