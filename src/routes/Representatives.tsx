import React from 'react';
import { Typography, Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { representativesAPI } from '../app/services';
import { useAppSelector } from '../app/hooks';
import { representativesTableSlice } from '../app/reducers';
import RepresentativesTable from '../components/RepresentativesTable/RepresentativesTable';

const Representatives = () => {
  const navigate = useNavigate();

  const onAddClick = () => {
    navigate('/representatives/add', { replace: true });
  };

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Представители
          </Typography.Title>
        </Col>
        <Col>
          <Button type="link" onClick={onAddClick}>
            Добавить представителя
          </Button>
        </Col>
      </Row>
      <RepresentativesTable
        onRowClick={(record: any) => navigate(`/representatives/${record._id}/info`)}
        dataSourseQuery={representativesAPI.useGetRepresentativesQuery}
        slice={representativesTableSlice}
        reduser={useAppSelector((state) => state.representativesTableReducer)}
        hasPagination
      />
    </>
  );
};

export default Representatives;
