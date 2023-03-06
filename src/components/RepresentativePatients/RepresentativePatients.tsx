/* eslint-disable react/jsx-props-no-spreading */
import { Button, Modal, Typography, Descriptions, message } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mutationErrorHandler } from '../../app/common';
import { patientsAPI, representativesAPI } from '../../app/services';
import { IRepresentative } from '../../models';
import AddPatientForm from '../AddPatientForm/AddPatientForm';
import PatientsTable from '../PatientsTable/PatientsTable';

interface RepresentativePatientsProps extends PropsWithChildren {
  representative?: IRepresentative;
}
const { confirm } = Modal;

const RepresentativePatients: FunctionComponent<RepresentativePatientsProps> = ({ representative }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [addPatient] = patientsAPI.useAddPatientMutation();
  const [addPatientToRepresentative] = representativesAPI.useAddPatientToRepresentativeMutation();
  const [removePatientFromRepresentative] = representativesAPI.useRemovePatientFromRepresentativeMutation();
  const [isModalAddOpened, setIsModalAddOpened] = useState(false);
  const [isModalNewOpened, setIsModalNewOpened] = useState(false);
  const navigate = useNavigate();

  const onRemove = (patient: any) => {
    const showConfirm = () => {
      confirm({
        title: 'Вы точно хотите отвязать пациента от представителя?',
        icon: <ExclamationCircleFilled />,
        async onOk() {
          try {
            await removePatientFromRepresentative({
              patientId: patient._id,
              representativeId: representative?._id || '',
            }).unwrap();
            messageApi.open({
              type: 'success',
              content: 'Пациент успешно отвязан.',
            });
          } catch (e) {
            mutationErrorHandler(messageApi, e);
          }
        },
        okText: 'Да',
        cancelText: 'Нет',
      });
    };
    showConfirm();
  };

  const onModalAddClose = () => {
    setIsModalAddOpened(false);
  };
  const onModalAddOpen = () => {
    setIsModalAddOpened(true);
  };
  const onModalNewClose = () => {
    setIsModalNewOpened(false);
  };
  const onModalNewOpen = () => {
    setIsModalNewOpened(true);
  };
  const onFinishAddNew = async (values: any) => {
    try {
      const patientId = await addPatient(values).unwrap();
      await addPatientToRepresentative({ patientId, representativeId: representative?._id || '' }).unwrap();
      onModalNewClose();
      messageApi.open({
        type: 'success',
        content: 'Пациент успешно добавлен.',
      });
    } catch (e) {
      mutationErrorHandler(messageApi, e);
    }
  };
  const onRowClick = (patient: any) => {
    try {
      addPatientToRepresentative({ patientId: patient._id, representativeId: representative?._id || '' });
      setIsModalAddOpened(false);
      messageApi.open({
        type: 'success',
        content: 'Пациент успешно добавлен.',
      });
    } catch (e) {
      mutationErrorHandler(messageApi, e);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        destroyOnClose
        open={isModalAddOpened}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Добавление существующего пациента
          </Typography.Title>
        }
        width="100%"
        onCancel={onModalAddClose}
      >
        <PatientsTable
          onRowClick={onRowClick}
          dataSourseQuery={patientsAPI.useGetPatientsQuery}
          hasSearch
          extraOptions={{ representativeId: representative?._id }}
        />
      </Modal>
      <Modal
        destroyOnClose
        open={isModalNewOpened}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Добавление нового пациента
          </Typography.Title>
        }
        width="100%"
        onCancel={onModalNewClose}
      >
        <AddPatientForm onReset={onModalNewClose} onFinish={onFinishAddNew} />
      </Modal>
      <Descriptions
        size="middle"
        title="Пациенты представителя"
        extra={
          <>
            <Button
              type="primary"
              onClick={onModalNewOpen}
              style={{ marginRight: '10px' }}
              disabled={!representative?.isActive}
            >
              Новый
            </Button>
            <Button type="primary" onClick={onModalAddOpen} disabled={!representative?.isActive}>
              Добавить
            </Button>
          </>
        }
      >
        <Descriptions.Item contentStyle={{ flexDirection: 'column' }}>
          <PatientsTable
            onRemove={representative?.isActive ? onRemove : false}
            onRowClick={(record) => navigate(`/patients/${record._id}/info`)}
            dataSourseQuery={representativesAPI.useGetRepresentativePatientsByIdQuery}
            hasSearch={false}
            extraOptions={{ id: representative?._id }}
          />
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

RepresentativePatients.defaultProps = {
  representative: undefined,
};

export default RepresentativePatients;
