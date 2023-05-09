/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Typography, Row, Col, Divider } from 'antd';
import './antd.rewrite.scss';
import { useAppSelector } from '../app/hooks';

const { Title } = Typography;

const HelpPage = () => {
  const { isAuth, isMobile } = useAppSelector((state) => state.authReducer);
  const { roles } = useAppSelector((state) => state.authReducer);
  const isSpec = roles.find((r) => r === 'specialist');
  const isRepres = roles.find((r) => r === 'representative');
  const isAdmin = roles.find((r) => r === 'admin');
  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <Typography.Title level={isMobile ? 2 : 1} style={{ margin: 0 }}>
            Справка по системе
          </Typography.Title>
        </Col>
      </Row>
      <Divider />
      <Title level={3}>Начало работы</Title>
      <Typography>
        Для того, чтобы начать работать с информационной системой необходимо пройти процедуру авторизации.
      </Typography>
      <Typography>Если учетная запись в системе отсутствует, то необходимо пройти регистрацию.</Typography>
      <Typography>При регистрации все обязательные поля для заполнения помечены звездочкой.</Typography>
      <Typography style={{ marginBottom: '10px' }}>
        После прохождения регистрации используйте введенные логин и пароль для авторизации.
      </Typography>
      <Typography style={{ fontWeight: 'bold', color: '#e60202' }}>ОБРАТИТЕ ВНИМАНИЕ!</Typography>
      <Typography style={{ fontWeight: 'bold' }}>
        &nbsp;&nbsp;&nbsp;&nbsp; 1. Регистрация доступна только для клиентов организации. Сотрудникам реацентра для
        получения доступа к системе следует обратиться к администратору.
      </Typography>
      <Typography style={{ fontWeight: 'bold' }}>
        &nbsp;&nbsp;&nbsp;&nbsp; 2. Клиентом организации считается представитель пациента. Учетной записи у пациента
        нет. Это связано с тем, что организация оказывает услуги несовершеннолетним пациентам. При регистрации вводите
        свои данные (представителя), а не данные пациента.
      </Typography>
      <Typography style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        &nbsp;&nbsp;&nbsp;&nbsp; 3. Если Вы забыли логин или пароль обратитесь к администратору.
      </Typography>
      <Typography style={{ marginBottom: '10px' }}>
        После авторизации пользователю становиться доступен функционал согласно его роли.
      </Typography>
      {!isAuth ? (
        <Typography style={{ fontWeight: 'bold' }}>
          Дальнейшее руководство предназначено для клиентов организации. Для получения доступа к справке по
          специфическим для вашей учетной записи функциям войдите в систему.
        </Typography>
      ) : null}
      {!isAuth || isRepres ? (
        <>
          <Divider />
          <Title level={3}>Работа с системой</Title>
          <Typography style={{ marginBottom: '10px' }}>
            После авторизации в системе на верхней панели станет доступны три вкладки:
          </Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;1. &quot;Личные данные&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;2. &quot;Пациенты&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;3. &quot;О компании&quot;.</Typography>
          <Title level={4}>Личные данные</Title>
          <Typography>На данной вкладке доступна информация о личных данных пользователя.</Typography>
          <Typography>
            Если Вы хотите изменить логин, фамилию или прочую информацию нажмите на кнопку &quot;Редактировать&quot;. В
            открывшей форме внесите необходимые изменения и нажмите &quot;Сохранить&quot;. Если же Вы не хотите
            сохранить внесенные изменения нажмите на крестик в правом верхнем угле или на конпку &quot;Отменить&quot;.
          </Typography>
          <Title level={4}>Пациенты</Title>
          <Typography>
            На данной вкладке доступна информация о пациентах представителем которых Вы являетесь.
          </Typography>
          <Typography>
            Если Вы хотите добавить пациента нажмите на кнопку &quot;Добавить пациента&quot;. В открывшей форме внесите
            информацию о пациенте и нажмите &quot;Сохранить&quot;. Если же Вы передумали добавлять пациента нажмите на
            кнопку &quot;Отменить&quot;.
          </Typography>
          <Typography style={{ fontWeight: 'bold', color: '#e60202', marginTop: '10px' }}>
            ОБРАТИТЕ ВНИМАНИЕ!
          </Typography>
          <Typography style={{ fontWeight: 'bold' }}>
            Сразу после добавления пациента в его карточке будут доступны для записи &quot;первичные&quot; услуги,
            которые необходимы для постановления диагноза и составления плана лечения.
          </Typography>
          <Title level={4}>Карточка пациента</Title>
          <Typography>
            Чтобы открыть карточку пациента перейдите на вкладку &quot;Пациенты&quot; и нажмите на строку/карточку с
            данными конкретного пациента.
          </Typography>
          <Typography style={{ marginBottom: '10px' }}>В карточке пациента доступно четыре раздела: </Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;1. &quot;Данные&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;2. &quot;Представители&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;3. &quot;Услуги&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;4. &quot;Расписание&quot;.</Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>
            Раздел &quot;Данные&quot;
          </Typography>
          <Typography>
            Здесь представлены основные личные данные пациента. Если Вы хотите внести изменения, то нажмите на кнопку
            &quot;Редактировать&quot;. В открывшей форме внесите необходимые изменения и нажмите &quot;Сохранить&quot;.
            Если же Вы не хотите сохранить внесенные изменения нажмите на крестик в правом верхнем угле или на кнопку
            &quot;Отменить&quot;.
          </Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>
            Раздел &quot;Представители&quot;
          </Typography>
          {/* <Title level={5}>Раздел &quot;Представители&quot;</Title> */}
          <Typography>
            Здесь имеется информация о представителях данного пациента, включая Вас. Для удаления или добавления
            представителя к пациенту обратитесь к администратору.
          </Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>
            Раздел &quot;Услуги&quot;
          </Typography>
          <Typography>
            В данном разделе представлена информация обо всех услугах, которые были оказаны и будут оказаны пациенту.
            Также здесь имеется информация о всех платежах.
          </Typography>
          <Typography>
            Синим выделены платежи, зеленым оказанные услуги, желтым неоказанные услуги, красным просроченные услуги.
          </Typography>
          <Typography>
            Для получения информации о конкретной услуге или оплате нажмите на интересующую строку/карточку.
          </Typography>
          <Typography style={{ marginTop: '5px', marginBottom: '5px' }}>
            <Typography.Text style={{ fontWeight: 'bold' }}>
              Чтобы записать пациента на получение услуги:{' '}
            </Typography.Text>
            нажмите на интересующую услугу и в появившемся окне нажмите на кнопку &quot;Записать&quot;. После этого в
            новом окне выберите специалиста, время и подтвердите запись.
          </Typography>
          <Typography style={{ marginTop: '5px', marginBottom: '5px' }}>
            <Typography.Text style={{ fontWeight: 'bold' }}>
              Чтобы перенести запись пациента на получение услуги:{' '}
            </Typography.Text>
            нажмите на интересующую услугу и в появившемся окне нажмите на кнопку &quot;Перенести&quot;. После этого в
            новом окне выберите специалиста, время и подтвердите запись.
          </Typography>
          <Typography style={{ marginTop: '5px', marginBottom: '5px' }}>
            <Typography.Text style={{ fontWeight: 'bold' }}>
              Чтобы отменить запись пациента на получение услуги:{' '}
            </Typography.Text>
            нажмите на интересующую услугу и в появившемся окне нажмите на кнопку &quot;Перенести&quot;. После этого в
            новом окне нажмите на кнопку &quot;Отменить&quot;, подтвердите отмену.
          </Typography>
          <Typography style={{ fontWeight: 'bold', color: '#e60202', marginTop: '10px' }}>
            ОБРАТИТЕ ВНИМАНИЕ!
          </Typography>
          <Typography style={{ fontWeight: 'bold' }}>
            Отменить или перенести запись можно только за день до оказания услуги. В остальных случаях отмена или
            перезапись происходит через администратора.
          </Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px' }}>Раздел &quot;Расписание&quot;</Typography>
          {/* <Title level={5}>Раздел &quot;Представители&quot;</Title> */}
          <Typography>Здесь представлено расписание пациента.</Typography>
          <Typography>Для получения информации о конкретной услуге нажмите на ячейку.</Typography>
          <Typography>Из данного раздела также можно перенести или отменить запись.</Typography>
          <Divider />
          <Title level={4}>О компании</Title>
          <Typography>На данной вкладке доступна информация об организации.</Typography>
          <Divider />
          <Title level={4}>Остались вопросы?</Title>
          <Typography>По всем вопросам обращайтесь к администратору системы.</Typography>
          <Divider />{' '}
        </>
      ) : null}
      {isAdmin ? (
        <>
          <Divider />
          <Title level={3}>Работа с системой</Title>
          <Typography style={{ fontWeight: 'bold', marginBottom: '10px' }}>
            Если Вы только начали работать с системой, то начните с заполнения справочников.
          </Typography>
          <Typography style={{ marginBottom: '10px' }}>
            После авторизации в системе на верхней панели станет доступны семь вкладок:
          </Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;1. &quot;Личные данные&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;2. &quot;Пациенты&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;3. &quot;Представители&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;4. &quot;Специалисты&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;5. &quot;Администраторы&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;6. &quot;Справочники&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;7. &quot;О компании&quot;.</Typography>
          <Title level={4}>Личные данные</Title>
          <Typography>На данной вкладке доступна информация о личных данных пользователя.</Typography>
          <Typography>
            Если Вы хотите изменить логин, фамилию или прочую информацию нажмите на кнопку &quot;Редактировать&quot;. В
            открывшей форме внесите необходимые изменения и нажмите &quot;Сохранить&quot;. Если же Вы не хотите
            сохранить внесенные изменения нажмите на крестик в правом верхнем угле или на конпку &quot;Отменить&quot;.
          </Typography>
          <Title level={4}>Пациенты</Title>
          <Typography>На данной вкладке доступна информация о всех пациентах.</Typography>
          <Typography>
            Если Вы хотите добавить пациента нажмите на кнопку &quot;Добавить пациента&quot;. В открывшей форме внесите
            информацию о пациенте и нажмите &quot;Сохранить&quot;. Если же Вы передумали добавлять пациента нажмите на
            кнопку &quot;Отменить&quot;.
          </Typography>
          <Typography style={{ fontWeight: 'bold', color: '#e60202', marginTop: '10px' }}>
            ОБРАТИТЕ ВНИМАНИЕ!
          </Typography>
          <Typography style={{ fontWeight: 'bold' }}>
            Сразу после добавления пациента в его карточке будут доступны для записи &quot;первичные&quot; услуги,
            которые необходимы для постановления диагноза и составления плана лечения.
          </Typography>
          <Typography style={{ fontWeight: 'bold' }}>Перечень таких услуг настривается в справочнике услуг.</Typography>
          <Title level={4}>Карточка пациента</Title>
          <Typography>
            Чтобы открыть карточку пациента перейдите на вкладку &quot;Пациенты&quot; и нажмите на строку с данными
            конкретного пациента.
          </Typography>
          <Typography style={{ marginBottom: '10px' }}>В карточке пациента доступно четыре раздела: </Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;1. &quot;Данные&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;2. &quot;Представители&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;3. &quot;Услуги&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;4. &quot;Расписание&quot;.</Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>
            Раздел &quot;Данные&quot;
          </Typography>
          <Typography>
            Здесь представлены основные личные данные пациента. Если Вы хотите внести изменения, то нажмите на кнопку
            &quot;Редактировать&quot;. В открывшей форме внесите необходимые изменения и нажмите &quot;Сохранить&quot;.
            Если же Вы не хотите сохранить внесенные изменения нажмите на крестик в правом верхнем угле или на кнопку
            &quot;Отменить&quot;.
          </Typography>
          <Typography>
            Чтобы закрыть возможность работы с пациентом, возможно декативировать пациента. Для этого нажмите на кнопку
            &quot;Деактивировать&quot;. После этого пациент будет деактивирован и дальнейшая работа с ним, включая
            добавление услуг, изменение данных и т.п., будет невозможна.
          </Typography>
          <Typography>Чтобы активировать пациента нажмите на кнопку &quot;Активировать&quot;.</Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>
            Раздел &quot;Представители&quot;
          </Typography>
          <Typography>Здесь имеется информация о представителях данного пациента.</Typography>
          <Typography>
            Для удаления связи между представителем и пациентом нажмите на кнопку в самом правом столбце таблицы.
          </Typography>
          <Typography>Для установления связи между представителем и пациентом нажмите на одну из кнопок.</Typography>
          <Typography>
            &nbsp;&nbsp;&nbsp;&nbsp;1. &quot;Добавить нового&quot;, если вы хотите добавить нового представителя. После
            этого откроется форма регистрации новой учетной записи представителя.
          </Typography>
          <Typography>
            &nbsp;&nbsp;&nbsp;&nbsp;2. &quot;Добавить существующего&quot;, если вы хотите выбрать уже имеющегося
            представителя. После этого откроется окно с таблицей для выбора представителя.
          </Typography>
          {/* <Typography>
            Для установаления связи между представителем и пациентом нажмите на одну из кнопок: &quot;Добавить
            нового&quot;, если вы хотите добавить нового представителя, или &quot;Добавить существующего&quot;, если вы
            хотите выбрать уже имеющегося представителя.
          </Typography> */}
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>
            Раздел &quot;Услуги&quot;
          </Typography>
          <Typography>
            В данном разделе представлена информация обо всех услугах, которые были оказаны и будут оказаны пациенту.
            Также здесь имеется информация о всех платежах.
          </Typography>
          <Typography>
            Синим выделены платежи, зеленым оказанные услуги, желтым неоказанные услуги, красным просроченные услуги.
          </Typography>
          <Typography>
            Для получения информации о конкретной услуге или оплате нажмите на интересующую строку/карточку.
          </Typography>
          <Typography style={{ fontWeight: 'bold' }}>
            Услуги оказываются по курсам. Новому пациенту автоматически вне курсов добавляются первичные услуги.
          </Typography>
          <Typography>
            Чтобы открыть новый курс нажмите кнопку &quot;Новый курс&quot;.
            <Typography>
              Открыть новый курс можно только, когда нет открытого курса. Для этого нажмите на кнопку &quot;Открыть
              курс&quot;.
            </Typography>
            <Typography>
              Закрыть курс можно только, когда его баланс положительный. При этом избыток средств будет зачислен в
              оплаты вне курсов. Для закрытия нажмите на кнопку &quot;Закрыть курс&quot;.
            </Typography>
            <Typography>
              Открыть закрытый курс можно только, если он был последним. Если после закрытия курса был открыт новый
              курс, то предыдущий уже открыть будет невозможно.
            </Typography>
          </Typography>
          <Typography style={{ marginTop: '5px', marginBottom: '5px' }}>
            <Typography.Text style={{ fontWeight: 'bold' }}>
              Чтобы добавить услугу нажмите на кновку &quot;Добавить услугу.&quot;{' '}
            </Typography.Text>
            После этого откроется окно добавления услуги.
            <Typography>
              Обязательные поля отмечены звездочкой. Услуги можно добавлять в курс, или же вне курса. Если открытого
              курса нет, то добавить услуги можно только вне курса.
            </Typography>
          </Typography>
          <Typography style={{ marginTop: '5px', marginBottom: '5px' }}>
            <Typography.Text style={{ fontWeight: 'bold' }}>
              Чтобы добавить оплату нажмите на кнопку &quot;Добавить оплату.&quot;{' '}
            </Typography.Text>
            После этого откроется окно добавления оплаты.
            <Typography>
              Обязательные поля отмечены звездочкой. Оплату можно добавлять в курс, или же вне курса. Если открытого
              курса нет, то добавить оплату можно только вне курса.
            </Typography>
            <Typography>
              Возможно выполнить оплату из авансовых платежей. Суммой авансовых платежей считается избыток средств
              платежей вне курса. Данный вид оплаты доступен только при избытке, если баланс услуг и оплат вне курса
              будет не положительный, то провести оплату из авансовых платежей будет невозможно.
            </Typography>
          </Typography>
          <Typography style={{ marginTop: '5px', marginBottom: '5px' }}>
            <Typography.Text style={{ fontWeight: 'bold' }}>
              Чтобы удалить оплату нажмите на необходимую оплату. В открытом окне нажмите на кнопку &quot;Удалить
              оплату&quot; и подтвердите удаление.{' '}
            </Typography.Text>
            <Typography>
              ОБРАТИТЕ ВНИМАНИЕ. Авансовые платежи можно удалить только из курса, в который были переведены средства.
            </Typography>
          </Typography>
          <Typography style={{ marginTop: '5px', marginBottom: '5px' }}>
            <Typography.Text style={{ fontWeight: 'bold' }}>
              Чтобы записать пациента на получение услуги:{' '}
            </Typography.Text>
            нажмите на интересующую услугу и в появившемся окне нажмите на кнопку &quot;Записать&quot;. После этого в
            новом окне выберите специалиста, время и подтвердите запись.
          </Typography>
          <Typography style={{ marginTop: '5px', marginBottom: '5px' }}>
            <Typography.Text style={{ fontWeight: 'bold' }}>
              Чтобы перенести запись пациента на получение услуги:{' '}
            </Typography.Text>
            нажмите на интересующую услугу и в появившемся окне нажмите на кнопку &quot;Перенести&quot;. После этого в
            новом окне выберите специалиста, время и подтвердите запись.
          </Typography>
          <Typography style={{ marginTop: '5px', marginBottom: '5px' }}>
            <Typography.Text style={{ fontWeight: 'bold' }}>
              Чтобы отменить запись пациента на получение услуги:{' '}
            </Typography.Text>
            нажмите на интересующую услугу и в появившемся окне нажмите на кнопку &quot;Перенести&quot;. После этого в
            новом окне нажмите на кнопку &quot;Отменить&quot;, подтвердите отмену.
          </Typography>
          <Typography style={{ fontWeight: 'bold', color: '#e60202', marginTop: '10px' }}>
            ОБРАТИТЕ ВНИМАНИЕ!
          </Typography>
          <Typography style={{ fontWeight: 'bold' }}>
            После закрытия курса все услуги и оплаты в его контексте становятся недоступными для редактирования.
          </Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px' }}>Раздел &quot;Расписание&quot;</Typography>
          {/* <Title level={5}>Раздел &quot;Представители&quot;</Title> */}
          <Typography>Здесь представлено расписание пациента.</Typography>
          <Typography>Для получения информации о конкретной услуге нажмите на ячейку.</Typography>
          <Typography>Из данного раздела также можно перенести или отменить запись.</Typography>
          <Divider />
          <Title level={4}>Представители</Title>
          <Typography>На данной вкладке доступна информация о всех представителях.</Typography>
          <Typography>
            Если Вы хотите добавить представителя нажмите на кнопку &quot;Добавить представителя&quot;. В открывшей
            форме внесите информацию о представителя и нажмите &quot;Сохранить&quot;. Если же Вы передумали добавлять
            представителя нажмите на кнопку &quot;Назад&quot;.
          </Typography>
          <Typography>
            Чтобы получить подробную информацию о представители перейдите на вкладку &quot;Представители&quot; и нажмите
            на строку с данными интересующего представителя.
          </Typography>
          <Typography style={{ marginBottom: '10px' }}>
            После этого откроется окно, где будет доступно два раздела:{' '}
          </Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;1. &quot;Данные&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;2. &quot;Пациенты&quot;;</Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>
            Раздел &quot;Данные&quot;
          </Typography>
          <Typography>
            Здесь представлены основные личные данные представителя. Если Вы хотите внести изменения, то нажмите на
            кнопку &quot;Редактировать&quot;. В открывшей форме внесите необходимые изменения и нажмите
            &quot;Сохранить&quot;. Если же Вы не хотите сохранить внесенные изменения нажмите на крестик в правом
            верхнем угле или на кнопку &quot;Отменить&quot;.
          </Typography>
          <Typography>
            Чтобы закрыть возможность работы с представителем, возможно его декативировать. Для этого нажмите на кнопку
            &quot;Деактивировать&quot;. После этого учетная запись представителя будет деактивирован и дальнейшая работа
            с ним, включая вход в систему, будет невозможна.
          </Typography>
          <Typography>Чтобы активировать представителя нажмите на кнопку &quot;Активировать&quot;.</Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>
            Раздел &quot;Пациенты&quot;
          </Typography>
          <Typography>Здесь имеется информация о пациентах данного представителя.</Typography>
          <Typography>
            Для удаления связи между представителем и пациентом нажмите на кнопку в самом правом столбце таблицы.
          </Typography>
          <Typography>Для установления связи между представителем и пациентом нажмите на одну из кнопок.</Typography>
          <Typography>
            &nbsp;&nbsp;&nbsp;&nbsp;1. &quot;Новый&quot;, если вы хотите добавить нового пациента. После этого откроется
            форма регистрации нового пациента.
          </Typography>
          <Typography>
            &nbsp;&nbsp;&nbsp;&nbsp;2. &quot;Добавить&quot;, если вы хотите выбрать уже имеющегося пацеинта. После этого
            откроется окно с таблицей для выбора пациента.
          </Typography>
          <Divider />
          <Title level={4}>Специалисты</Title>
          <Typography>На данной вкладке доступна информация о всех специалистах.</Typography>
          <Typography>
            Если Вы хотите добавить специалиста нажмите на кнопку &quot;Добавить специалиста&quot;. В открывшей форме
            внесите информацию о специалисте и нажмите &quot;Сохранить&quot;. Если же Вы передумали добавлять
            специалиста нажмите на кнопку &quot;Назад&quot;.
          </Typography>
          <Typography>
            Чтобы получить подробную информацию о специалисте перейдите на вкладку &quot;Специалисты&quot; и нажмите на
            строку с данными интересующего представителя.
          </Typography>
          <Typography style={{ marginBottom: '10px' }}>
            После этого откроется окно, где будет доступно два раздела:{' '}
          </Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;1. &quot;Данные&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;2. &quot;Расписание&quot;;</Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>
            Раздел &quot;Данные&quot;
          </Typography>
          <Typography>
            Здесь представлены основные личные данные специалиста. Если Вы хотите внести изменения, то нажмите на кнопку
            &quot;Редактировать&quot;. В открывшей форме внесите необходимые изменения и нажмите &quot;Сохранить&quot;.
            Если же Вы не хотите сохранить внесенные изменения нажмите на крестик в правом верхнем угле или на кнопку
            &quot;Назад&quot;.
          </Typography>
          <Typography>
            Чтобы закрыть возможность работы со специалистом, возможно его деактивировать. Для этого нажмите на кнопку
            &quot;Деактивировать&quot;. После этого учетная запись специалиста будет деактивирован и дальнейшая работа с
            ним, включая вход в систему, будет невозможна.
          </Typography>
          <Typography>Чтобы активировать специалиста нажмите на кнопку &quot;Активировать&quot;.</Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>
            Раздел &quot;Расписание&quot;
          </Typography>
          <Typography>Здесь имеется информация о расписании данного специалиста.</Typography>
          <Typography style={{ marginTop: '5px', marginBottom: '5px' }}>
            <Typography.Text style={{ fontWeight: 'bold' }}>
              Чтобы добавить запись и сформировать график работы специалиста:{' '}
            </Typography.Text>
            нажмите на кнопку &quot;Добавить запись&quot;. В открывшей форме внесите информацию о записях и нажмите
            &quot;Сохранить&quot;. Если же Вы передумали нажмите на кнопку &quot;Назад&quot;.
          </Typography>
          <Typography style={{ marginTop: '5px', marginBottom: '5px' }}>
            <Typography.Text style={{ fontWeight: 'bold' }}>Чтобы удалить запись: </Typography.Text>
            нажмите интересующую ячейку. В открывшемся окне нажмите на кнопку &quot;Удалить&quot;.
          </Typography>
          <Typography>Здесь также можно отменить или перенести запись пациента к данному специалисту</Typography>
          <Divider />
          <Title level={4}>Администраторы</Title>
          <Typography>На данной вкладке доступна информация о всех администраторах.</Typography>
          <Typography>
            Если Вы хотите добавить администратора нажмите на кнопку &quot;Добавить администратора&quot;. В открывшей
            форме внесите информацию о администраторе и нажмите &quot;Сохранить&quot;. Если же Вы передумали добавлять
            администратора нажмите на кнопку &quot;Назад&quot;.
          </Typography>
          <Typography>
            Чтобы получить подробную информацию о администраторе перейдите на вкладку &quot;Администраторы&quot; и
            нажмите на строку с данными интересующего администратора.
          </Typography>
          <Typography style={{ marginBottom: '10px' }}>
            После этого откроется окно, где будет доступен один раздел:{' '}
          </Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;1. &quot;Данные&quot;;</Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>
            Раздел &quot;Данные&quot;
          </Typography>
          <Typography>
            Здесь представлены основные личные данные администратора. Если Вы хотите внести изменения, то нажмите на
            кнопку &quot;Редактировать&quot;. В открывшей форме внесите необходимые изменения и нажмите
            &quot;Сохранить&quot;. Если же Вы не хотите сохранить внесенные изменения нажмите на крестик в правом
            верхнем угле или на кнопку &quot;Отменить&quot;.
          </Typography>
          <Typography>
            Чтобы закрыть возможность работы с администратором, возможно его декативировать. Для этого нажмите на кнопку
            &quot;Деактивировать&quot;. После этого учетная запись администратора будет деактивирован и дальнейшая
            работа с ним, включая вход в систему, будет невозможна.
          </Typography>
          <Typography>Чтобы активировать администратора нажмите на кнопку &quot;Активировать&quot;.</Typography>
          <Typography style={{ fontWeight: 'bold', color: '#e60202', marginTop: '10px' }}>
            ОБРАТИТЕ ВНИМАНИЕ!
          </Typography>
          <Typography style={{ fontWeight: 'bold' }}>
            Не деактивируйте свою учетную запись. Особенно если Вы являетесь единственным администратором. В таком
            случае для восстановления доступа будет необходимо обратиться к поставщику системы.
          </Typography>
          <Divider />
          <Title level={4}>Справочники</Title>
          <Typography style={{ marginBottom: '10px' }}>
            На данной вкладке доступна информация о справочниках системы:
          </Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;1. &quot;Источники рекламы&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;2. &quot;Специальности&quot;;</Typography>
          <Typography style={{ marginBottom: '10px' }}>&nbsp;&nbsp;&nbsp;&nbsp;3. &quot;Типы услуг&quot;.</Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>
            Источники рекламы
          </Typography>
          <Typography>В данном справочнике храниться информация об источниках рекламы.</Typography>
          <Typography>
            Если Вы хотите добавить источник нажмите на кнопку &quot;Добавить иточник&quot;. В открывшей форме внесите
            информацию об источнике и нажмите &quot;Сохранить&quot;. Если же Вы передумали нажмите на кнопку
            &quot;Назад&quot;.
          </Typography>
          <Typography>
            Для редактирования источника нажмите на строку с интересующим источником. В открывшей форме внесите
            необходимые изменения.
          </Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>Специальности</Typography>
          <Typography>В данном справочнике храниться информация о специальностях.</Typography>
          <Typography>
            Если Вы хотите добавить специальность нажмите на кнопку &quot;Добавить специальность&quot;. В открывшей
            форме внесите информацию о специальности и нажмите &quot;Сохранить&quot;. Если же Вы передумали нажмите на
            кнопку &quot;Назад&quot;.
          </Typography>
          <Typography>
            Для редактирования специальности нажмите на строку с интересующим источником. В открывшей форме внесите
            необходимые изменения.
          </Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>Типы услуг</Typography>
          <Typography>В данном справочнике храниться информация об услугах.</Typography>
          <Typography>
            Если Вы хотите добавить группу услуг нажмите на кнопку &quot;Добавить группу услуг&quot;. В открывшей форме
            внесите информацию о группе и нажмите &quot;Сохранить&quot;. Если же Вы передумали нажмите на кнопку
            &quot;Назад&quot;.
          </Typography>
          <Typography>
            Для редактирования группы нажмите на строку с интересующим группой. В открывшей форме внесите необходимые
            изменения.
          </Typography>
          <Typography>
            Если Вы хотите добавить услугу нажмите на кнопку &quot;Добавить услугу&quot;. В открывшей форме внесите
            информацию об услуге и нажмите &quot;Сохранить&quot;. Если же Вы передумали нажмите на кнопку
            &quot;Назад&quot;.
          </Typography>
          <Typography>
            Для редактирования услуги нажмите на строку с интересующей услугой. В открывшей форме внесите необходимые
            изменения.
          </Typography>
          <Divider />
          <Title level={4}>О компании</Title>
          <Typography>На данной вкладке доступна информация об организации.</Typography>
          <Divider />
          <Title level={4}>Остались вопросы?</Title>
          <Typography>По всем вопросам обращайтесь к администратору системы.</Typography>
          <Divider />{' '}
        </>
      ) : null}
      {isSpec ? (
        <>
          <Divider />
          <Title level={3}>Работа с системой</Title>
          <Typography style={{ fontWeight: 'bold', marginBottom: '10px' }}>
            Если Вы только начали работать с системой, то начните с заполнения справочников.
          </Typography>
          <Typography style={{ marginBottom: '10px' }}>
            После авторизации в системе на верхней панели станет доступны семь вкладок:
          </Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;1. &quot;Личные данные&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;2. &quot;Пациенты&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;3. &quot;Расписание&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;4. &quot;О компании&quot;.</Typography>
          <Divider />
          <Title level={4}>Личные данные</Title>
          <Typography>На данной вкладке доступна информация о личных данных пользователя.</Typography>
          <Typography>
            Если Вы хотите изменить логин, фамилию или прочую информацию нажмите на кнопку &quot;Редактировать&quot;. В
            открывшей форме внесите необходимые изменения и нажмите &quot;Сохранить&quot;. Если же Вы не хотите
            сохранить внесенные изменения нажмите на крестик в правом верхнем угле или на конпку &quot;Отменить&quot;.
          </Typography>
          <Title level={4}>Пациенты</Title>
          <Typography>На данной вкладке доступна информация о всех пациентах.</Typography>
          <Title level={4}>Карточка пациента</Title>
          <Typography>
            Чтобы открыть карточку пациента перейдите на вкладку &quot;Пациенты&quot; и нажмите на строку с данными
            конкретного пациента.
          </Typography>
          <Typography style={{ marginBottom: '10px' }}>В карточке пациента доступно четыре раздела: </Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;1. &quot;Данные&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;2. &quot;Представители&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;3. &quot;Услуги&quot;;</Typography>
          <Typography>&nbsp;&nbsp;&nbsp;&nbsp;4. &quot;Расписание&quot;.</Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>
            Раздел &quot;Данные&quot;
          </Typography>
          <Typography>Здесь представлены основные личные данные пациента.</Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>
            Раздел &quot;Представители&quot;
          </Typography>
          <Typography>Здесь имеется информация о представителях данного пациента.</Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>
            Раздел &quot;Услуги&quot;
          </Typography>
          <Typography>
            В данном разделе представлена информация обо всех услугах, которые были оказаны и будут оказаны пациенту.
          </Typography>
          <Typography>Зеленым оказанные услуги, желтым неоказанные услуги, красным просроченные услуги.</Typography>
          <Typography>Для получения информации о конкретной услуге нажмите на интересующую строку/карточку.</Typography>
          <Typography style={{ fontWeight: 'bold', marginTop: '10px' }}>Раздел &quot;Расписание&quot;</Typography>
          {/* <Title level={5}>Раздел &quot;Представители&quot;</Title> */}
          <Typography>Здесь представлено расписание пациента.</Typography>
          <Typography>Для получения информации о конкретной услуге нажмите на ячейку.</Typography>
          <Divider />
          <Title level={4}>Расписание</Title>
          <Typography>На данной вкладке доступна Ваше расписание.</Typography>
          <Typography>
            Если Вы хотите закрыть или открыть услугу нажмите на конкретную услугу. В открывшемся окне нажмите кнопку
            &quot;Открыть&quot;/&quot;Закрыть&quot;.
          </Typography>
          <Typography style={{ fontWeight: 'bold', color: '#e60202', marginTop: '10px' }}>
            ОБРАТИТЕ ВНИМАНИЕ!
          </Typography>
          <Typography style={{ fontWeight: 'bold' }}>
            Закрыть/открыть запись можно только в день оказания услуги. В остальных случаях закрытие/открытие происходит
            через администратора.
          </Typography>
          <Divider />
          <Title level={4}>О компании</Title>
          <Typography>На данной вкладке доступна информация об организации.</Typography>
          <Divider />
          <Title level={4}>Остались вопросы?</Title>
          <Typography>По всем вопросам обращайтесь к администратору системы.</Typography>
          <Divider />{' '}
        </>
      ) : null}
    </>
  );
};

export default HelpPage;
