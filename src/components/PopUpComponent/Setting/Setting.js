import React, { Component } from 'react';
import style from './Setting.css';

import { Row, Col, Card, Button, Input } from 'react-materialize';

const Setting = ( props )=>{
  return (
    <section className="Setting">
      <Card
        className='blue-grey lighten-1' 
        textClassName='white-text' 
        title='Editor' >
        <Row>
          <Col m={6} s={6}>
              <Card
                className='blue-grey darken-1' 
                textClassName='white-text' 
                title='Editor Theme' >
                <Row key={1}>
                  <Input id="editor-theme" s={12} type='select' label="afsdfafd" defaultValue='1'>
                    <option value='dracula'>dracula</option>
                    <option value='midnight'>midnight</option>
                  </Input>
                </Row>
              </Card>
          </Col>
          <Col m={6} s={6}>
              <Card 
                className='blue-grey darken-1' 
                textClassName='white-text' 
                title='Language' >
                <Row key={1} >
                  <Input id="editor-language"  s={12} type='select' label="afsdfafd" defaultValue='1'>
                    <option value='python'>python</option>
                    <option value='c'>c</option>
                    <option value='java'>java</option>
                  </Input>
                </Row>
              </Card>
          </Col>
        </Row>
        <Row>
          <Col m={6} s={6}>
              <Card
                className='blue-grey darken-1' 
                textClassName='white-text' 
                title='Font' >
                <Row key={1} >
                  <Input id="editor-font" s={12} type='select' label="afsdfafd" defaultValue='1'>
                    <option value='Arial'>Arial</option>
                    <option value='돋움'>돋움</option>
                  </Input>
                </Row>
              </Card>
          </Col>
          <Col m={6} s={6}>
              <Card 
                className='blue-grey darken-1' 
                textClassName='white-text' 
                title='Font Size' >
                <Row key={1} >
                  <Input id="editor-fontSize" s={12} type='select' label="afsdfafd" defaultValue='1'>
                    <option value='15px'>15px</option>
                    <option value='16px'>16px</option>
                    <option value='18px'>18px</option>
                    <option value='20px'>20px</option>
                  </Input>
                </Row>
              </Card>
          </Col>
        </Row>
        <Row>
          <Col m={12} s={6}>
            <Button
              onClick={ props.onSave }>
              Save
            </Button>
            <Button
              onClick={ props.onClosePopUp }>
              Cancle
            </Button>
          </Col>
        </Row>
      </Card>
    </section>
  );
}

export default Setting