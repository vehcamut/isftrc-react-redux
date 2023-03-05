import { Modal, Result } from 'antd';
import React from 'react';

const ErrorResult = () => {
  return (
    <Modal closable={false} footer={false} open width="100%" centered>
      <Result
        status="500"
        title="500"
        subTitle={
          <div style={{ color: 'black', whiteSpace: 'pre-line' }}>
            {'Похоже что-то пошло не так.\nМы уже работаем над этим.\nПопробуйте позже.'}
          </div>
        }
      />
    </Modal>
  );
};

export default ErrorResult;
