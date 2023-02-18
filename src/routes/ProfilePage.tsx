/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { Typography, Row, Col, Button, Tabs, message, Spin, Descriptions, Divider, Modal } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import './antd.rewrite.scss';
import { authAPI, patientsAPI, representativesAPI, userAPI } from '../app/services';
import PatinentDescription from '../components/PatinentInfo/PatinentInfo';
import PatientRepresentatives from '../components/PatientRepresentatives/PatientRepresentatives';
import PatinentCourse from '../components/PatinentCourse/PatinentCourse';
import PatientShedule from '../components/PatientShedule/PatientShedule';
import UserForm from '../components/UserForm/UserForm';
import { useAppSelector } from '../app/hooks';
import { adminsAPI } from '../app/services/admins.service';
import { specialistAPI } from '../app/services/specialists.service';

interface ProfilePageProps extends PropsWithChildren {
  // eslint-disable-next-line react/require-default-props
  activeKey?: 'info' | 'representatives' | 'course' | 'shedule';
}

const { Title } = Typography;

const getUpdate = (roles: string[]) => {
  if (roles.find((r) => r === 'admin')) return adminsAPI.useUpdateAdminMutation();
  if (roles.find((r) => r === 'specialist')) return specialistAPI.useUpdateSpecialistMutation();
  return representativesAPI.useUpdateRepresentativeMutation();
  // if (roles.find((r) => r === 'representative')) return representativesAPI.useUpdateRepresentativeMutation();
  // return undefined;
};
const getUsetType = (roles: string[]) => {
  if (roles.find((r) => r === 'admin')) return 'admin';
  if (roles.find((r) => r === 'specialist')) return 'specialist';
  return 'representative';
  // if (roles.find((r) => r === 'representative')) return representativesAPI.useUpdateRepresentativeMutation();
  // return undefined;
};

