/* eslint-disable react/jsx-props-no-spreading */
import { Descriptions, Card, Empty, Spin } from 'antd';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { addClass } from '../../app/common';
import { patientsAPI } from '../../app/services';
import classes from './PatientRepresentatives.module.scss';
import { IPatient } from '../../models';
import ErrorResult from '../ErrorResult/ErrorResult';

interface MPatientRepresentativesProps extends PropsWithChildren {
  patient?: IPatient;
}

const MPatientRepresentatives: FunctionComponent<MPatientRepresentativesProps> = ({ patient }) => {
  const { data, isLoading, isError } = patientsAPI.useGetPatientRepresentativesQuery(
    {
      id: patient?._id || '',
      isActive: true,
    },
    { skip: patient?._id === '' || !patient, pollingInterval: 30000 },
  );

  if (isError) return <ErrorResult />;

  return (
    <Spin tip={<div style={{ marginTop: '10px', width: '100%' }}>Загрузка...</div>} size="large" spinning={isLoading}>
      <Descriptions size="middle" contentStyle={{ whiteSpace: 'pre-line' }} title="Представители пациента">
        <Descriptions.Item contentStyle={{ flexDirection: 'column' }}>
          {data?.count !== 0 ? (
            data?.data.map((repres) => (
              <Card
                key={repres._id}
                size="small"
                title={`${repres.surname} ${repres.name} ${repres.patronymic}`}
                style={{ width: '100%', marginBottom: '5px' }}
              >
                <Descriptions column={3}>
                  <Descriptions.Item label="Телефоны" span={3}>
                    {repres.phoneNumbers.reduce((p, c) => {
                      const pn = `+7 ${c.slice(0, 3)} ${c.slice(3, 6)}-${c.slice(6, 8)}-${c.slice(8)}`;
                      return `${p}${p ? '\n' : ''}${pn}`;
                    }, '')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Emails" span={3}>
                    {repres.emails.reduce((p, c) => {
                      return `${p}${p ? '\n' : ''}${c}`;
                    }, '')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Дата рождения" span={3}>
                    {new Date(repres.dateOfBirth).toLocaleString('ru', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    })}
                  </Descriptions.Item>
                  <Descriptions.Item label="Пол" span={3}>
                    {repres.gender}
                  </Descriptions.Item>
                  <Descriptions.Item label="Адрес" span={3}>
                    {repres.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Статус" span={3}>
                    {repres.isActive ? (
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
        </Descriptions.Item>
      </Descriptions>
    </Spin>
  );
};

MPatientRepresentatives.defaultProps = {
  patient: undefined,
};

export default MPatientRepresentatives;
