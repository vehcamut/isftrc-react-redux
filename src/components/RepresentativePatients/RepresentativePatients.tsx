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
import classes from './RepresentativePatients.module.scss';
import { IPatient, IRepresentative } from '../../models';
import AddPatientForm from '../AddPatientForm/AddPatientForm';
// import AddRepresentativeForm from '../AddRepresentativeForm/AddRepresentativeForm';
import { patientTableSlice } from '../../app/reducers';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PatientsTable from '../PatientsTable/PatientsTable';

interface RepresentativePatientsProps extends PropsWithChildren {
  // eslint-disable-next-line react/require-default-props
  representative?: IRepresentative;
}
const { Search } = Input;
const { confirm } = Modal;

function CustomCell(props: any) {
  // console.log(props);
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

const RepresentativePatients: FunctionComponent<RepresentativePatientsProps> = ({ representative }) => {
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

  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  // const { limit, page, filter, isActive } = useAppSelector((state) => state.patientTableReducer);
  const { data, isLoading } = representativesAPI.useGetRepresentativePatientsByIdQuery({
    id: representative?._id || '',
    isActive,
  });

  const onRemove = (patient: any) => {
    const showConfirm = () => {
      confirm({
        title: 'Вы точно хотите отвязать пациента от представителя?',
        icon: <ExclamationCircleFilled />,
        onOk() {
          removePatientFromRepresentative({ patientId: patient._id, representativeId: representative?._id || '' });
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

  const columns: ColumnsType<IPatient> = [
    {
      title: '№',
      dataIndex: 'number',
      key: 'number',
      width: '5%',
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
      title: 'Дата рождения',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: '13%',
      render: (date: Date) => {
        return new Date(date).toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric' });
      },
    },
    {
      title: 'Пол',
      dataIndex: 'gender',
      key: 'gender',
      width: '9%',
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      key: 'address',
      width: '38%',
    },
    {
      title: 'Статус',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '8%',
      render: (flag: boolean) => {
        return flag ? (
          <div className={addClass(classes, 'active-table-item__active')}>активен</div>
        ) : (
          <div className={addClass(classes, 'active-table-item__not-active')}>неактивен</div>
        );
      },
      // defaultFilteredValue: ['1'],

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
            type="link"
            disabled={!r.isActive || !representative?.isActive}
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
  // const { setPage, setLimit, setFilter, setIsActive } = patientTableSlice.actions;

  const handleTableChange = (
    pagination: TablePaginationConfig,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filters: Record<string, FilterValue | null>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sorter: SorterResult<IPatient> | SorterResult<IPatient>[],
  ) => {
    if (filters?.isActive) {
      if (filters?.isActive.length > 1) setIsActive(undefined);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      else filters.isActive[0] ? setIsActive(true) : setIsActive(false);
    } else setIsActive(undefined);
    // console.log(pagination, filters, sorter);
    // dispatch(setPage(pagination.current ? pagination.current - 1 : 0));
    // dispatch(setLimit(pagination.pageSize ? pagination.pageSize : -1));
  };
  // const onSearch = (value: string) => {
  //   dispatch(setPage(0));
  //   dispatch(setFilter(value));
  // };

  const onAddClick = () => {
    navigate('/patients/add', { replace: true });
  };
  const onFinish = async (values: any) => {
    try {
      await updateRepresentative({ ...representative, ...values }).unwrap();
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
      addPatientToRepresentative({ patientId, representativeId: representative?._id || '' });
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
  const onRowClick = (patient: any) => {
    addPatientToRepresentative({ patientId: patient._id, representativeId: representative?._id || '' });
    setIsModalAddOpened(false);
    messageApi.open({
      type: 'success',
      content: 'Пациент успешно добавлен.',
    });
    // alert(r._id);
  };

  const onActivate = async () => {
    try {
      await changeStatus({ _id: representative?._id ? representative?._id : '', isActive: true }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Представитель успешно активирован',
      });
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
    }
  };
  const onDeactivate = async () => {
    try {
      await changeStatus({ _id: representative?._id ? representative?._id : '', isActive: false }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Представитель успешно деактивирован',
      });
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
    }
  };
  return (
    <>
      {contextHolder}
      {/* <Modal
        title="Modal"
        open={isModalConfirmRemoveOpened}
        onOk={hideConfirmModal}
        onCancel={hideConfirmModal}
        // okText="确认"
        // cancelText="取消"
      >
        <p>Вы точно хотите отвязать пациента от представителя?</p>
        {/* <p>Bla bla ...</p>
        <p>Bla bla ...</p> }
      </Modal> */}
      <Modal
        destroyOnClose
        open={isModalAddOpened}
        // footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Добавление существующего пациента
          </Typography.Title>
        }
        width="100%"
        onCancel={onModalAddClose}
      >
        {/* <PatientsTable onRowClick={onRowClick} representative={representative} /> */}
        <PatientsTable
          // onRemove={representative?.isActive ? onRemove : false}
          onRowClick={onRowClick}
          dataSourseQuery={patientsAPI.useGetPatientsQuery}
          hasSearch
          extraOptions={{ representativeId: representative?._id }}
        />
        {/* <AddRepresentativeForm onFinish={onFinish} onReset={onReset} type="add" initValue={representative} /> */}
        {/* <AddPatientForm onFinish={onFinish} onReset={onReset} /> */}
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
          {/* <Search
            allowClear
            placeholder="Введите текст поиска"
            onSearch={onSearch}
            enterButton
            style={{ marginBottom: '15px' }}
          /> */}
          {/* const { data, isLoading } = representativesAPI.useGetRepresentativePatientsByIdQuery({
    id: representative?._id || '',
    isActive,
  }); */}
          <PatientsTable
            onRemove={representative?.isActive ? onRemove : false}
            onRowClick={(record) => navigate(`/representatives/${record._id}/info`)}
            dataSourseQuery={representativesAPI.useGetRepresentativePatientsByIdQuery}
            hasSearch
            extraOptions={{ id: representative?._id }}
            hasPagination
          />
          {/* <Table
            components={{
              body: {
                cell: CustomCell,
              },
            }}
            style={{ width: '100%' }}
            tableLayout="fixed"
            bordered
            size="small"
            columns={columns}
            rowKey={(record) => record.number}
            dataSource={data}
            pagination={false}
            // pagination={{
            //   position: ['bottomCenter'],
            //   current: page + 1,
            //   pageSize: limit,
            //   total: data?.count,
            //   pageSizeOptions: [10, 20, 50, 100],
            //   showSizeChanger: true,
            // }}
            loading={isLoading}
            onRow={(record) => {
              return {
                onClick: () => {
                  navigate(`/patients/${record._id}/info`);
                },
              };
            }}
            rowClassName={(record) =>
              record.isActive === true ? 'my-table-row my-table-row__active' : 'my-table-row my-table-row__deactive'
            }
            className={addClass(classes, 'patients-table')}
            onChange={handleTableChange}
          /> */}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default RepresentativePatients;
