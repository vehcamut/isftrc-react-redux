/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: ПРОВЕРИТЬ ДОБАВЛЕНИЕ
import { Button, Modal, Typography, Descriptions, message, Input, Table, Tooltip } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { DeleteOutlined, DeleteRowOutlined, ExclamationCircleFilled, FilterFilled } from '@ant-design/icons';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';
import { addClass } from '../../app/common';
import { patientsAPI, representativesAPI } from '../../app/services';
import classes from './PatientRepresentatives.module.scss';
import { IPatient, IRepresentative } from '../../models';
import AddPatientForm from '../AddPatientForm/AddPatientForm';
// import AddRepresentativeForm from '../AddRepresentativeForm/AddRepresentativeForm';
import { patientTableSlice } from '../../app/reducers';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PatientsTable from '../PatientsTable/PatientsTable';
import RepresentativesTable from '../RepresentativesTable/RepresentativesTable';
import UserForm from '../UserForm/UserForm';

interface PatientRepresentativesProps extends PropsWithChildren {
  // eslint-disable-next-line react/require-default-props
  patient?: IPatient;
}
const { Search } = Input;
const { confirm } = Modal;

const PatientRepresentatives: FunctionComponent<PatientRepresentativesProps> = ({ patient }) => {
  const { roles } = useAppSelector((state) => state.authReducer);
  const isAdmin = roles.find((r) => r === 'admin');
  const state1 = useAppSelector((state) => state.patientTableReducer);
  // const { setPage, setLimit, setFilter, setIsActive } = patientTableSlice.actions;

  const [messageApi, contextHolder] = message.useMessage();
  const [addPatient] = patientsAPI.useAddPatientMutation();
  const [addRepresentative] = representativesAPI.useAddRepresentativeMutation();
  const [updateRepresentative] = representativesAPI.useUpdateRepresentativeMutation();
  const [addPatientToRepresentative] = representativesAPI.useAddPatientToRepresentativeMutation();
  const [removePatientFromRepresentative] = representativesAPI.useRemovePatientFromRepresentativeMutation();
  const [changeStatus] = patientsAPI.useChangePatientStatusMutation();
  const [isModalAddOpened, setIsModalAddOpened] = useState(false);
  const [isModalNewOpened, setIsModalNewOpened] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isActive, setIsActive] = useState<boolean | undefined>(true);
  // const { limit, page, filter, isActive } = useAppSelector((state) => state.patientTableReducer);
  // const { data, isLoading } = representativesAPI.useGetRepresentativePatientsByIdQuery({
  //   id: patient?._id || '',
  //   isActive,
  // });

  const onRemove = (representativeRecord: any) => {
    const showConfirm = () => {
      confirm({
        title: 'Вы точно хотите отвязать пациента от представителя?',
        icon: <ExclamationCircleFilled />,
        onOk() {
          removePatientFromRepresentative({
            patientId: patient?._id || '',
            representativeId: representativeRecord?._id || '',
          });
          messageApi.open({
            type: 'success',
            content: 'Пациент успешно отвязан.',
          });
        },
        okText: 'Да',
        cancelText: 'Нет',
      });
    };
    showConfirm();
  };
  const onAddClick = () => {
    navigate('/patients/add', { replace: true });
  };
  const onFinish = async (values: any) => {
    try {
      // await updateRepresentative({ ...representative, ...values }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Данные представителя успешно обновлены',
      });
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
    }
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
      await addPatientToRepresentative({ patientId: patient?._id || '', representativeId });
      onModalNewClose();
      messageApi.open({
        type: 'success',
        content: 'Представитель успешно добавлен и связан с пациентом.',
      });
      // setIsAdded(true);
      // navigate('/patients', { replace: true });
      // messageApi.open({
      //   type: 'success',
      //   content: 'Пациент успешно добавлен',
      //   onClose: () => navigate('/patients', { replace: true, state: { add: true } }),
      //   // 'Ошибка связи с сервером',
      // });
      // navigate('/patients', { replace: true });
    } catch (e: any) {
      if (e?.data?.message) {
        messageApi.open({
          type: 'error',
          content: e?.data?.message,
          // 'Ошибка связи с сервером',
        });
      } else {
        messageApi.open({
          type: 'error',
          content: 'Ошибка связи с сервером',
          // 'Ошибка связи с сервером',
        });
      }
      // console.log('ERROR!');
    }
  };
  const onRowClick = (representative: any) => {
    addPatientToRepresentative({ patientId: patient?._id || '', representativeId: representative._id });
    setIsModalAddOpened(false);
    messageApi.open({
      type: 'success',
      content: 'Пациент успешно связан с представителем.',
    });
    // alert(r._id);
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
          // columns={columns}
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
        {/* <AddRepresentativeForm type="add" onReset={onModalNewClose} onFinish={onFinishAddNew} /> */}
        {/* <PatientsTable onRowClick={onRowClick} /> */}
        {/* <AddRepresentativeForm onFinish={onFinish} onReset={onReset} type="add" initValue={representative} /> */}
        {/* <AddPatientForm onFinish={onFinish} onReset={onReset} /> */}
      </Modal>
      <Descriptions
        size="middle"
        // column={1}
        title="Представители пациента"
        extra={
          isAdmin ? (
            <>
              {/* {representative?.isActive ? (
              <Button type="primary" onClick={onDeactivate} style={{ marginRight: '10px', backgroundColor: '#e60000' }}>
                Добавить нового
              </Button>
            ) : (
              <Button type="primary" onClick={onActivate} style={{ marginRight: '10px', backgroundColor: '#0c9500' }}>
                Активировать
              </Button>
            )} */}
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
        {/* <Descriptions.Item className={addClass(classes, 'des-item')}>
          <Search
            allowClear
            placeholder="Введите текст поиска"
            onSearch={onSearch}
            enterButton
            style={{ marginBottom: '15px' }}
          />
        </Descriptions.Item> */}
        <Descriptions.Item className={addClass(classes, 'des-item')} contentStyle={{ flexDirection: 'column' }}>
          <RepresentativesTable
            // columns={columnsA}
            onRemove={isAdmin && (patient?.isActive ? onRemove : false)}
            onRowClick={isAdmin ? (record) => navigate(`/representatives/${record._id}/info`) : undefined}
            dataSourseQuery={patientsAPI.useGetPatientRepresentativesQuery}
            hasSearch={false}
            extraOptions={{ id: patient?._id }}
            // tableState={state1}
            // slice={patientTableSlice}
            // reduser={useAppSelector((state) => state.patientTableReducer)}
          />
          {/* <Search
            allowClear
            placeholder="Введите текст поиска"
            onSearch={onSearch}
            enterButton
            style={{ marginBottom: '15px' }}
          /> */}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default PatientRepresentatives;