const ProfilePage: FunctionComponent<ProfilePageProps> = ({ activeKey }) => {
  const { roles } = useAppSelector((state) => state.authReducer);
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const { data: user } = userAPI.useGetProfileQuery({});
  // console.log(user);
  // eslint-disable-next-line no-nested-ternary
  const [update] = getUpdate(roles);
  // eslint-disable-next-line no-nested-ternary
  // const [update] = roles.find((r) => r === 'admin')
  //   ? adminsAPI.useUpdateAdminMutation()
  //   : roles.find((r) => r === 'specialist')
  //   ? specialistAPI.useUpdateSpecialistMutation()
  //   : representativesAPI.useUpdateRepresentativeMutation();
  const userType = getUsetType(roles);

  const onFinish = async (values: any) => {
    try {
      await update({ ...user, ...values }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Данные пользователя успешно обновлены',
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const params = useParams();
  // const { data: patient, isLoading } = patientsAPI.useGetPatientByIdQuery({ id: params?.id || '' });

  const onBackClick = () => {
    navigate('/patients', { replace: true });
  };

  // const onChange = (key: string) => {
  //   navigate(`/patients/${params?.id}/${key}`, { replace: true });
  //   // navigate(`./../${key}`, { replace: true });
  // };
  // console.log(user);

  return (
    <>
      {contextHolder}
      <Modal
        destroyOnClose
        open={open}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Обновление данных представителя
          </Typography.Title>
        }
        width="100%"
        onCancel={onReset}
      >
        <UserForm onReset={onReset} onFinish={onFinish} initValue={user} userType={userType} />
        {/* <AddRepresentativeForm onFinish={onFinish} onReset={onReset} type="add" initValue={representative} /> */}
        {/* <AddPatientForm onFinish={onFinish} onReset={onReset} /> */}
      </Modal>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Личные данные
          </Typography.Title>
        </Col>
        <Col>
          <Button type="link" onClick={onEdit}>
            Редактировать
          </Button>
        </Col>
      </Row>
      <Descriptions
        bordered
        size="middle"
        contentStyle={{ backgroundColor: '#ffffff' }}
        labelStyle={{
          color: '#ffffff',
          borderRight: '5px solid #e6f4ff',
          width: '150px',
        }}
        // title="Личные данные представителя"
        column={1}
        // extra={
        //   <>
        //     {representative?.isActive ? (
        //       <Button type="primary" onClick={onDeactivate} style={{ marginRight: '10px', backgroundColor: '#e60000' }}>
        //         Деактивировать
        //       </Button>
        //     ) : (
        //       <Button type="primary" onClick={onActivate} style={{ marginRight: '10px', backgroundColor: '#0c9500' }}>
        //         Активировать
        //       </Button>
        //     )}

        //     <Button type="primary" onClick={onEdit} disabled={!representative?.isActive}>
        //       Редактировать
        //     </Button>
        //   </>
        // }
      >
        <Descriptions.Item label="Фамилия" style={{ borderBottom: '5px #e6f4ff solid' }}>
          {user?.surname}
        </Descriptions.Item>
        <Descriptions.Item label="Имя" style={{ borderBottom: '5px #e6f4ff solid' }}>
          {user?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Отчество" style={{ borderBottom: '5px #e6f4ff solid' }}>
          {user?.patronymic}
        </Descriptions.Item>
        <Descriptions.Item label="Пол" style={{ borderBottom: '5px #e6f4ff solid' }}>
          {user?.gender}
        </Descriptions.Item>
        <Descriptions.Item label="Дата рождения" style={{ borderBottom: '5px #e6f4ff solid' }}>
          {new Date(user?.dateOfBirth || '').toLocaleString('ru', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })}
        </Descriptions.Item>
        <Descriptions.Item label="Адрес" style={{ borderBottom: '5px #e6f4ff solid' }}>
          {user?.address}
        </Descriptions.Item>
        <Descriptions.Item label="Номера телефонов" style={{ borderBottom: '5px #e6f4ff solid' }}>
          {user?.phoneNumbers
            .map((c) => `+7 (${c.slice(0, 3)}) ${c.slice(3, 6)}-${c.slice(6, 8)}-${c.slice(8)}`)
            .join(', ')}
        </Descriptions.Item>
        <Descriptions.Item label="Электронные почты" style={{ borderBottom: '5px #e6f4ff solid' }}>
          {user?.emails.join(', ')}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Фамилия" className={addClass(classes, 'des-item')}>
          {representative?.surname}
        </Descriptions.Item>
        <Descriptions.Item label="Имя" className={addClass(classes, 'des-item')}>
          {representative?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Отчество" className={addClass(classes, 'des-item')}>
          {representative?.patronymic}
        </Descriptions.Item>
        <Descriptions.Item label="Пол" className={addClass(classes, 'des-item')}>
          {representative?.gender}
        </Descriptions.Item>
        <Descriptions.Item label="Дата рождения" className={addClass(classes, 'des-item')}>
          {new Date(representative?.dateOfBirth || '').toLocaleString('ru', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })}
        </Descriptions.Item>
        <Descriptions.Item label="Адрес" className={addClass(classes, 'des-item')}>
          {representative?.address}
        </Descriptions.Item>
        <Descriptions.Item label="Номера телефонов" className={addClass(classes, 'des-item')}>
          {representative?.phoneNumbers
            .map((c) => `+7 (${c.slice(0, 3)}) ${c.slice(3, 6)}-${c.slice(6, 8)}-${c.slice(8)}`)
            .join(', ')}
        </Descriptions.Item>
        <Descriptions.Item label="Электронные почты" className={addClass(classes, 'des-item')}>
          {representative?.emails.join(', ')}
        </Descriptions.Item>
        <Descriptions.Item label="Источники рекламы" className={addClass(classes, 'des-item')}>
          {representative?.advertisingSources.map((v) => v.name).join(', ')}
        </Descriptions.Item>
        <Descriptions.Item label="Логин" className={addClass(classes, 'des-item')}>
          {representative?.login}
        </Descriptions.Item> */}
        {/* <Descriptions.Item label="Примечание" className={addClass(classes, 'des-item')}>
          {patient?.note}
        </Descriptions.Item> */}
        {/* <Descriptions.Item label="Статус">{representative?.isActive ? 'активен' : 'неактивен'}</Descriptions.Item> */}
      </Descriptions>
      {/* <Title level={3}>Режим работы</Title>
      <Typography>Понедельник-Пятница с 08:00 - 18:00</Typography>
      <Typography>Выходные: суббота, воскресенье</Typography>
      <Divider />
      <Title level={3}>Адрес</Title>
      <Typography>г. Астрахань, ул. Адмирала Нахимова д. 70Г, литер А</Typography>
      <Divider /> */}
      {/* <Descriptions column={3}>
        <Descriptions.Item label="Режим работы" span={3}>
          <p>Понедельник-Пятница с 08:00 - 18:00</p>
          <p>Выходные: суббота, воскресенье</p>
        </Descriptions.Item>
        <Descriptions.Item label="Адрес" span={3}>
          <p>г. Астрахань, ул. Адмирала Нахимова д. 70Г, литер А.</p>
        </Descriptions.Item>
      </Descriptions> */}
      {/* <p>Режим работы:</p>
       и телефоны:
:
Понедельник-Пятница с 08:00 - 18:00
Выходные: суббота, воскресенье

Адрес: г. Астрахань, ул. Адмирала Нахимова
д. 70Г, литер А. */}
      {/* {contextHolder} */}
      {/* <Spin tip={<div style={{ marginTop: '10px', width: '100%' }}>Загрузка...</div>} size="large" spinning={isLoading}>
        <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
          <Col>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {!isLoading && patient
                ? `Пациент №${patient?.number}. ` +
                  `${patient?.surname} ${patient?.name.slice(0, 1)}.` +
                  `${patient?.patronymic.slice(0, 1)}.` +
                  ` ${new Date(patient?.dateOfBirth || '').toLocaleString('ru', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })} ` +
                  `(${patient?.isActive ? 'активен' : 'неактивен'})`
                : 'Пациент'}
            </Typography.Title>
          </Col>
          <Col>
            <Button type="link" onClick={onBackClick}>
              К списку
            </Button>
          </Col>
        </Row>
        <Tabs
          size="small"
          onChange={onChange}
          type="line"
          activeKey={activeKey}
          tabPosition="left"
          items={[
            {
              label: 'Данные',
              key: 'info',
              children: <PatinentDescription patient={patient} />,
            },
            {
              label: 'Представители',
              key: 'representatives',
              children: <PatientRepresentatives patient={patient} />,
            },
            { label: 'Курсы', key: 'course', children: <PatinentCourse patient={patient} /> },
            { label: 'Расписание', key: 'shedule', children: <PatientShedule patient={patient} /> },
            // { label: 'Документы', key: 'documents' },
          ]}
        />
      </Spin> */}
    </>
  );
};

export default ProfilePage;
