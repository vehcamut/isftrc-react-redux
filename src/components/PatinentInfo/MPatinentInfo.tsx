/* eslint-disable no-nested-ternary */
import { Button, Modal, Typography, Descriptions, message, Card } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
// import { addClass } from '../../app/common';
import { patientsAPI } from '../../app/services';
// import classes from './PatinentInfo.module.scss';
import { IPatient } from '../../models';
import AddPatientForm from '../AddPatientForm/AddPatientForm';
import { useAppSelector } from '../../app/hooks';

interface MPatinentInfoProps extends PropsWithChildren {
  // eslint-disable-next-line react/require-default-props
  patient?: IPatient;
}

const MPatinentInfo: FunctionComponent<MPatinentInfoProps> = ({ patient }) => {
  const { roles } = useAppSelector((state) => state.authReducer);
  const isAdmin = roles.find((r) => r === 'admin');
  const isRepres = roles.find((r) => r === 'representative');
  const [messageApi, contextHolder] = message.useMessage();
  const [updatePatient] = patientsAPI.useUpdatePatientMutation();
  const [changeStatus] = patientsAPI.useChangePatientStatusMutation();
  const [open, setOpen] = useState(false);

  const onFinish = async (values: any) => {
    try {
      await updatePatient({ ...patient, ...values }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Данные пациента успешно обновлены',
      });
      setOpen(false);
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
    }
  };
  const onReset = () => {
    setOpen(false);
  };
  const onEdit = () => {
    setOpen(true);
  };
  const onActivate = async () => {
    try {
      await changeStatus({ _id: patient?._id ? patient?._id : '', isActive: true }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Пациент успешно активирован',
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
      await changeStatus({ _id: patient?._id ? patient?._id : '', isActive: false }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Пациент успешно деактивирован',
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
      <Modal
        destroyOnClose
        open={open}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Обновление данных пациента
          </Typography.Title>
        }
        width="100%"
        onCancel={onReset}
      >
        <AddPatientForm onFinish={onFinish} onReset={onReset} initValue={patient} />
      </Modal>
      <Card
        size="default"
        title="Личные данные"
        extra={
          <>
            {isAdmin ? (
              patient?.isActive ? (
                <Button
                  type="primary"
                  onClick={onDeactivate}
                  style={{ marginRight: '10px', backgroundColor: '#e60000' }}
                >
                  Деактивировать
                </Button>
              ) : (
                <Button type="primary" onClick={onActivate} style={{ marginRight: '10px', backgroundColor: '#0c9500' }}>
                  Активировать
                </Button>
              )
            ) : null}
            {isAdmin || isRepres ? (
              <Button type="primary" onClick={onEdit} disabled={!patient?.isActive}>
                Редактировать
              </Button>
            ) : null}
            {/* <Button type="link" onClick={onEdit} disabled={!patient?.isActive}>
              Редактировать
            </Button> */}
          </>
        }
      >
        <Descriptions
          labelStyle={{ fontWeight: 'bold', color: 'black' }}
          contentStyle={{ whiteSpace: 'pre-line' }}
          layout="horizontal"
          // bordered
          size="small"
          // contentStyle={{ backgroundColor: '#ffffff', width: '100%', display: 'block', padding: '8px 16px' }}
          // labelStyle={{
          //   color: '#ffffff',
          //   width: '100%',
          //   display: 'block',
          //   padding: '8px 16px',
          //   backgroundColor: '#1677FF',
          //   // borderRight: '5px solid #e6f4ff',
          //   // width: '150px',
          // }}
          // title="Личные данные"
          column={1}
          // extra={
          //   <>
          //     {isAdmin ? (
          //       patient?.isActive ? (
          //         <Button
          //           type="primary"
          //           onClick={onDeactivate}
          //           style={{ marginRight: '10px', backgroundColor: '#e60000' }}
          //         >
          //           Деактивировать
          //         </Button>
          //       ) : (
          //         <Button
          //           type="primary"
          //           onClick={onActivate}
          //           style={{ marginRight: '10px', backgroundColor: '#0c9500' }}
          //         >
          //           Активировать
          //         </Button>
          //       )
          //     ) : null}

          //     <Button type="link" onClick={onEdit} disabled={!patient?.isActive}>
          //       Редактировать
          //     </Button>
          //   </>
          // }
        >
          <Descriptions.Item
            label="Фамилия"
            // className={addClass(classes, 'des-item')}
            // style={{ borderBottom: '5px #e6f4ff solid', padding: 0 }}
          >
            {patient?.surname}
          </Descriptions.Item>
          <Descriptions.Item
            label="Имя"
            // className={addClass(classes, 'des-item')}
            // style={{ borderBottom: '5px #e6f4ff solid', padding: 0 }}
          >
            {patient?.name}
          </Descriptions.Item>
          <Descriptions.Item
            label="Отчество"
            // className={addClass(classes, 'des-item')}
            // style={{ borderBottom: '5px #e6f4ff solid', padding: 0 }}
          >
            {patient?.patronymic}
          </Descriptions.Item>
          <Descriptions.Item
            label="Пол"
            // className={addClass(classes, 'des-item')}
            // style={{ borderBottom: '5px #e6f4ff solid', padding: 0 }}
          >
            {patient?.gender}
          </Descriptions.Item>
          <Descriptions.Item
            label="Дата рождения"
            // className={addClass(classes, 'des-item')}
            // style={{ borderBottom: '5px #e6f4ff solid', padding: 0 }}
          >
            {new Date(patient?.dateOfBirth || '').toLocaleString('ru', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            })}
          </Descriptions.Item>
          <Descriptions.Item
            label="Адрес"
            // className={addClass(classes, 'des-item')}
            // style={{ borderBottom: '5px #e6f4ff solid', padding: 0 }}
          >
            {patient?.address}
          </Descriptions.Item>
          {!isRepres ? (
            <Descriptions.Item
              label="Примечание"
              // className={addClass(classes, 'des-item')}
              // style={{ borderBottom: '5px #e6f4ff solid', padding: 0 }}
            >
              {patient?.note}
            </Descriptions.Item>
          ) : null}

          <Descriptions.Item label="Статус" /* style={{ borderBottom: '5px #e6f4ff solid', padding: 0 }} */>
            {patient?.isActive ? 'активен' : 'неактивен'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
};

export default MPatinentInfo;
