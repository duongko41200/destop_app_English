export const boxStyles = {
  backgroundColor: '#fff',
  color: '#000000de',
  WebkitTransition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  borderRadius: '4px',
  boxShadow:
    '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
  overflow: 'hidden',
  marginTop: '1em'
}

export const disabledInputBackgroundStyle = {
  '& .MuiFilledInput-input': {
    background: '#f4f4f5c4'
  },
  '& .Mui-disabled': {
    WebkitTextFillColor: '#4d4d4d !important'
  }
}

export const textareaStyles = {
  width: '100%',
  height: 500,
  padding: '20px',
  borderRadius: 4,
  background: '#f8f8f8',
  fontSize: 16,
  overflow: 'auto'
}

export const imageFieldStyles = {
  '& img': {
    maxWidth: 100,
    maxHeight: 100,
    objectFit: 'contain'
  }
}

export const styleBoxCustom = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 5,
  paddingTop: '6px',
  paddingRight: '12px',
  paddingBottom: '4px',
  paddingLeft: '12px',
  boxSizing: 'content-box',
  color: 'rgba(0, 0, 0, 0.6)',
  background: 'rgba(0, 0, 0, 0.04)',
  marginTop: '8px',
  marginBottom: '4px',
  fontWeight: '400',
  fontSize: '1rem',
  lineHeight: '1.4375em',
  letterSpacing: '0.00938em',
  borderTopLeftRadius: '4px',
  borderTopRightRadius: '4px',
  borderBottom: '1px solid',
  borderColor: 'light-dark(rgb(118, 118, 118), rgb(133, 133, 133))',
  width: 'fit-content',
  minWidth: '300px'
}
export const smallHelperTextStyle = {
  '& .MuiFormHelperText-root': {
    lineHeight: '1'
  }
}

export const noMarginVertical = {
  '& .MuiTextField-root': {
    margin: '0px 0px'
  }
}

export const smallTextInputStyles = {
  '& .MuiOutlinedInput-input': {
    padding: '8px 8px 8px 8px',
    height: '1.2rem',
    backgroundColor: '#fff'
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem'
  },
  ...noMarginVertical,
  ...smallHelperTextStyle
}
