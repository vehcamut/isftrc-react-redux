/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import AddRepresentativeForm from '../AddRepresentativeForm/AddRepresentativeForm';
import { patientTableSlice } from '../../app/reducers';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PatientsTable from '../PatientsTable/PatientsTable';
import RepresentativesTable from '../RepresentativesTable/RepresentativesTable';

interface PatientRepresentativesProps extends PropsWithChildren {
  // eslint-disable-next-line react/require-default-props
  patient?: IPatient;
}
const { Search } = Input;
const { confirm } = Modal;

function CustomCell(props: any) {
  console.log(props);
  // eslint-disable-next-line react/destructuring-assignment
  if (Array.isArray(props?.children)) {
    // eslint-disable-next-line react/destructuring-assignment
    console.log(props?.children[1]);
    // eslint-disable-next-line react/destructuring-assignment
    let title = props?.children[1];
    if (typeof title?.props?.children === 'string') title = title?.props?.children;
    if (typeof title === 'string')
      return (
        <Tooltip title={title} mouseLeaveDelay={0} mouseEnterDelay={0.5}>
          <td {...props} />
        </Tooltip>
      );
  }
  return <td {...props} />;
}

const PatientRepresentatives: FunctionComponent<PatientRepresentativesProps> = ({ patient }) => {
  const state1 = useAppSelector((state) => state.patientTableReducer);
  // const { setPage, setLimit, setFilter, setIsActive } = patientTableSlice.actions;

  const [messageApi, contextHolder] = message.useMessage();
  const [addPatient] = patientsAPI.useAddPatientMutation();
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
  const { data, isLoading } = representativesAPI.useGetRepresentativePatientsByIdQuery({
    id: patient?._id || '',
    isActive,
  });

  const onRemove = (patientId: any) => {
    const showConfirm = () => {
      confirm({
        title: 'Вы точно хотите отвязать пациента от представителя?',
        icon: <ExclamationCircleFilled />,
        onOk() {
          // removePatientFromRepresentative({ patientId, representativeId: representative?._id || '' });
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
      const patientId = await addPatient(values).unwrap();
      // addPatientToRepresentative({ patientId, representativeId: representative?._id || '' });
      onModalNewClose();
      messageApi.open({
        type: 'success',
        content: 'Пациент успешно добавлен.',
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
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
        // 'Ошибка связи с сервером',
      });
      // console.log('ERROR!');
    }
  };
  const onRowClick = (representative: any) => {
    // addPatientToRepresentative({ patientId: patient._id, representativeId: representative?._id || '' });
    setIsModalAddOpened(false);
    messageApi.open({
      type: 'success',
      content: 'Пациент успешно добавлен.',
    });
    // alert(r._id);
  };

  const columns: ColumnsType<IRepresentative> = [
    {
      title: 'Логин',
      dataIndex: 'login',
      key: 'login',
      width: '10%',
    },
    {
      title: 'ФИО',
      dataIndex: 'name',
      key: 'name',
      width: '22%',
      render: (x, record) => {
        return `${record.surname} ${record.name} ${record.patronymic}`;
      },
    },
    {
      title: 'Телефоны',
      dataIndex: 'phoneNumbers',
      key: 'phoneNumbers',
      width: '12%',
      render: (number: string[]) => {
        return number.reduce((p, c) => {
          const pn = `+7 ${c.slice(0, 3)} ${c.slice(3, 6)}-${c.slice(6, 8)}-${c.slice(8)}`;
          return `${p} ${pn}`;
        }, '');
        // return new Date(date).toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric' });
      },
    },
    {
      title: 'Emails',
      dataIndex: 'emails',
      key: 'emails',
      width: '16%',
      render: (emails: string[]) => {
        return emails.reduce((p, c) => {
          return `${p} ${c}`;
        }, '');
        // return new Date(date).toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric' });
      },
    },
    {
      title: 'Дата рождения',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: '12%',
      render: (date: Date) => {
        return new Date(date).toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric' });
      },
    },
    {
      title: 'Пол',
      dataIndex: 'gender',
      key: 'gender',
      width: '8%',
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      key: 'address',
      width: '20%',
    },
    {
      title: 'Статус',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '10%',
      // render: (flag: boolean) => {
      //   return flag ? (
      //     <div className={addClass(classes, 'active-table-item__active')}>активен</div>
      //   ) : (
      //     <div className={addClass(classes, 'active-table-item__not-active')}>неактивен</div>
      //   );
      // },
      // defaultFilteredValue: [undefined],
      // eslint-disable-next-line react/no-unstable-nested-components
      filterIcon: (filtered) => <FilterFilled style={{ color: filtered ? '#e6f4ff' : '#ffffff' }} />,
      filters: [
        {
          text: 'активен',
          value: 1,
        },
        {
          text: 'неактивен',
          value: 0,
        },
      ],
    },
  ];
  const columnsA: ColumnsType<IRepresentative> = [
    {
      title: 'Логин',
      dataIndex: 'login',
      key: 'login',
      width: '10%',
    },
    {
      title: 'ФИО',
      dataIndex: 'name',
      key: 'name',
      width: '22%',
      render: (x, record) => {
        return `${record.surname} ${record.name} ${record.patronymic}`;
      },
    },
    {
      title: 'Телефоны',
      dataIndex: 'phoneNumbers',
      key: 'phoneNumbers',
      width: '12%',
      render: (number: string[]) => {
        return number.reduce((p, c) => {
          const pn = `+7 ${c.slice(0, 3)} ${c.slice(3, 6)}-${c.slice(6, 8)}-${c.slice(8)}`;
          return `${p} ${pn}`;
        }, '');
        // return new Date(date).toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric' });
      },
    },
    {
      title: 'Emails',
      dataIndex: 'emails',
      key: 'emails',
      width: '16%',
      render: (emails: string[]) => {
        return emails.reduce((p, c) => {
          return `${p} ${c}`;
        }, '');
        // return new Date(date).toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric' });
      },
    },
    {
      title: 'Д/Р',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: '12%',
      render: (date: Date) => {
        return new Date(date).toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric' });
      },
    },
    {
      title: 'Пол',
      dataIndex: 'gender',
      key: 'gender',
      width: '8%',
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      key: 'address',
      width: '20%',
    },
    {
      title: 'Статус',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '10%',
      // render: (flag: boolean) => {
      //   return flag ? (
      //     <div className={addClass(classes, 'active-table-item__active')}>активен</div>
      //   ) : (
      //     <div className={addClass(classes, 'active-table-item__not-active')}>неактивен</div>
      //   );
      // },
      // defaultFilteredValue: [undefined],
      // eslint-disable-next-line react/no-unstable-nested-components
      filterIcon: (filtered) => <FilterFilled style={{ color: filtered ? '#e6f4ff' : '#ffffff' }} />,
      filters: [
        {
          text: 'активен',
          value: 1,
        },
        {
          text: 'неактивен',
          value: 0,
        },
      ],
    },
    {
      // title: 'Адрес',
      // dataIndex: 'address',
      key: 'remove',
      render: (v, r) => {
        return (
          <Button
            style={{ color: 'red', backgroundColor: 'white' }}
            size="small"
            type="primary"
            // shape="circle"
            icon={<DeleteRowOutlined />}
            onClick={(e) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              e.stopPropagation();
              onRemove(r._id);
            }}
          />
        );
      },
      width: '5%',
    },
  ];

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
          columns={columns}
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
            Добавление нового пациента
          </Typography.Title>
        }
        width="100%"
        onCancel={onModalNewClose}
      >
        <AddPatientForm onReset={onModalNewClose} onFinish={onFinishAddNew} />
        {/* <PatientsTable onRowClick={onRowClick} /> */}
        {/* <AddRepresentativeForm onFinish={onFinish} onReset={onReset} type="add" initValue={representative} /> */}
        {/* <AddPatientForm onFinish={onFinish} onReset={onReset} /> */}
      </Modal>
      <Descriptions
        size="middle"
        // column={1}
        title="Пациенты представителя"
        extra={
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
            <Button type="primary" onClick={onModalNewOpen} style={{ marginRight: '10px' }}>
              Добавить нового
            </Button>
            <Button type="primary" onClick={onModalAddOpen}>
              Добавить существующего
            </Button>
          </>
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
            columns={columnsA}
            onRowClick={onRowClick}
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
