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
import { specialistsSlice } from '../app/reducers/specialists.slice';

const { Search } = Input;

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

const Specialists = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { limit, page, filter, isActive } = useAppSelector((state) => state.patientTableReducer);
  const { data, isLoading } = representativesAPI.useGetRepresentativesQuery({ limit, page, filter, isActive });

  const { setPage, setLimit, setFilter, setIsActive } = patientTableSlice.actions;

  const handleTableChange = (
    pagination: TablePaginationConfig,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filters: Record<string, FilterValue | null>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sorter: SorterResult<IRepresentative> | SorterResult<IRepresentative>[],
  ) => {
    if (filters?.isActive) {
      if (filters?.isActive.length > 1) dispatch(setIsActive(undefined));
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      else filters.isActive[0] ? dispatch(setIsActive(true)) : dispatch(setIsActive(false));
    } else dispatch(setIsActive(undefined));
    // console.log(pagination, filters, sorter);
    dispatch(setPage(pagination.current ? pagination.current - 1 : 0));
    dispatch(setLimit(pagination.pageSize ? pagination.pageSize : -1));
  };
  const onAddClick = () => {
    navigate('/representatives/add', { replace: true });
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
        slice={specialistsSlice}
        reduser={useAppSelector((state) => state.specialistsReducer)}
      />
    </>
  );
};

export default Specialists;
