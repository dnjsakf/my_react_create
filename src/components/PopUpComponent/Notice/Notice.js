import React, { Component } from 'react';
import style from './Notice.css';
import { convertTable } from './../../../utility/converter';

import NoticeBoard from './NoticeBoard/NoticeBoard';

import { Row, Col, Button, Table, Pagination } from 'react-materialize';

const Notice = ( props )=>{
  if( typeof props.default === 'undefined' ) return null;
  if( typeof props.default.records === 'undefined' ) return null;

  if( typeof props.info === 'undefined' ) return null;

  let toggle = props.info.toggle;

  const tableOption = {
    except:['topic', 'content'],
    onClick: {
      records: props.onSelectNotice
    },
  }
  const tableItems = convertTable( props.default.records, tableOption );

  console.log( props.info );
  console.log( props.default.records );

  let list, detail;
  if( toggle ){
    list = (
      <div className="notice-list animated p5s fadeInLeft">
        <Row className="content">
          <Col m={12} s={12}>
            <Table className="highlight centered responsive-table">
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
            items={ props.default.maxPage }
            activePage={1}
            maxButtons={ props.default.maxPage } 
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
      </div>
    );
  } else {
    detail = (
      <NoticeBoard 
        no={ props.default.records[props.info.record].no }
        subject={ props.default.records[props.info.record].subject }
        date={ props.default.records[props.info.record].date }
        content={ props.default.records[props.info.record].content }
        onBackNotice={ props.onBackNotice }
      />
    )
  }


  return (
    <section className="Notice">
      {/* 아 토픽하지말까 */}
      <Row className="header">
        <Col m={12} s={12}>
          토픽
        </Col>
      </Row>
      { toggle ? list : detail }
    </section>
  );
}

export default Notice