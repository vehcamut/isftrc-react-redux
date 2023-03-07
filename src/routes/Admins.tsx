import React from 'react';
import { Typography, Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { adminsTableSlice } from '../app/reducers';
import AdminsTable from '../components/AdminsTable/AdminsTable';
import { adminsAPI } from '../app/services/admins.service';

const Admins = () => {
  const navigate = useNavigate();
  const onAddClick = () => {
    navigate('/admins/add', { replace: true });
  };

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Администраторы
          </Typography.Title>
        </Col>
        <Col>
          <Button type="link" onClick={onAddClick}>
            Добавить администратора
          </Button>
        </Col>
      </Row>
      <AdminsTable
        onRowClick={(record: any) => navigate(`/admins/${record._id}/info`)}
        dataSourseQuery={adminsAPI.useGetAdminsQuery}
        slice={adminsTableSlice}
        reduser={useAppSelector((state) => state.adminsTableReducer)}
        hasPagination
      />
    </>
  );
};

export default Admins;
