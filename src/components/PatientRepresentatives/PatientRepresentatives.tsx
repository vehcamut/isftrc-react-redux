import { Button, Modal, Typography, Descriptions, message } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mutationErrorHandler } from '../../app/common';
import { patientsAPI, representativesAPI } from '../../app/services';
import { IPatient } from '../../models';
import { useAppSelector } from '../../app/hooks';
import RepresentativesTable from '../RepresentativesTable/RepresentativesTable';
import UserForm from '../UserForm/UserForm';

interface PatientRepresentativesProps extends PropsWithChildren {
  patient?: IPatient;
}
const { confirm } = Modal;

const PatientRepresentatives: FunctionComponent<PatientRepresentativesProps> = ({ patient }) => {
  const { roles } = useAppSelector((state) => state.authReducer);
  const isAdmin = roles.find((r) => r === 'admin');
  const [messageApi, contextHolder] = message.useMessage();
  const [addRepresentative] = representativesAPI.useAddRepresentativeMutation();
  const [addPatientToRepresentative] = representativesAPI.useAddPatientToRepresentativeMutation();
  const [removePatientFromRepresentative] = representativesAPI.useRemovePatientFromRepresentativeMutation();
  const [isModalAddOpened, setIsModalAddOpened] = useState(false);
  const [isModalNewOpened, setIsModalNewOpened] = useState(false);
  const navigate = useNavigate();

  const onRemove = (representativeRecord: any) => {
    const showConfirm = () => {
      confirm({
        title: 'Вы точно хотите отвязать пациента от представителя?',
        icon: <ExclamationCircleFilled />,
        async onOk() {
          try {
            await removePatientFromRepresentative({
              patientId: patient?._id || '',
              representativeId: representativeRecord?._id || '',
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
      const representativeId = await addRepresentative(values).unwrap();
      await addPatientToRepresentative({ patientId: patient?._id || '', representativeId }).unwrap();
      onModalNewClose();
      messageApi.open({
        type: 'success',
        content: 'Представитель успешно добавлен и связан с пациентом.',
      });
    } catch (e: any) {
      mutationErrorHandler(messageApi, e);
    }
  };
  const onRowClick = async (representative: any) => {
    try {
      await addPatientToRepresentative({
        patientId: patient?._id || '',
        representativeId: representative._id,
      }).unwrap();
      setIsModalAddOpened(false);
      messageApi.open({
        type: 'success',
        content: 'Пациент успешно связан с представителем.',
      });
    } catch (e: any) {
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
            Добавление существующего представителя
          </Typography.Title>
        }
        width="100%"
        onCancel={onModalAddClose}
      >
        <RepresentativesTable
          onRowClick={onRowClick}
          dataSourseQuery={representativesAPI.useGetRepresentativesQuery}
          extraOptions={{ patientId: patient?._id }}
        />
      </Modal>
      <Modal
        destroyOnClose
        open={isModalNewOpened}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Добавление нового представителя
          </Typography.Title>
        }
        width="100%"
        onCancel={onModalNewClose}
      >
        <UserForm onReset={onModalNewClose} onFinish={onFinishAddNew} userType="representative" />
      </Modal>
      <Descriptions
        title="Представители пациента"
        extra={
          isAdmin ? (
            <>
              <Button
                type="primary"
                onClick={onModalNewOpen}
                style={{ marginRight: '10px' }}
                disabled={!patient?.isActive}
              >
                Добавить нового
              </Button>
              <Button type="primary" onClick={onModalAddOpen} disabled={!patient?.isActive}>
                Добавить существующего
              </Button>
            </>
          ) : undefined
        }
      >
        <Descriptions.Item contentStyle={{ flexDirection: 'column' }}>
          <RepresentativesTable
            onRemove={isAdmin && (patient?.isActive ? onRemove : false)}
            onRowClick={isAdmin ? (record) => navigate(`/representatives/${record._id}/info`) : undefined}
            dataSourseQuery={patientsAPI.useGetPatientRepresentativesQuery}
            hasSearch={false}
            extraOptions={{ id: patient?._id }}
          />
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

PatientRepresentatives.defaultProps = {
  patient: undefined,
};

export default PatientRepresentatives;
