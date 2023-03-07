import React, { createRef } from 'react';
import { Typography, Row, Col, Button, Input, Card, Empty, Descriptions, InputRef, Pagination, Spin } from 'antd';
import type { PaginationProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import classes from '../style.module.scss';
import { patientsAPI } from '../../app/services';
import { addClass } from '../../app/common';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { patientTableSlice } from '../../app/reducers';
import ErrorResult from '../../components/ErrorResult/ErrorResult';

const { Search } = Input;

const MPatients = () => {
  const { roles } = useAppSelector((state) => state.authReducer);
  const isSpec = roles.find((r) => r === 'specialist');
  const remoteInput = createRef<InputRef>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { limit, page, filter, isActive } = useAppSelector((state) => state.patientTableReducer);
  const { data, isLoading, isError } = patientsAPI.useGetPatientsQuery({ limit, page, filter, isActive });

  const { setPage, setFilter } = patientTableSlice.actions;

  const onChange: PaginationProps['onChange'] = (page1: number) => {
    dispatch(setPage(page1 ? page1 - 1 : 0));
    // eslint-disable-next-line no-restricted-globals
    scroll(0, 0);
  };

  const onSearch = (value: string) => {
    dispatch(setPage(0));
    dispatch(setFilter(value));
    remoteInput.current?.blur();
  };
  const onAddClick = () => {
    navigate('/patients/add', { replace: true });
  };

  if (isError) return <ErrorResult />;

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col span={24} style={{ alignItems: 'center', textAlign: 'center' }}>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Пациенты
          </Typography.Title>
        </Col>
        {!isSpec ? (
          <Col span={24} style={{ alignItems: 'center', textAlign: 'center' }}>
            <Button type="link" onClick={onAddClick}>
              Добавить пациента
            </Button>
          </Col>
        ) : null}
      </Row>
      <Search
        onPressEnter={(e: any) => onSearch(e.target?.defaultValue)}
        ref={remoteInput}
        allowClear
        placeholder="Введите текст поиска"
        onSearch={onSearch}
        enterButton
        style={{ marginBottom: '15px' }}
      />
      <Spin
        style={{ marginTop: '50px' }}
        tip={<div style={{ marginTop: '10px', width: '100%' }}>Загрузка...</div>}
        size="large"
        spinning={isLoading}
      >
        {data?.count !== 0 ? (
          data?.data.map((patient) => (
            <Card
              key={patient._id}
              size="small"
              title={`${patient.number} ${patient.surname} ${patient.name} ${patient.patronymic}`}
              onClick={() => {
                navigate(`/patients/${patient._id}/info`);
              }}
              style={{ width: '100%', marginBottom: '5px' }}
            >
              <Descriptions column={3}>
                <Descriptions.Item label="Дата рождения" span={3}>
                  {new Date(patient.dateOfBirth).toLocaleString('ru', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })}
                </Descriptions.Item>
                <Descriptions.Item label="Пол" span={3}>
                  {patient.gender}
                </Descriptions.Item>
                <Descriptions.Item label="Адрес" span={3}>
                  {patient.address}
                </Descriptions.Item>
                <Descriptions.Item label="Статус" span={3}>
                  {patient.isActive ? (
                    <div className={addClass(classes, 'active-table-item__active')}>активен</div>
                  ) : (
                    <div className={addClass(classes, 'active-table-item__not-active')}>неактивен</div>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          ))
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Пациенты не найдены"
            style={{ backgroundColor: 'white', margin: 0, padding: '40px', borderRadius: '5px' }}
          />
        )}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
          <Pagination
            current={page + 1}
            pageSize={limit}
            total={data?.count}
            size="small"
            onChange={onChange}
            hideOnSinglePage
            showSizeChanger
          />
        </div>
      </Spin>
    </>
  );
};

export default MPatients;
