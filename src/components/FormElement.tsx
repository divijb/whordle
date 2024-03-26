import React, {type ReactNode} from 'react';
import styled from 'styled-components';

const StyledFormElement = styled.div`
  display: flex;
  .form-label {
    width: 200px;
    text-align: right;
    line-height: 32px;
    vertical-align: center;
  }
  .form-field {
    margin-left: 20px;
  }
`;

const FormElement = ({ label, children }: {label: string | ReactNode, children: ReactNode}) => (
  <StyledFormElement>
    <div className="form-label"> {label} </div>
    <div className="form-field"> {children} </div>
  </StyledFormElement>
);

export default FormElement;
