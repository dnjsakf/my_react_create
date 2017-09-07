import React, { Component } from 'react';
import style from './Notice.css';
import { convertTable } from './../../../utility/converter';

import { Row, Col, Button, Table, Pagination } from 'react-materialize';

const Notice = ( props )=>{
  if( typeof props.default === 'undefined' ) return null;

  const tableOption = {
    except:['topic', 'content'],
    // onClick: {
    //   records: false
    // },
  }
  const tableItems = convertTable( props.default, tableOption );

  return (
    <section className="Notice">
      <Row className="header">
        <Col m={12} s={12}>
          토픽
        </Col>
      </Row>
      <Row className="content">
        <Col m={12} s={12}>
          <Table>
            <thead>
              { tableItems.headers }
            </thead>
            <tbody>
              { tableItems.rows }
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="pages">
        <Pagination 
          items={ 3 }  // 으어어 이거 리미트도 설정해줘야되네
          activePage={1}
          maxButtons={8} 
          onSelect={ (page)=>{ props.onPage(page) } } />
      </Row>
      <Row className="buttons">
        <Col m={12} s={6}>
          <Button
            onClick={ props.onClose }>
            Cancle
          </Button>
        </Col>
      </Row>
    </section>
  );
}

export default Notice