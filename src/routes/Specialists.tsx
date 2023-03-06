/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Typography, Table, Row, Col, Button, Input, Tooltip } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';
import { FilterFilled } from '@ant-design/icons';
import classes from './style.module.scss';
import { patientsAPI, representativesAPI } from '../app/services';
import { IPatient, IRepresentative } from '../models';
import { addClass } from '../app/common';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { patientTableSlice } from '../app/reducers';
import SpecialistTable from '../components/SpecialistTable/SpecialistTable';
import { specialistAPI } from '../app/services/specialists.service';
import { specialistsTableSlice } from '../app/reducers/specialistsTable.slice';

const Specialists = () => {
  const navigate = useNavigate();

  const onAddClick = () => {
    navigate('/specialists/add', { replace: true });
  };

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Специалисты
          </Typography.Title>
        </Col>
        <Col>
          <Button type="link" onClick={onAddClick}>
            Добавить специалиста
          </Button>
        </Col>
      </Row>
      <SpecialistTable
        onRowClick={(record: any) => navigate(`/specialists/${record._id}/info`)}
        dataSourseQuery={specialistAPI.useGetSpecialistsQuery}
        slice={specialistsTableSlice}
        reduser={useAppSelector((state) => state.specialistsTableReducer)}
        hasPagination
      />
    </>
  );
};

export default Specialists;
