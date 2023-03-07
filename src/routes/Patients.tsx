import React from 'react';
import { Typography, Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { patientsAPI } from '../app/services';
import { useAppSelector } from '../app/hooks';
import { patientTableSlice } from '../app/reducers';
import PatientsTable from '../components/PatientsTable/PatientsTable';

const Patients = () => {
  const { roles } = useAppSelector((state) => state.authReducer);
  const isSpec = roles.find((r) => r === 'specialist');
  const navigate = useNavigate();

  const onAddClick = () => {
    navigate('/patients/add', { replace: true });
  };

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Пациенты
          </Typography.Title>
        </Col>
        {!isSpec ? (
          <Col>
            <Button type="link" onClick={onAddClick}>
              Добавить пациента
            </Button>
          </Col>
        ) : null}
      </Row>
      <PatientsTable
        onRowClick={(record) => navigate(`/patients/${record._id}/info`)}
        dataSourseQuery={patientsAPI.useGetPatientsQuery}
        hasPagination
        reduser={useAppSelector((state) => state.patientTableReducer)}
        slice={patientTableSlice}
      />
    </>
  );
};

export default Patients;
